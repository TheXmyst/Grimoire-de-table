import type { Abilities, Attack, CoinKey, Feature } from './rules';

export type CampaignSettings = {
  ruleset: string;
  players_edit_hp: boolean;
  players_edit_inventory: boolean;
  spell_approval: boolean;
  /** Règle optionnelle : malus d'encombrement des armures */
  armor_encumbrance?: boolean;
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
  subclass: string;
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
  save_profs: string[];
  skill_profs: string[];
  skill_expertise: string[];
  attacks: Attack[];
  coins: Record<CoinKey, number>;
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
  alignment: string;
  ac_note: string;
  hit_dice_used: number;
  death_successes: number;
  death_failures: number;
  inspiration: boolean;
  proficiencies: Partial<Record<'armures' | 'armes' | 'outils' | 'langues', string>>;
  features: Feature[];
  spell_ability: string;
  spell_notes: string;
  pitch: string;
  play_guide: string;
  conditions: string[];
  exhaustion: number;
  concentration: string;
  resources: Resource[];
  magic_items: MagicItem[];
  defenses: Partial<Record<DefenseKey, string>>;
  details: Partial<Record<DetailKey, string>>;
};

/** Ressource de classe à usages limités : rage, ki, conduit divin… */
export type Resource = { name: string; max: number; used: number; reset: 'court' | 'long' };
export type MagicItem = { name: string; attuned: boolean; description: string };
export type DefenseKey = 'resistances' | 'immunities' | 'vulnerabilities' | 'senses';
export type DetailKey = 'age' | 'height' | 'weight' | 'eyes' | 'skin' | 'hair' | 'appearance' | 'allies' | 'treasure';

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
  tag: string;
  spells: Spell;
};
