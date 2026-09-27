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
