// Armures et armes du Manuel des joueurs (5e, 2014) : valeurs de jeu et courtes notes
// rédigées pour l'appli. Prix en pièces d'or, poids en kilos.
import { modifier, signed, type AbilityKey, type Attack } from './rules';
import type { Character } from './types';

export type ArmorCategory = 'légère' | 'intermédiaire' | 'lourde' | 'bouclier';

export type Armor = {
  name: string;
  category: ArmorCategory;
  /** CA de base (ou bonus pour le bouclier) */
  base: number;
  /** Force minimale pour ne pas perdre 3 m de vitesse */
  strength?: number;
  stealthDisadvantage?: boolean;
  price: number;
  weight: number;
  note: string;
};

export const ARMORS: Armor[] = [
  { name: 'Armure matelassée', category: 'légère', base: 11, stealthDisadvantage: true, price: 5, weight: 4, note: 'Couches de tissu rembourrées.' },
  { name: 'Armure de cuir', category: 'légère', base: 11, price: 10, weight: 5, note: 'Cuir durci à l’huile sur le torse, souple ailleurs.' },
  { name: 'Armure de cuir clouté', category: 'légère', base: 12, price: 45, weight: 6.5, note: 'Cuir résistant renforcé de rivets.' },
  { name: 'Armure de peau', category: 'intermédiaire', base: 12, price: 10, weight: 6, note: 'Fourrures et peaux épaisses, protection rustique.' },
  { name: 'Chemise de mailles', category: 'intermédiaire', base: 13, price: 50, weight: 10, note: 'Anneaux de métal portés sous le tissu, discrète.' },
  { name: "Armure d'écailles", category: 'intermédiaire', base: 14, stealthDisadvantage: true, price: 50, weight: 22.5, note: 'Cuir couvert de plaques qui se chevauchent.' },
  { name: 'Cuirasse', category: 'intermédiaire', base: 14, price: 400, weight: 10, note: 'Plastron de métal : protège le buste sans gêner.' },
  { name: 'Armure de demi-plate', category: 'intermédiaire', base: 15, stealthDisadvantage: true, price: 750, weight: 20, note: 'Plaques sur le haut du corps, jambières en cuir.' },
  { name: 'Broigne', category: 'lourde', base: 14, stealthDisadvantage: true, price: 30, weight: 20, note: 'Cuir couvert d’anneaux lourds, la lourde la moins chère.' },
  { name: 'Cotte de mailles', category: 'lourde', base: 16, strength: 13, stealthDisadvantage: true, price: 75, weight: 27.5, note: 'Mailles entrecroisées sur tissu épais, avec gantelets.' },
  { name: 'Clibanion', category: 'lourde', base: 17, strength: 15, stealthDisadvantage: true, price: 200, weight: 30, note: 'Bandes de métal rivetées, articulations en mailles.' },
  { name: 'Harnois', category: 'lourde', base: 18, strength: 15, stealthDisadvantage: true, price: 1500, weight: 32.5, note: 'Plates complètes avec casque : la meilleure protection.' },
  { name: 'Bouclier', category: 'bouclier', base: 2, price: 10, weight: 3, note: 'Tenu en main, +2 CA. Un seul à la fois.' },
];

/** Temps pour enfiler / retirer (divisé par deux si on t'aide à l'enlever). */
export const DON_DOFF: Record<ArmorCategory, { on: string; off: string }> = {
  légère: { on: '1 minute', off: '1 minute' },
  intermédiaire: { on: '5 minutes', off: '1 minute' },
  lourde: { on: '10 minutes', off: '5 minutes' },
  bouclier: { on: '1 action', off: '1 action' },
};

export type WeaponGroup = 'courante' | 'de guerre';

export type Weapon = {
  name: string;
  group: WeaponGroup;
  ranged: boolean;
  dice: string;
  type: string;
  properties: string[];
  /** Portée normale/longue en mètres (lancer ou munitions) */
  range?: string;
  versatile?: string;
  price: string;
  weight: number;
};

const w = (
  name: string,
  group: WeaponGroup,
  ranged: boolean,
  dice: string,
  type: string,
  properties: string[],
  price: string,
  weight: number,
  extra: { range?: string; versatile?: string } = {},
): Weapon => ({ name, group, ranged, dice, type, properties, price, weight, ...extra });

