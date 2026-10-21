// Sorcier (Manuel des joueurs, chapitre 3) : protecteur d'outre-monde, pacte et invocations occultes.
// Les textes sont des résumés écrits pour la table, pas ceux du livre.
import type { Feature } from './rules';
import type { Character, Resource } from './types';

type Gift = Omit<Feature, 'source'> & { level: number; /** Repos qui recharge l'aptitude, si elle est limitée */ reset?: Resource['reset'] };

export type Patron = {
  name: string;
  summary: string;
  /** Sorts ajoutés à la liste du sorcier, par niveau de sort (index 0 = niveau 1) */
  spells: string[][];
  features: Gift[];
};

export const PATRONS: Patron[] = [
  {
    name: 'Archifée',
    summary: 'Un seigneur ou une dame de la féerie, capricieux et très ancien : Titania, Obéron, le Prince du givre…',
    spells: [
      ['Lueurs féeriques', 'Sommeil'],
      ['Apaisement des émotions', 'Force fantasmagorique'],
      ['Clignotement', 'Croissance végétale'],
      ['Dominer une bête', 'Invisibilité supérieure'],
      ['Apparence trompeuse', 'Dominer un humanoïde'],
    ],
    features: [
      { level: 1, name: 'Présence féerique', reset: 'court', description: "Action : chaque créature dans un cube de 3 m autour de toi fait une sauvegarde de SAG contre ton DD de sorts. En cas d'échec, tu la charmes ou l'effraies (au choix) jusqu'à la fin de ton prochain tour." },
      { level: 6, name: 'Échappatoire brumeuse', reset: 'court', description: "Réaction quand tu subis des dégâts : tu deviens invisible et te téléportes jusqu'à 18 m dans un endroit libre que tu vois. L'invisibilité dure jusqu'au début de ton prochain tour, ou jusqu'à ce que tu attaques ou lances un sort." },
      { level: 10, name: 'Charmantes défenses', description: "Tu ne peux pas être charmé. Quand quelqu'un essaie, tu peux utiliser ta réaction pour lui renvoyer : sauvegarde de SAG contre ton DD, sinon il est charmé 1 minute ou jusqu'à ce qu'il subisse des dégâts." },
      { level: 14, name: 'Sombre délire', reset: 'court', description: "Action, une créature à 18 m : sauvegarde de SAG contre ton DD, sinon charmée ou effrayée 1 minute (concentration) et perdue dans un monde d'illusion où elle ne perçoit que toi. Le moindre dégât met fin à l'effet." },
    ],
  },
  {
    name: 'Fiélon',
    summary: 'Un démon ou un diable des plans inférieurs : Asmodée, Orcus, Baphomet, un balor… Il veut corrompre ou détruire, toi compris.',
    spells: [
      ['Injonction', 'Mains brûlantes'],
      ['Cécité/Surdité', 'Rayon ardent'],
      ['Boule de feu', 'Nuage puant'],
      ['Bouclier de feu', 'Mur de feu'],
      ['Colonne de flamme', 'Sanctification'],
    ],
    features: [
      { level: 1, name: 'Bénédiction du ténébreux', description: 'Quand tu fais tomber une créature hostile à 0 PV, tu gagnes des PV temporaires égaux à ton modificateur de CHA + ton niveau de sorcier (minimum 1).' },
      { level: 6, name: 'Chance du ténébreux', reset: 'court', description: 'Ajoute 1d10 à un test de caractéristique ou une sauvegarde, même après avoir vu le dé, tant que le résultat n’est pas annoncé.' },
      { level: 10, name: 'Résistance fiélonne', description: "À la fin d'un repos, choisis un type de dégâts : tu y résistes jusqu'à ton prochain choix. Ne marche pas contre les armes magiques ou en argent." },
      { level: 14, name: 'Traversée des enfers', reset: 'long', description: "Quand tu touches une créature avec une attaque, tu l'envoies dans les plans inférieurs jusqu'à la fin de ton prochain tour. À son retour, si ce n'est pas un fiélon, elle subit 10d10 dégâts psychiques." },
    ],
  },
  {
    name: 'Grand Ancien',
    summary: "Une entité incompréhensible venue d'au-delà de la réalité : Cthulhu, Tharizdun le Dieu enchaîné… Elle ignore peut-être que tu existes.",
    spells: [
      ['Fou rire', 'Murmures dissonants'],
      ['Détection des pensées', 'Force fantasmagorique'],
      ['Clairvoyance', 'Envoi de message'],
      ['Dominer une bête', "Tentacules noirs d'Evard"],
      ['Dominer un humanoïde', 'Télékinésie'],
    ],
    features: [
      { level: 1, name: 'Esprit éveillé', description: "Tu parles par télépathie à toute créature que tu vois à 9 m. Elle doit comprendre au moins une langue, pas forcément la tienne." },
      { level: 6, name: 'Protection entropique', reset: 'court', description: "Réaction quand on t'attaque : l'attaquant a le désavantage. S'il te rate, tu as l'avantage à ta prochaine attaque contre lui avant la fin de ton prochain tour." },
      { level: 10, name: 'Bouclier mental', description: 'Personne ne lit tes pensées sans ton accord. Tu résistes aux dégâts psychiques, et qui t’en inflige subit les mêmes dégâts.' },
      { level: 14, name: 'Asservissement', description: "Action : touche un humanoïde neutralisé, il est charmé jusqu'à ce qu'on lève la malédiction ou que tu recommences sur un autre. Vous pouvez vous parler par télépathie sur le même plan." },
    ],
  },
];

