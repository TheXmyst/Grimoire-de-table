// Règles D&D 5e (2014) utilisées par l'app.

export const ABILITIES = [
  { key: 'FOR', label: 'Force' },
  { key: 'DEX', label: 'Dextérité' },
  { key: 'CON', label: 'Constitution' },
  { key: 'INT', label: 'Intelligence' },
  { key: 'SAG', label: 'Sagesse' },
  { key: 'CHA', label: 'Charisme' },
] as const;

export type AbilityKey = (typeof ABILITIES)[number]['key'];
export type Abilities = Record<AbilityKey, number>;

export const modifier = (score: number) => Math.floor((score - 10) / 2);
export const signed = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
export const proficiencyBonus = (level: number) => 2 + Math.floor((Math.max(1, level) - 1) / 4);

type Caster = 'full' | 'half' | 'pact' | 'none';

export const CLASSES: { name: string; caster: Caster; hitDie: number }[] = [
  { name: 'Barbare', caster: 'none', hitDie: 12 },
  { name: 'Barde', caster: 'full', hitDie: 8 },
  { name: 'Clerc', caster: 'full', hitDie: 8 },
  { name: 'Druide', caster: 'full', hitDie: 8 },
  { name: 'Ensorceleur', caster: 'full', hitDie: 6 },
  { name: 'Guerrier', caster: 'none', hitDie: 10 },
  { name: 'Magicien', caster: 'full', hitDie: 6 },
  { name: 'Moine', caster: 'none', hitDie: 8 },
  { name: 'Occultiste', caster: 'pact', hitDie: 8 },
  { name: 'Paladin', caster: 'half', hitDie: 10 },
  { name: 'Rôdeur', caster: 'half', hitDie: 10 },
  { name: 'Roublard', caster: 'none', hitDie: 8 },
];

const casterOf = (cls: string): Caster => CLASSES.find((c) => c.name === cls)?.caster ?? 'none';