export const WEAPONS: Weapon[] = [
  // Armes courantes de corps à corps
  w('Bâton', 'courante', false, '1d6', 'contondant', ['polyvalente'], '2 pa', 2, { versatile: '1d8' }),
  w('Dague', 'courante', false, '1d4', 'perforant', ['finesse', 'légère', 'lancer'], '2 po', 0.5, { range: '6/18' }),
  w('Gourdin', 'courante', false, '1d4', 'contondant', ['légère'], '1 pa', 1),
  w('Hachette', 'courante', false, '1d6', 'tranchant', ['légère', 'lancer'], '5 po', 1, { range: '6/18' }),
  w('Javeline', 'courante', false, '1d6', 'perforant', ['lancer'], '5 pa', 1, { range: '9/36' }),
  w('Lance', 'courante', false, '1d6', 'perforant', ['lancer', 'polyvalente'], '1 po', 1.5, { range: '6/18', versatile: '1d8' }),
  w('Marteau léger', 'courante', false, '1d4', 'contondant', ['légère', 'lancer'], '2 po', 1, { range: '6/18' }),
  w("Masse d'armes", 'courante', false, '1d6', 'contondant', [], '5 po', 2),
  w('Massue', 'courante', false, '1d8', 'contondant', ['à deux mains'], '2 pa', 5),
  w('Serpe', 'courante', false, '1d4', 'tranchant', ['légère'], '1 po', 1),
  // Armes courantes à distance
  w('Arbalète légère', 'courante', true, '1d8', 'perforant', ['munitions', 'chargement', 'à deux mains'], '25 po', 2.5, { range: '24/96' }),
  w('Arc court', 'courante', true, '1d6', 'perforant', ['munitions', 'à deux mains'], '25 po', 1, { range: '24/96' }),
  w('Fléchette', 'courante', true, '1d4', 'perforant', ['finesse', 'lancer'], '5 pc', 0.125, { range: '6/18' }),
  w('Fronde', 'courante', true, '1d4', 'contondant', ['munitions'], '1 pa', 0, { range: '9/36' }),
  // Armes de guerre de corps à corps
  w('Cimeterre', 'de guerre', false, '1d6', 'tranchant', ['finesse', 'légère'], '25 po', 1.5),
  w('Coutille', 'de guerre', false, '1d10', 'tranchant', ['lourde', 'allonge', 'à deux mains'], '20 po', 3),
  w('Épée à deux mains', 'de guerre', false, '2d6', 'tranchant', ['lourde', 'à deux mains'], '50 po', 3),
  w('Épée courte', 'de guerre', false, '1d6', 'perforant', ['finesse', 'légère'], '10 po', 1),
  w('Épée longue', 'de guerre', false, '1d8', 'tranchant', ['polyvalente'], '15 po', 1.5, { versatile: '1d10' }),
  w('Fléau', 'de guerre', false, '1d8', 'contondant', [], '10 po', 1),
  w('Fouet', 'de guerre', false, '1d4', 'tranchant', ['finesse', 'allonge'], '2 po', 1.5),
  w('Hache à deux mains', 'de guerre', false, '1d12', 'tranchant', ['lourde', 'à deux mains'], '30 po', 3.5),
  w("Hache d'armes", 'de guerre', false, '1d8', 'tranchant', ['polyvalente'], '10 po', 2, { versatile: '1d10' }),
  w('Hallebarde', 'de guerre', false, '1d10', 'tranchant', ['lourde', 'allonge', 'à deux mains'], '20 po', 3),
  w("Lance d'arçon", 'de guerre', false, '1d12', 'perforant', ['allonge', 'spéciale'], '10 po', 3),
  w("Maillet d'armes", 'de guerre', false, '2d6', 'contondant', ['lourde', 'à deux mains'], '10 po', 5),
  w('Marteau de guerre', 'de guerre', false, '1d8', 'contondant', ['polyvalente'], '15 po', 1, { versatile: '1d10' }),
  w('Morgenstern', 'de guerre', false, '1d8', 'perforant', [], '15 po', 2),
  w('Pic de guerre', 'de guerre', false, '1d8', 'perforant', [], '5 po', 1),
  w('Pique', 'de guerre', false, '1d10', 'perforant', ['lourde', 'allonge', 'à deux mains'], '5 po', 9),
  w('Rapière', 'de guerre', false, '1d8', 'perforant', ['finesse'], '25 po', 1),
  w('Trident', 'de guerre', false, '1d6', 'perforant', ['lancer', 'polyvalente'], '5 po', 2, { range: '6/18', versatile: '1d8' }),
  // Armes de guerre à distance
  w('Arbalète de poing', 'de guerre', true, '1d6', 'perforant', ['munitions', 'légère', 'chargement'], '75 po', 1.5, { range: '9/36' }),
  w('Arbalète lourde', 'de guerre', true, '1d10', 'perforant', ['munitions', 'lourde', 'chargement', 'à deux mains'], '50 po', 9, { range: '30/120' }),
  w('Arc long', 'de guerre', true, '1d8', 'perforant', ['munitions', 'lourde', 'à deux mains'], '50 po', 1, { range: '45/180' }),
  w('Filet', 'de guerre', true, '—', '', ['lancer', 'spéciale'], '1 po', 1.5, { range: '1,5/4,5' }),
  w('Sarbacane', 'de guerre', true, '1', 'perforant', ['munitions', 'chargement'], '10 po', 0.5, { range: '7,5/30' }),
];