export const PACTS: Feature[] = [
  { name: 'Pacte de la chaîne', source: 'Pacte', description: "Tu connais Appel de familier (en rituel, hors sorts connus). Ton familier peut prendre une forme spéciale : diablotin, pseudodragon, quasit ou esprit follet. Quand tu attaques, tu peux renoncer à une attaque pour que ton familier attaque avec sa réaction." },
  { name: 'Pacte de la lame', source: 'Pacte', description: "Action : une arme de corps à corps de la forme de ton choix apparaît dans ta main. Tu la maîtrises et elle compte comme magique. Elle disparaît si elle reste à plus de 1,5 m de toi pendant 1 minute. Un rituel d'1 heure peut lier une arme magique à ton pacte." },
  { name: 'Pacte du grimoire', source: 'Pacte', description: "Ton protecteur t'offre un livre des ombres : choisis 3 sorts mineurs dans n'importe quelle liste. Tu les lances à volonté tant que tu as le livre, en plus de tes sorts mineurs connus. Perdu, il se remplace par une cérémonie d'1 heure." },
];

export type Invocation = {
  name: string;
  description: string;
  level?: number;
  pact?: string;
  /** Demande le sort mineur Décharge occulte (« explosion occulte » dans le Manuel) */
  blast?: boolean;
  /** Une fois par repos long, avec un emplacement de pacte */
  oncePerLongRest?: boolean;
};

