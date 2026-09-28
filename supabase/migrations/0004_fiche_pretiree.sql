-- Tout ce qu'une fiche papier contient : alignement, dés de vie, jets contre la mort,
-- capacités, maîtrises et langues, incantation, inspiration et conseils de jeu

alter table public.characters
  add column alignment text not null default '',
  add column ac_note text not null default '',
  add column hit_dice_used int not null default 0,
  add column death_successes int not null default 0 check (death_successes between 0 and 3),
  add column death_failures int not null default 0 check (death_failures between 0 and 3),
  add column inspiration boolean not null default false,
  -- {"armures":"…","armes":"…","outils":"…","langues":"…"}
  add column proficiencies jsonb not null default '{}',
  -- [{"name":"Second souffle","source":"Guerrier","description":"…"}]
  add column features jsonb not null default '[]',
  -- Vide = caractéristique d'incantation de la classe
  add column spell_ability text not null default '',
  add column spell_notes text not null default '',
  add column pitch text not null default '',
  add column play_guide text not null default '';

-- Vitesse en mètres avec décimale (7,5 m pour un halfelin ou un nain)
alter table public.characters alter column speed type numeric(4,1);

-- Étiquette libre sur un sort appris : « Domaine », « Grimoire », « Race »…
alter table public.character_spells add column tag text not null default '';

-- Le joueur gère ses dés de vie (selon le réglage PV), ses jets contre la mort et son inspiration ;
-- le reste des nouveaux champs appartient au MJ
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
     or new.subclass is distinct from old.subclass
     or new.race is distinct from old.race
     or new.background is distinct from old.background
     or new.alignment is distinct from old.alignment
     or new.level is distinct from old.level
     or new.xp is distinct from old.xp
     or new.abilities is distinct from old.abilities
     or new.save_profs is distinct from old.save_profs
     or new.skill_profs is distinct from old.skill_profs
     or new.skill_expertise is distinct from old.skill_expertise
     or new.hp_max is distinct from old.hp_max
     or new.ac is distinct from old.ac
     or new.ac_note is distinct from old.ac_note
     or new.speed is distinct from old.speed
     or new.proficiencies is distinct from old.proficiencies
     or new.features is distinct from old.features
     or new.spell_ability is distinct from old.spell_ability
     or new.spell_notes is distinct from old.spell_notes
     or new.pitch is distinct from old.pitch
     or new.play_guide is distinct from old.play_guide then
    raise exception 'Seul le MJ peut modifier ce champ';
  end if;
  if not coalesce((s ->> 'players_edit_hp')::boolean, true)
     and (new.hp is distinct from old.hp
          or new.temp_hp is distinct from old.temp_hp
          or new.hit_dice_used is distinct from old.hit_dice_used) then
    raise exception 'Le MJ gère les points de vie dans cette campagne';
  end if;
  if not coalesce((s ->> 'players_edit_inventory')::boolean, true)
     and (new.inventory is distinct from old.inventory
          or new.coins is distinct from old.coins
          or new.attacks is distinct from old.attacks) then
    raise exception 'Le MJ gère l''inventaire dans cette campagne';
  end if;
  return new;
end $$;