/** Maîtrises d'armure de départ de chaque classe, si la fiche n'en dit rien. */
const CLASS_ARMOR: Record<string, ArmorCategory[]> = {
  Barbare: ['légère', 'intermédiaire', 'bouclier'],
  Barde: ['légère'],
  Clerc: ['légère', 'intermédiaire', 'bouclier'],
  Druide: ['légère', 'intermédiaire', 'bouclier'],
  Ensorceleur: [],
  Guerrier: ['légère', 'intermédiaire', 'lourde', 'bouclier'],
  Magicien: [],
  Moine: [],
  Occultiste: ['légère'],
  Paladin: ['légère', 'intermédiaire', 'lourde', 'bouclier'],
  Rôdeur: ['légère', 'intermédiaire', 'bouclier'],
  Roublard: ['légère'],
};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Catégories d'armures maîtrisées : d'après la case « Armures » de la fiche, sinon la classe. */
export function armorProficiencies(ch: Character): Set<ArmorCategory> {
  const text = norm(ch.proficiencies.armures ?? '');
  if (!text.trim()) return new Set(CLASS_ARMOR[ch.class] ?? []);
  if (/aucun/.test(text) && !/legere|intermediaire|lourde|toutes|bouclier/.test(text)) return new Set();
  const set = new Set<ArmorCategory>();
  if (/toutes/.test(text)) ['légère', 'intermédiaire', 'lourde'].forEach((c) => set.add(c as ArmorCategory));
  if (/legere/.test(text)) set.add('légère');
  if (/intermediaire/.test(text)) set.add('intermédiaire');
  if (/lourde/.test(text)) set.add('lourde');
  if (/bouclier/.test(text)) set.add('bouclier');
  return set;
}

const CLASS_WEAPONS: Record<string, string> = {
  Barbare: 'courantes, de guerre',
  Barde: 'courantes, arbalète de poing, épée longue, rapière, épée courte',
  Clerc: 'courantes',
  Druide: 'bâton, cimeterre, dague, fléchette, fronde, gourdin, javeline, lance, massue, serpe',
  Ensorceleur: 'dague, fléchette, fronde, bâton, arbalète légère',
  Guerrier: 'courantes, de guerre',
  Magicien: 'dague, fléchette, fronde, bâton, arbalète légère',
  Moine: 'courantes, épée courte',
  Occultiste: 'courantes',
  Paladin: 'courantes, de guerre',
  Rôdeur: 'courantes, de guerre',
  Roublard: 'courantes, arbalète de poing, épée longue, rapière, épée courte',
};

export function weaponProficient(ch: Character, weapon: Weapon): boolean {
  const text = norm(ch.proficiencies.armes || CLASS_WEAPONS[ch.class] || '');
  if (weapon.group === 'courante' && /courantes/.test(text)) return true;
  if (weapon.group === 'de guerre' && /de guerre|guerre/.test(text)) return true;
  return text.includes(norm(weapon.name));
}

