-- Le reste de la fiche du Manuel des joueurs : états, épuisement, concentration,
-- ressources de classe, objets magiques, défenses et détails du personnage

alter table public.characters
  -- ["à terre","empoisonné"]
  add column conditions text[] not null default '{}',
  add column exhaustion int not null default 0 check (exhaustion between 0 and 6),
  -- Nom du sort maintenu, vide sinon
  add column concentration text not null default '',
  -- [{"name":"Rage","max":2,"used":0,"reset":"long"}]
  add column resources jsonb not null default '[]',
  -- [{"name":"Cape de protection","attuned":true,"description":"+1 CA et sauvegardes"}]
  add column magic_items jsonb not null default '[]',
  -- {"resistances":"…","immunities":"…","vulnerabilities":"…","senses":"…"}
  add column defenses jsonb not null default '{}',
  -- {"age":"…","height":"…","weight":"…","eyes":"…","skin":"…","hair":"…","appearance":"…","allies":"…","treasure":"…"}
  add column details jsonb not null default '{}';

-- Les ressources sans leur compteur « used » : ce que seul le MJ définit
create or replace function public.resource_shape(r jsonb)
returns jsonb language sql immutable as $$
  select coalesce(jsonb_agg(e - 'used' order by i), '[]'::jsonb)
  from jsonb_array_elements(coalesce(r, '[]'::jsonb)) with ordinality as t(e, i)
$$;

-- Le joueur gère ses états, son épuisement, sa concentration, ce qu'il a dépensé de ses
-- ressources et ses détails ; le MJ crée les ressources et fixe les défenses.
-- Les objets magiques suivent le réglage de l'inventaire.
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
     or new.play_guide is distinct from old.play_guide
     or new.defenses is distinct from old.defenses
     or resource_shape(new.resources) is distinct from resource_shape(old.resources) then
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
          or new.attacks is distinct from old.attacks
          or new.magic_items is distinct from old.magic_items) then
    raise exception 'Le MJ gère l''inventaire dans cette campagne';
  end if;
  return new;
end $$;