export const INVOCATIONS: Invocation[] = [
  { name: 'Armure des ombres', description: 'Armure du mage sur toi à volonté, sans emplacement ni composante.' },
  { name: 'Buveuse de vie', level: 12, pact: 'Pacte de la lame', description: "Ton arme de pacte inflige en plus des dégâts nécrotiques égaux à ton modificateur de CHA (minimum 1)." },
  { name: 'Chaînes des Carcères', level: 15, pact: 'Pacte de la chaîne', description: "Immobiliser un monstre à volonté sur un céleste, un fiélon ou un élémentaire, sans emplacement. Une fois par repos long pour une même créature." },
  { name: 'Explosion insoutenable', blast: true, description: 'Ajoute ton modificateur de CHA aux dégâts de chaque rayon de Décharge occulte.' },
  { name: 'Lame assoiffée', level: 5, pact: 'Pacte de la lame', description: "Quand tu prends l'action Attaquer, tu frappes deux fois avec ton arme de pacte." },
  { name: 'Lance occulte', blast: true, description: 'Décharge occulte porte à 90 m.' },
  { name: 'Langage animal', description: 'Communication avec les animaux à volonté, sans emplacement.' },
  { name: "Lenteur de l'esprit", level: 5, oncePerLongRest: true, description: 'Lenteur une fois par repos long, avec un emplacement de sorcier.' },
  { name: 'Livre des secrets anciens', pact: 'Pacte du grimoire', description: "Inscris 2 rituels de niveau 1 de n'importe quelle liste dans ton livre des ombres et lance-les en rituel. Tu pourras en recopier d'autres (2 h et 50 po par niveau de sort, niveau max : moitié de ton niveau de sorcier)." },
  { name: 'Maître des mille formes', level: 15, description: 'Modification d’apparence à volonté, sans emplacement.' },
  { name: 'Maître des ombres', level: 5, description: "Dans la pénombre ou le noir, une action te rend invisible jusqu'à ce que tu bouges, agisses ou réagisses." },
  { name: 'Masque des mille visages', description: 'Déguisement à volonté, sans emplacement.' },
  { name: 'Mauvais présage', level: 5, oncePerLongRest: true, description: 'Malédiction une fois par repos long, avec un emplacement de sorcier.' },
  { name: "Mot d'effroi", level: 7, oncePerLongRest: true, description: 'Confusion une fois par repos long, avec un emplacement de sorcier.' },
  { name: 'Murmures ensorcelants', level: 7, oncePerLongRest: true, description: 'Compulsion une fois par repos long, avec un emplacement de sorcier.' },
  { name: 'Murmures de la tombe', level: 9, description: 'Communication avec les morts à volonté, sans emplacement.' },
  { name: 'Œil du gardien des runes', description: "Tu lis toutes les écritures." },
  { name: 'Onde de choc', blast: true, description: 'Chaque rayon de Décharge occulte qui touche repousse la cible de 3 m en ligne droite.' },
  { name: 'Pas aérien', level: 9, description: 'Lévitation sur toi à volonté, sans emplacement ni composante.' },
  { name: 'Regard de deux esprits', description: "Action : touche un humanoïde consentant et perçois par ses sens jusqu'à la fin de ton prochain tour (renouvelable chaque tour). Pendant ce temps, tu es aveugle et sourd pour ton propre corps." },
  { name: "Saut d'outre-monde", level: 9, description: 'Saut sur toi à volonté, sans emplacement ni composante.' },
  { name: 'Sbires du chaos', level: 9, oncePerLongRest: true, description: 'Invoquer un élémentaire une fois par repos long, avec un emplacement de sorcier.' },
  { name: 'Sculpteur de chair', level: 7, oncePerLongRest: true, description: 'Métamorphose une fois par repos long, avec un emplacement de sorcier.' },
  { name: 'Séduction', description: 'Tu maîtrises Tromperie et Persuasion.' },
  { name: 'Vigueur fiélonne', description: 'Simulacre de vie (niveau 1) sur toi à volonté, sans emplacement ni composante.' },
  { name: 'Vision de sorcier', level: 15, description: "Tu vois la vraie forme des métamorphes et des créatures déguisées par illusion ou transmutation, à 9 m." },
  { name: 'Vision du diable', description: 'Tu vois normalement dans le noir, même magique, jusqu’à 36 m.' },
  { name: 'Vision occulte', description: 'Détection de la magie à volonté, sans emplacement.' },
  { name: 'Visions de royaumes lointains', level: 15, description: 'Œil magique à volonté, sans emplacement.' },
  { name: 'Visions embrumées', description: 'Image silencieuse à volonté, sans emplacement ni composante.' },
  { name: 'Voix du maître des chaînes', pact: 'Pacte de la chaîne', description: 'Tu parles à ton familier par la pensée, tu perçois par ses sens et tu peux parler par sa bouche, sur le même plan.' },
  { name: 'Voleur des cinq destinées', oncePerLongRest: true, description: 'Fléau une fois par repos long, avec un emplacement de sorcier.' },
];

export const INVOCATION_SOURCE = 'Invocation occulte';

/** Nombre d'invocations connues par niveau de sorcier. */
export const invocationsKnown = (level: number) => [0, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8][Math.min(20, Math.max(1, level)) - 1];