/** Transforme une arme du tableau en attaque prête à lancer. */
export function weaponAttack(ch: Character, weapon: Weapon): Attack {
  const finesse = weapon.properties.includes('finesse');
  const ability: AbilityKey = weapon.ranged
    ? finesse && modifier(ch.abilities.FOR) > modifier(ch.abilities.DEX)
      ? 'FOR'
      : 'DEX'
    : finesse && modifier(ch.abilities.DEX) > modifier(ch.abilities.FOR)
      ? 'DEX'
      : 'FOR';
  const parts = [
    weapon.ranged ? `Distance ${weapon.range} m` : weapon.properties.includes('allonge') ? 'Corps à corps, 3 m' : 'Corps à corps, 1,5 m',
    !weapon.ranged && weapon.range ? `lancer ${weapon.range} m` : '',
    weapon.properties.filter((p) => p !== 'lancer').join(', '),
    weapon.versatile ? `${weapon.versatile} à deux mains` : '',
  ].filter(Boolean);
  return {
    name: weapon.name,
    ability,
    proficient: weaponProficient(ch, weapon),
    dice: weapon.dice === '—' ? '0' : weapon.dice,
    type: weapon.type,
    bonus: 0,
    note: parts.map((x) => x[0].toUpperCase() + x.slice(1)).join('. ') + '.',
  };
}

/** Armure (ou bouclier) décrite par une ligne d'inventaire, s'il y en a une. */
export function armorOfLine(line: string): Armor | undefined {
  const l = norm(line.replace(/^\s*\*\s*/, '').trim());
  // Le nom le plus long d'abord : « Armure de cuir clouté » avant « Armure de cuir »
  return [...ARMORS]
    .sort((a, b) => b.name.length - a.name.length)
    .find((a) => l.startsWith(norm(a.name)) || (a.name.startsWith('Armure ') && l.startsWith(norm(a.name.slice(7)))));
}

/** Armure et bouclier actuellement portés, d'après les lignes « * » de l'inventaire. */
export function wornArmor(ch: Character): { armor?: Armor; shield?: Armor } {
  const worn = ch.inventory
    .split('\n')
    .filter((l) => l.trim().startsWith('*'))
    .map(armorOfLine)
    .filter((a): a is Armor => !!a);
  return { armor: worn.find((a) => a.category !== 'bouclier'), shield: worn.find((a) => a.category === 'bouclier') };
}

/** CA calculée selon l'armure, le bouclier, la DEX et les défenses sans armure. */
export function computeAc(ch: Character, armor?: Armor, shield?: Armor): { ac: number; note: string } {
  const dex = modifier(ch.abilities.DEX);
  const parts: string[] = [];
  let ac: number;
  if (armor) {
    const dexPart = armor.category === 'légère' ? dex : armor.category === 'intermédiaire' ? Math.min(2, dex) : 0;
    ac = armor.base + dexPart;
    parts.push(`${armor.name.toLowerCase()} ${armor.base}`);
    if (armor.category !== 'lourde') parts.push(`DEX ${signed(dexPart)}${armor.category === 'intermédiaire' && dex > 2 ? ' (max 2)' : ''}`);
  } else if (ch.class === 'Barbare') {
    const con = modifier(ch.abilities.CON);
    ac = 10 + dex + con;
    parts.push(`sans armure 10, DEX ${signed(dex)}, CON ${signed(con)}`);
  } else if (ch.class === 'Moine' && !shield) {
    const wis = modifier(ch.abilities.SAG);
    ac = 10 + dex + wis;
    parts.push(`sans armure 10, DEX ${signed(dex)}, SAG ${signed(wis)}`);
  } else if (ch.class === 'Ensorceleur' && /draconique/i.test(ch.subclass)) {
    ac = 13 + dex;
    parts.push(`résistance draconique 13, DEX ${signed(dex)}`);
  } else {
    ac = 10 + dex;
    parts.push(`sans armure 10, DEX ${signed(dex)}`);
  }
  if (shield) {
    ac += 2;
    parts.push('bouclier +2');
  }
  if (armor && ch.features.some((f) => /défense/i.test(f.name) && /style/i.test(f.name))) {
    ac += 1;
    parts.push('Défense +1');
  }
  return { ac, note: parts.join(', ') };
}
