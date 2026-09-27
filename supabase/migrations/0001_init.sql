-- Grimoire de Table : schéma initial
-- Comptes, campagnes, invitations, fiches de personnage, sorts.

create extension if not exists pgcrypto;

-- Profils (un par compte Supabase Auth)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Aventurier',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Campagnes
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gm_id uuid not null references public.profiles (id) on delete cascade,
  invite_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  -- Réglages du MJ : ce que les joueurs peuvent faire eux-mêmes
  settings jsonb not null default jsonb_build_object(
    'ruleset', '5e-2014',
    'players_edit_hp', true,
    'players_edit_inventory', true,
    'spell_approval', true
  ),
  created_at timestamptz not null default now()
);

create table public.campaign_members (
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('gm', 'player')),
  joined_at timestamptz not null default now(),
  primary key (campaign_id, user_id)
);

-- Le MJ devient membre automatiquement
create or replace function public.add_gm_membership()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.campaign_members (campaign_id, user_id, role) values (new.id, new.gm_id, 'gm');
  return new;
end $$;

create trigger on_campaign_created
  after insert on public.campaigns
  for each row execute function public.add_gm_membership();

-- Fiches de personnage
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  player_id uuid references public.profiles (id) on delete set null,
  name text not null,
  class text not null default 'Guerrier',
  race text not null default 'Humain',
  background text not null default '',
  level int not null default 1 check (level between 1 and 20),
  xp int not null default 0,
  abilities jsonb not null default '{"FOR":10,"DEX":10,"CON":10,"INT":10,"SAG":10,"CHA":10}',
  hp int not null default 10,
  hp_max int not null default 10,
  temp_hp int not null default 0,
  ac int not null default 10,
  speed int not null default 9,
  -- Emplacements de sorts dépensés, par niveau : {"1": 2, "2": 0}
  slots_used jsonb not null default '{}',
  inventory text not null default '',
  notes text not null default '',
  updated_at timestamptz not null default now()
);

