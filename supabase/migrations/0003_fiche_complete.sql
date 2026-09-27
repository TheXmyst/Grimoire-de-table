-- Fiche complète : sous-classe, maîtrises, attaques, pièces et rôleplay

alter table public.characters
  add column subclass text not null default '',
  -- Codes de caractéristique maîtrisés en sauvegarde : {"DEX","INT"}
  add column save_profs text[] not null default '{}',
  -- Clés de compétence maîtrisées / en expertise : {"perception","discretion"}
  add column skill_profs text[] not null default '{}',
  add column skill_expertise text[] not null default '{}',
  -- [{"name":"Masse d'armes","ability":"FOR","proficient":true,"dice":"1d6","type":"contondant","bonus":0}]
  add column attacks jsonb not null default '[]',
  add column coins jsonb not null default '{"pc":0,"pa":0,"pe":0,"po":0,"pp":0}',
  add column traits text not null default '',
  add column ideals text not null default '',
  add column bonds text not null default '',
  add column flaws text not null default '',
  add column backstory text not null default '';

-- Le joueur gère son rôleplay ; maîtrises et sous-classe restent au MJ ;
-- attaques et pièces suivent le réglage « inventaire »
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
     or new.level is distinct from old.level
     or new.xp is distinct from old.xp
     or new.abilities is distinct from old.abilities
     or new.save_profs is distinct from old.save_profs
     or new.skill_profs is distinct from old.skill_profs
     or new.skill_expertise is distinct from old.skill_expertise
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
     and (new.inventory is distinct from old.inventory
          or new.coins is distinct from old.coins
          or new.attacks is distinct from old.attacks) then
    raise exception 'Le MJ gère l''inventaire dans cette campagne';
  end if;
  return new;
end $$;