// Emplacements de sorts d'un lanceur complet, par niveau de personnage (PHB p.113 et suivantes)
const FULL_SLOTS: number[][] = [
  [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/** Nombre d'emplacements par niveau de sort (index 0 = niveau 1). */
export function spellSlots(cls: string, level: number): number[] {
  const l = Math.min(20, Math.max(1, level));
  switch (casterOf(cls)) {
    case 'full':
      return FULL_SLOTS[l - 1];
    case 'half':
      // Paladin et rôdeur : table d'un lanceur complet de niveau moitié, à partir du niveau 2
      return l < 2 ? [] : FULL_SLOTS[Math.ceil(l / 2) - 1];
    case 'pact': {
      const count = l === 1 ? 1 : l <= 10 ? 2 : l <= 16 ? 3 : 4;
      const slotLevel = Math.min(5, Math.ceil(l / 2));
      return Array.from({ length: slotLevel }, (_, i) => (i === slotLevel - 1 ? count : 0));
    }
    default:
      return [];
  }
}

/** Niveau de sort le plus élevé accessible (0 = uniquement des sorts mineurs, -1 = aucun sort). */
export function maxSpellLevel(cls: string, level: number): number {
  const caster = casterOf(cls);
  if (caster === 'none') return -1;
  const slots = spellSlots(cls, level);
  if (slots.length === 0) return caster === 'half' ? -1 : 0;
  return slots.length;
}

export const hasCantrips = (cls: string) => ['full', 'pact'].includes(casterOf(cls));

export const SPELL_LEVEL_LABEL = (lvl: number) => (lvl === 0 ? 'Sort mineur' : `Niveau ${lvl}`);

export const SKILLS: { key: string; label: string; ability: AbilityKey }[] = [
  { key: 'acrobaties', label: 'Acrobaties', ability: 'DEX' },
  { key: 'arcanes', label: 'Arcanes', ability: 'INT' },
  { key: 'athletisme', label: 'Athlétisme', ability: 'FOR' },
  { key: 'discretion', label: 'Discrétion', ability: 'DEX' },
  { key: 'dressage', label: 'Dressage', ability: 'SAG' },
  { key: 'escamotage', label: 'Escamotage', ability: 'DEX' },
  { key: 'histoire', label: 'Histoire', ability: 'INT' },
  { key: 'intimidation', label: 'Intimidation', ability: 'CHA' },
  { key: 'investigation', label: 'Investigation', ability: 'INT' },
  { key: 'medecine', label: 'Médecine', ability: 'SAG' },
  { key: 'nature', label: 'Nature', ability: 'INT' },
  { key: 'perception', label: 'Perception', ability: 'SAG' },
  { key: 'perspicacite', label: 'Perspicacité', ability: 'SAG' },
  { key: 'persuasion', label: 'Persuasion', ability: 'CHA' },
  { key: 'religion', label: 'Religion', ability: 'INT' },
  { key: 'representation', label: 'Représentation', ability: 'CHA' },
  { key: 'survie', label: 'Survie', ability: 'SAG' },
  { key: 'tromperie', label: 'Tromperie', ability: 'CHA' },
];

/** Sauvegardes maîtrisées d'office par classe (PHB). */
export const CLASS_SAVES: Record<string, AbilityKey[]> = {
  Barbare: ['FOR', 'CON'],
  Barde: ['DEX', 'CHA'],
  Clerc: ['SAG', 'CHA'],
  Druide: ['INT', 'SAG'],
  Ensorceleur: ['CON', 'CHA'],
  Guerrier: ['FOR', 'CON'],
  Magicien: ['INT', 'SAG'],
  Moine: ['FOR', 'DEX'],
  Occultiste: ['SAG', 'CHA'],
  Paladin: ['SAG', 'CHA'],
  Rôdeur: ['FOR', 'DEX'],
  Roublard: ['DEX', 'INT'],
};

/** Nom de la sous-classe selon la classe, pour l'étiquette du champ. */
export const SUBCLASS_LABEL: Record<string, string> = {
  Barbare: 'Voie primitive',
  Barde: 'Collège bardique',
  Clerc: 'Domaine divin',
  Druide: 'Cercle druidique',
  Ensorceleur: 'Origine magique',
  Guerrier: 'Archétype martial',
  Magicien: 'Tradition arcanique',
  Moine: 'Tradition monastique',
  Occultiste: 'Patron d’outre-monde',
  Paladin: 'Serment sacré',
  Rôdeur: 'Archétype de rôdeur',
  Roublard: 'Archétype de roublard',
};

export const COINS = [
  { key: 'pc', label: 'PC', name: 'Cuivre' },
  { key: 'pa', label: 'PA', name: 'Argent' },
  { key: 'pe', label: 'PE', name: 'Électrum' },
  { key: 'po', label: 'PO', name: 'Or' },
  { key: 'pp', label: 'PP', name: 'Platine' },
] as const;

export type CoinKey = (typeof COINS)[number]['key'];

/** Valeur totale en pièces d'or. */
export const coinsInGold = (c: Partial<Record<CoinKey, number>>) =>
  (c.pc ?? 0) / 100 + (c.pa ?? 0) / 10 + (c.pe ?? 0) / 2 + (c.po ?? 0) + (c.pp ?? 0) * 10;

export type Attack = {
  name: string;
  ability: AbilityKey;
  proficient: boolean;
  dice: string;
  type: string;
  bonus: number;
  /** Portée, propriétés : « Finesse, légère. Lancer 6/18 m. » */
  note?: string;
};

/** Lance une expression simple de dés, par exemple « 2d6 » ou « 1d8 ». */
export function rollDice(expr: string): { total: number; rolls: number[] } {
  const m = expr.trim().toLowerCase().match(/^(\d*)d(\d+)$/);
  if (!m) return { total: 0, rolls: [] };
  const n = Math.min(40, parseInt(m[1] || '1', 10));
  const faces = parseInt(m[2], 10);
  const rolls = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * faces));
  return { total: rolls.reduce((a, b) => a + b, 0), rolls };
}

/** Caractéristique d'incantation par classe. */
export const SPELL_ABILITY: Record<string, AbilityKey> = {
  Barde: 'CHA',
  Clerc: 'SAG',
  Druide: 'SAG',
  Ensorceleur: 'CHA',
  Magicien: 'INT',
  Occultiste: 'CHA',
  Paladin: 'CHA',
  Rôdeur: 'SAG',
};

export const hitDieOf = (cls: string) => CLASSES.find((c) => c.name === cls)?.hitDie ?? 8;

export const ALIGNMENTS = [
  'Loyal bon', 'Neutre bon', 'Chaotique bon',
  'Loyal neutre', 'Neutre', 'Chaotique neutre',
  'Loyal mauvais', 'Neutre mauvais', 'Chaotique mauvais',
];

export const PROFICIENCY_KINDS = [
  { key: 'armures', label: 'Armures' },
  { key: 'armes', label: 'Armes' },
  { key: 'outils', label: 'Outils' },
  { key: 'langues', label: 'Langues' },
] as const;

export type Feature = { name: string; source: string; description: string };
