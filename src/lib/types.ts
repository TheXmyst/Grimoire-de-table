import type { Abilities } from './rules';

export type CampaignSettings = {
  ruleset: string;
  players_edit_hp: boolean;
  players_edit_inventory: boolean;
  spell_approval: boolean;
};

export type Campaign = {
  id: string;
  name: string;
  gm_id: string;
  invite_code: string;
  settings: CampaignSettings;
};

export type Member = {
  campaign_id: string;
  user_id: string;
  role: 'gm' | 'player';
  profiles: { display_name: string } | null;
};

export type Character = {
  id: string;
  campaign_id: string;
  player_id: string | null;
  name: string;
  class: string;
  race: string;
  background: string;
  level: number;
  xp: number;
  abilities: Abilities;
  hp: number;
  hp_max: number;
  temp_hp: number;
  ac: number;
  speed: number;
  slots_used: Record<string, number>;
  inventory: string;
  notes: string;
};

export type Spell = {
  id: string;
  campaign_id: string | null;
  name: string;
  level: number;
  school: string;
  classes: string[];
  casting_time: string;
  range: string;
  components: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
};

export type CharacterSpell = {
  character_id: string;
  spell_id: string;
  status: 'pending' | 'approved';
  prepared: boolean;
  spells: Spell;
};
