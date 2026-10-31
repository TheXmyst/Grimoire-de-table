-- Révélations : le MJ envoie un message privé (texte, image ou vidéo) à un, plusieurs ou tous les joueurs.
-- Seuls les joueurs ciblés peuvent le lire ; le joueur est libre de le partager ou non.

create table if not exists public.map_messages (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  to_chars uuid[],                       -- personnages ciblés ; null = tous les joueurs
  title text not null default '',
  body text not null default '',
  media_url text not null default '',
  media_type text not null default '' check (media_type in ('', 'image', 'video', 'youtube')),
  created_at timestamptz not null default now()
);
create index if not exists map_messages_campaign_idx on public.map_messages (campaign_id, created_at desc);

-- Le joueur connecté possède-t-il l'un de ces personnages ?
create or replace function public.owns_any_character(ids uuid[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from characters where id = any (ids) and player_id = auth.uid());
$$;

alter table public.map_messages enable row level security;

drop policy if exists "MJ et joueurs ciblés lisent" on public.map_messages;
create policy "MJ et joueurs ciblés lisent" on public.map_messages
  for select using (
    is_gm(campaign_id)
    or (is_member(campaign_id) and (to_chars is null or owns_any_character(to_chars)))
  );
drop policy if exists "le MJ envoie" on public.map_messages;
create policy "le MJ envoie" on public.map_messages
  for insert with check (is_gm(campaign_id));
drop policy if exists "le MJ retire" on public.map_messages;
create policy "le MJ retire" on public.map_messages
  for delete using (is_gm(campaign_id));

-- Stockage des images et vidéos (dossier = identifiant de la campagne, réservé au MJ de cette campagne)
insert into storage.buckets (id, name, public, file_size_limit)
values ('carte-media', 'carte-media', true, 52428800)
on conflict (id) do nothing;

drop policy if exists "MJ envoie des médias" on storage.objects;
create policy "MJ envoie des médias" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'carte-media' and public.is_gm(((storage.foldername(name))[1])::uuid));
drop policy if exists "MJ retire ses médias" on storage.objects;
create policy "MJ retire ses médias" on storage.objects
  for delete to authenticated
  using (bucket_id = 'carte-media' and public.is_gm(((storage.foldername(name))[1])::uuid));