/** Niveaux de sort des arcanums mystiques débloqués (6 au niveau 11, 7 au 13, 8 au 15, 9 au 17). */
export const arcanumLevels = (level: number) => [11, 13, 15, 17].filter((l) => level >= l).map((_, i) => 6 + i);

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Le protecteur choisi, reconnu dans la sous-classe (« Fiélon », « Le Grand Ancien »…). */
export function patronOf(ch: Pick<Character, 'class' | 'subclass'>): Patron | undefined {
  if (ch.class !== 'Sorcier') return undefined;
  const sub = fold(ch.subclass);
  return PATRONS.find((p) => sub.includes(fold(p.name)));
}

export const pactOf = (ch: Pick<Character, 'features'>) => PACTS.find((p) => ch.features.some((f) => f.name === p.name));

export const invocationsOf = (ch: Pick<Character, 'features'>) => ch.features.filter((f) => f.source === INVOCATION_SOURCE);

/** Prérequis d'une invocation : vide s'il est rempli, sinon ce qui manque. */
export function missingPrerequisite(inv: Invocation, level: number, pact: Feature | undefined): string {
  if (inv.level && level < inv.level) return `niveau ${inv.level}`;
  if (inv.pact && pact?.name !== inv.pact) return inv.pact.toLowerCase();
  return '';
}

/** Sorts que le sorcier peut apprendre en plus de sa liste : ceux de son protecteur. */
export function extraSpellNames(ch: Pick<Character, 'class' | 'subclass'>): Set<string> {
  return new Set(patronOf(ch)?.spells.flat() ?? []);
}

/** Le pacte du grimoire ouvre les sorts mineurs de toutes les classes. */
export const anyCantrip = (ch: Pick<Character, 'class' | 'features'>) => ch.class === 'Sorcier' && pactOf(ch)?.name === 'Pacte du grimoire';

const isPatronFeature = (f: Feature) =>
  PATRONS.some((p) => f.source === p.name || p.features.some((g) => g.name === f.name)) || /^(patron|protecteur) d.outre-monde/i.test(f.name);

/** Change de protecteur : retire les aptitudes de l'ancien, ajoute celles du nouveau jusqu'au niveau actuel. */
export function choosePatron(ch: Character, patron: Patron): Pick<Character, 'subclass' | 'features' | 'resources'> {
  const old = PATRONS.flatMap((p) => p.features.map((g) => g.name));
  const gifts = patron.features.filter((g) => g.level <= ch.level);
  return {
    subclass: patron.name,
    features: [
      ...ch.features.filter((f) => !isPatronFeature(f)),
      ...gifts.map((g) => ({ name: g.name, source: patron.name, description: g.description })),
    ],
    resources: [
      ...ch.resources.filter((r) => !old.includes(r.name)),
      ...gifts.filter((g) => g.reset).map((g) => ({ name: g.name, max: 1, used: 0, reset: g.reset! })),
    ],
  };
}

/** Ajoute une aptitude de protecteur gagnée en montant de niveau. */
export function addPatronFeature(ch: Character, patron: Patron, gift: Gift): Pick<Character, 'features' | 'resources'> {
  return {
    features: [...ch.features, { name: gift.name, source: patron.name, description: gift.description }],
    resources: gift.reset && !ch.resources.some((r) => r.name === gift.name) ? [...ch.resources, { name: gift.name, max: 1, used: 0, reset: gift.reset }] : ch.resources,
  };
}

export function choosePact(ch: Character, pact: Feature): Pick<Character, 'features'> {
  return { features: [...ch.features.filter((f) => !PACTS.some((p) => p.name === f.name)), pact] };
}

export function toggleInvocation(ch: Character, inv: Invocation): Pick<Character, 'features' | 'resources'> {
  const has = ch.features.some((f) => f.name === inv.name && f.source === INVOCATION_SOURCE);
  if (has) {
    return {
      features: ch.features.filter((f) => !(f.name === inv.name && f.source === INVOCATION_SOURCE)),
      resources: ch.resources.filter((r) => r.name !== inv.name),
    };
  }
  return {
    features: [...ch.features, { name: inv.name, source: INVOCATION_SOURCE, description: inv.description }],
    resources: inv.oncePerLongRest ? [...ch.resources, { name: inv.name, max: 1, used: 0, reset: 'long' }] : ch.resources,
  };
}
