-- La carte animée : positions des jetons, état de la table (qui peut bouger) et cases bloquées.
-- Le MJ pilote tout ; un joueur ne peut déplacer que le jeton de son propre personnage,
-- et seulement quand le MJ l'autorise (mode libre, ou c'est son tour).

create table if not exists public.map_state (
  campaign_id uuid primary key references public.campaigns (id) on delete cascade,
  map text not null default 'taverne',
  lock text not null default 'locked' check (lock in ('free', 'locked', 'turn')),
  turn_char uuid references public.characters (id) on delete set null,
  blocked jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.map_tokens (
  id text primary key,
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  map text not null,
  kind text not null default 'pj',
  name text not null default '',
  x numeric not null,
  y numeric not null,
  ox numeric,
  oy numeric,
  size numeric not null default 1,
  color text not null default '#888888',
  dead boolean not null default false,
  hidden boolean not null default false,
  speed numeric,
  cid uuid references public.characters (id) on delete cascade,
  updated_at timestamptz not null default now()
);
create index if not exists map_tokens_campaign_idx on public.map_tokens (campaign_id);

-- Un joueur a-t-il le droit de bouger ce personnage en ce moment ?
create or replace function public.can_move_token(c uuid, ch uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from map_state s
    where s.campaign_id = c
      and (s.lock = 'free' or (s.lock = 'turn' and s.turn_char = ch))
  );
$$;

-- Un joueur ne change que la position (x, y) de son jeton, rien d'autre
create or replace function public.guard_map_token_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if is_gm(old.campaign_id) then
    new.updated_at := now();
    return new;
  end if;
  if (new.id, new.campaign_id, new.map, new.kind, new.name, new.ox, new.oy, new.size, new.color, new.dead, new.hidden, new.speed, new.cid)
     is distinct from
     (old.id, old.campaign_id, old.map, old.kind, old.name, old.ox, old.oy, old.size, old.color, old.dead, old.hidden, old.speed, old.cid) then
    raise exception 'Un joueur ne peut changer que la position de son jeton';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists map_tokens_guard on public.map_tokens;
create trigger map_tokens_guard before update on public.map_tokens
  for each row execute function public.guard_map_token_update();

alter table public.map_state enable row level security;
alter table public.map_tokens enable row level security;

drop policy if exists "membres voient l'état de la table" on public.map_state;
create policy "membres voient l'état de la table" on public.map_state
  for select using (is_member(campaign_id));
drop policy if exists "le MJ crée l'état de la table" on public.map_state;
create policy "le MJ crée l'état de la table" on public.map_state
  for insert with check (is_gm(campaign_id));
drop policy if exists "le MJ modifie l'état de la table" on public.map_state;
create policy "le MJ modifie l'état de la table" on public.map_state
  for update using (is_gm(campaign_id)) with check (is_gm(campaign_id));
drop policy if exists "le MJ supprime l'état de la table" on public.map_state;
create policy "le MJ supprime l'état de la table" on public.map_state
  for delete using (is_gm(campaign_id));

drop policy if exists "MJ voit tous les jetons, joueurs ceux non cachés" on public.map_tokens;
create policy "MJ voit tous les jetons, joueurs ceux non cachés" on public.map_tokens
  for select using (is_gm(campaign_id) or (is_member(campaign_id) and not hidden));
drop policy if exists "le MJ crée les jetons" on public.map_tokens;
create policy "le MJ crée les jetons" on public.map_tokens
  for insert with check (is_gm(campaign_id));
drop policy if exists "MJ ou propriétaire (si autorisé) déplace" on public.map_tokens;
create policy "MJ ou propriétaire (si autorisé) déplace" on public.map_tokens
  for update
  using (is_gm(campaign_id) or (cid is not null and owns_character(cid) and can_move_token(campaign_id, cid)))
  with check (is_gm(campaign_id) or (cid is not null and owns_character(cid) and can_move_token(campaign_id, cid)));
drop policy if exists "le MJ retire les jetons" on public.map_tokens;
create policy "le MJ retire les jetons" on public.map_tokens
  for delete using (is_gm(campaign_id));