create index characters_campaign_idx on public.characters (campaign_id);
create index characters_player_idx on public.characters (player_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger characters_touch before update on public.characters
  for each row execute function public.touch_updated_at();

-- Sorts : campaign_id null = sort du SRD, partagé par tous
create table public.spells (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns (id) on delete cascade,
  name text not null,
  level int not null check (level between 0 and 9),
  school text not null default '',
  classes text[] not null default '{}',
  casting_time text not null default '1 action',
  range text not null default '',
  components text not null default '',
  duration text not null default '',
  concentration boolean not null default false,
  ritual boolean not null default false,
  description text not null default ''
);

create index spells_campaign_idx on public.spells (campaign_id);

create table public.character_spells (
  character_id uuid not null references public.characters (id) on delete cascade,
  spell_id uuid not null references public.spells (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved')),
  prepared boolean not null default true,
  added_at timestamptz not null default now(),
  primary key (character_id, spell_id)
);

-- Helpers pour les règles d'accès
create or replace function public.is_member(c uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from campaign_members where campaign_id = c and user_id = auth.uid());
$$;

create or replace function public.is_gm(c uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from campaigns where id = c and gm_id = auth.uid());
$$;

create or replace function public.character_campaign(ch uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select campaign_id from characters where id = ch;
$$;

create or replace function public.owns_character(ch uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from characters where id = ch and player_id = auth.uid());
$$;

-- Rejoindre une campagne avec son code d'invitation
create or replace function public.join_campaign(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare c uuid;
begin
  select id into c from campaigns where invite_code = upper(trim(code));
  if c is null then raise exception 'Code d''invitation inconnu'; end if;
  insert into campaign_members (campaign_id, user_id, role)
  values (c, auth.uid(), 'player') on conflict do nothing;
  return c;
end $$;

-- Un joueur ne peut modifier que certains champs de sa fiche, selon les réglages du MJ
create or replace function public.guard_player_character_update()
returns trigger language plpgsql security definer set search_path = public as $$
declare s jsonb;
begin
  if is_gm(old.campaign_id) then return new; end if;
  select settings into s from campaigns where id = old.campaign_id;
  if new.campaign_id is distinct from old.campaign_id
     or new.player_id is distinct from old.player_id
     or new.name is distinct from old.name
     or new.class is distinct from old.class
     or new.race is distinct from old.race
     or new.background is distinct from old.background
     or new.level is distinct from old.level
     or new.xp is distinct from old.xp
     or new.abilities is distinct from old.abilities
     or new.hp_max is distinct from old.hp_max
     or new.ac is distinct from old.ac
     or new.speed is distinct from old.speed then
    raise exception 'Seul le MJ peut modifier ce champ';
  end if;
  if not coalesce((s ->> 'players_edit_hp')::boolean, true)
     and (new.hp is distinct from old.hp or new.temp_hp is distinct from old.temp_hp) then
    raise exception 'Le MJ gère les points de vie dans cette campagne';
  end if;
  if not coalesce((s ->> 'players_edit_inventory')::boolean, true)
     and new.inventory is distinct from old.inventory then
    raise exception 'Le MJ gère l''inventaire dans cette campagne';
  end if;
  return new;
end $$;

create trigger characters_player_guard before update on public.characters
  for each row execute function public.guard_player_character_update();

-- Les joueurs ajoutent des sorts « en attente » si le MJ valide les choix
create or replace function public.guard_character_spell()
returns trigger language plpgsql security definer set search_path = public as $$
declare c uuid; s jsonb;
begin
  c := character_campaign(new.character_id);
  if is_gm(c) then return new; end if;
  select settings into s from campaigns where id = c;
  if tg_op = 'INSERT' then
    new.status := case when coalesce((s ->> 'spell_approval')::boolean, true) then 'pending' else 'approved' end;
  elsif new.status is distinct from old.status then
    raise exception 'Seul le MJ valide les sorts';
  end if;
  return new;
end $$;

create trigger character_spells_guard before insert or update on public.character_spells
  for each row execute function public.guard_character_spell();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_members enable row level security;
alter table public.characters enable row level security;
alter table public.spells enable row level security;
alter table public.character_spells enable row level security;

create policy "profil visible par tous les connectés" on public.profiles
  for select to authenticated using (true);
create policy "je modifie mon profil" on public.profiles
  for update to authenticated using (id = auth.uid());

create policy "membres voient la campagne" on public.campaigns
  for select to authenticated using (is_member(id) or gm_id = auth.uid());
create policy "je crée une campagne" on public.campaigns
  for insert to authenticated with check (gm_id = auth.uid());
create policy "le MJ modifie" on public.campaigns
  for update to authenticated using (gm_id = auth.uid());
create policy "le MJ supprime" on public.campaigns
  for delete to authenticated using (gm_id = auth.uid());

create policy "membres voient les membres" on public.campaign_members
  for select to authenticated using (is_member(campaign_id));
create policy "le MJ retire un membre, ou je pars" on public.campaign_members
  for delete to authenticated using (is_gm(campaign_id) or user_id = auth.uid());

create policy "MJ voit tout, joueur voit ses fiches" on public.characters
  for select to authenticated using (is_gm(campaign_id) or player_id = auth.uid());
create policy "le MJ crée les fiches" on public.characters
  for insert to authenticated with check (is_gm(campaign_id));
create policy "MJ ou propriétaire modifie" on public.characters
  for update to authenticated using (is_gm(campaign_id) or player_id = auth.uid());
create policy "le MJ supprime les fiches" on public.characters
  for delete to authenticated using (is_gm(campaign_id));

create policy "sorts SRD et sorts de mes campagnes" on public.spells
  for select to authenticated using (campaign_id is null or is_member(campaign_id));
create policy "le MJ ajoute des sorts maison" on public.spells
  for insert to authenticated with check (campaign_id is not null and is_gm(campaign_id));
create policy "le MJ modifie ses sorts" on public.spells
  for update to authenticated using (campaign_id is not null and is_gm(campaign_id));
create policy "le MJ supprime ses sorts" on public.spells
  for delete to authenticated using (campaign_id is not null and is_gm(campaign_id));

create policy "voir les sorts d'une fiche visible" on public.character_spells
  for select to authenticated using (is_gm(character_campaign(character_id)) or owns_character(character_id));
create policy "ajouter un sort" on public.character_spells
  for insert to authenticated with check (is_gm(character_campaign(character_id)) or owns_character(character_id));
create policy "modifier un sort" on public.character_spells
  for update to authenticated using (is_gm(character_campaign(character_id)) or owns_character(character_id));
create policy "retirer un sort" on public.character_spells
  for delete to authenticated using (is_gm(character_campaign(character_id)) or owns_character(character_id));

-- Temps réel : les fiches se mettent à jour en direct chez les joueurs
alter publication supabase_realtime add table public.characters, public.character_spells, public.campaign_members;
