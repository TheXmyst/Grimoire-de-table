import { CLASSES, maxSpellLevel, spellSlots, type Feature } from './rules';

/** XP nécessaire pour atteindre chaque niveau (index = niveau, PHB p.15). */
export const XP_THRESHOLDS: number[] = [
  0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000,
  225000, 265000, 305000, 355000,
];

export type LevelGain = {
  features: Feature[];
  asi?: boolean;
  subclass?: string;
  cantripsKnown?: number;
  spellsKnown?: number;
  notes?: string[];
};

type Raw = { f?: [string, string][]; sub?: string; notes?: string[] };
type ClassData = {
  raw: Record<number, Raw>;
  asi?: number[];
  cantrips?: number[]; // index 0 = niveau 1
  known?: number[]; // index 0 = niveau 1
  perLevel?: (lvl: number) => string[];
};

const BASE_ASI = [4, 8, 12, 16, 19];

const CANTRIPS = (a: number) => [...Array(3).fill(a), ...Array(6).fill(a + 1), ...Array(11).fill(a + 2)];

const DATA: Record<string, ClassData> = {
  Barbare: {
    raw: {
      2: {
        f: [
          ['Attaque téméraire', 'À ta première attaque du tour, tu peux prendre l’avantage (FOR, corps à corps). En échange, les attaques contre toi ont l’avantage jusqu’à ton prochain tour.'],
          ['Sens du danger', 'Avantage aux sauvegardes de DEX contre ce que tu vois (pièges, sorts…), si tu n’es pas aveuglé, assourdi ou neutralisé.'],
        ],
      },
      3: { sub: 'Choisis ta voie primitive (Berserker dans les règles gratuites)', notes: ['Rages : 3 par repos long'] },
      5: {
        f: [
          ['Attaque supplémentaire', 'Tu attaques deux fois quand tu prends l’action Attaquer.'],
          ['Déplacement rapide', '+3 m de vitesse si tu ne portes pas d’armure lourde.'],
        ],
      },
      6: { sub: 'Capacité de ta voie primitive', notes: ['Rages : 4 par repos long'] },
      7: { f: [['Instinct sauvage', 'Avantage à l’initiative. Si tu es surpris, tu peux quand même agir en entrant en rage.']] },
      9: {
        f: [['Critique brutal', 'Sur un coup critique au corps à corps, lance 1 dé de dégâts de l’arme en plus.']],
        notes: ['Dégâts de rage : +3'],
      },
      10: { sub: 'Capacité de ta voie primitive' },
      11: { f: [['Rage implacable', 'En rage, si tu tombes à 0 PV, réussis une sauvegarde de CON (DD 10, +5 à chaque fois) pour rester à 1 PV.']] },
      12: { notes: ['Rages : 5 par repos long'] },
      13: { f: [['Critique brutal (2 dés)', 'Ton critique brutal ajoute désormais 2 dés.']] },
      14: { sub: 'Capacité de ta voie primitive' },
      15: { f: [['Rage persistante', 'Ta rage ne s’arrête plus trop tôt : seulement si tu tombes inconscient ou si tu choisis de l’arrêter.']] },
      16: { notes: ['Dégâts de rage : +4'] },
      17: { f: [['Critique brutal (3 dés)', 'Ton critique brutal ajoute désormais 3 dés.']], notes: ['Rages : 6 par repos long'] },
      18: { f: [['Puissance indomptable', 'Si ton jet de FOR donne moins que ta valeur de FOR, tu utilises ta valeur à la place.']] },
      20: {
        f: [['Champion primitif', '+4 en FOR et en CON (maximum 24).']],
        notes: ['Rages illimitées'],
      },
    },
  },
  Barde: {
    cantrips: CANTRIPS(2),
    known: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
    raw: {
      2: {
        f: [
          ['Touche-à-tout', 'Tu ajoutes la moitié de ta maîtrise aux jets de caractéristique où tu n’es pas déjà maîtrisé.'],
          ['Chant reposant', 'Pendant un repos court, tes alliés qui dépensent des dés de vie regagnent 1d6 PV de plus.'],
        ],
      },
      3: {
        sub: 'Choisis ton collège bardique (Collège du savoir dans les règles gratuites)',
        f: [['Expertise', 'Choisis 2 compétences maîtrisées : ta maîtrise compte double pour elles.']],
      },
      5: {
        f: [['Source d’inspiration', 'Tu récupères ton Inspiration bardique après un repos court ou long.']],
        notes: ['Inspiration bardique : d8'],
      },
      6: {
        sub: 'Capacité de ton collège bardique',
        f: [['Contre-charme', 'Par une action, tes alliés proches ont l’avantage contre la peur et le charme jusqu’à la fin de ton prochain tour.']],
      },
      9: { notes: ['Chant reposant : d8'] },
      10: {
        f: [
          ['Expertise', 'Choisis 2 autres compétences maîtrisées : ta maîtrise compte double.'],
          ['Secrets magiques', 'Apprends 2 sorts de n’importe quelle classe (ils comptent comme sorts de barde).'],
        ],
        notes: ['Inspiration bardique : d10'],
      },
      13: { notes: ['Chant reposant : d10'] },
      14: {
        sub: 'Capacité de ton collège bardique',
        f: [['Secrets magiques', 'Apprends 2 nouveaux sorts de n’importe quelle classe.']],
      },
      15: { notes: ['Inspiration bardique : d12'] },
      17: { notes: ['Chant reposant : d12'] },
      18: { f: [['Secrets magiques', 'Apprends 2 nouveaux sorts de n’importe quelle classe.']] },
      20: { f: [['Inspiration supérieure', 'Si tu n’as plus d’Inspiration bardique en lançant l’initiative, tu en récupères une.']] },
    },
  },
  Clerc: {
    cantrips: CANTRIPS(3),
    raw: {
      2: {
        sub: 'Ton domaine divin t’offre une option de Conduit divin',
        f: [
          ['Conduit divin', 'Une fois par repos court ou long, canalise la puissance de ton dieu pour un effet spécial.'],
          ['Renvoi des morts-vivants', 'Par une action (Conduit divin), les morts-vivants à 9 m qui ratent une sauvegarde de SAG fuient pendant 1 minute.'],
        ],
        notes: ['Tu prépares SAG + niveau de clerc sorts après chaque repos long'],
      },
      5: { f: [['Destruction des morts-vivants', 'Les morts-vivants de FP 1/2 ou moins qui ratent le Renvoi sont détruits.']] },
      6: { sub: 'Capacité de ton domaine divin', notes: ['Conduit divin : 2 fois par repos'] },
      8: { sub: 'Capacité de ton domaine divin', notes: ['Destruction des morts-vivants : FP 1 ou moins'] },
      10: { f: [['Intervention divine', 'Par une action, implore ton dieu : si ton d100 ≤ ton niveau de clerc, il intervient (1 fois par semaine si ça marche).']] },
      11: { notes: ['Destruction des morts-vivants : FP 2 ou moins'] },
      14: { notes: ['Destruction des morts-vivants : FP 3 ou moins'] },
      17: { sub: 'Capacité de ton domaine divin', notes: ['Destruction des morts-vivants : FP 4 ou moins'] },
      18: { notes: ['Conduit divin : 3 fois par repos'] },
      20: { f: [['Intervention divine suprême', 'Ton Intervention divine réussit automatiquement.']] },
    },
  },
  Druide: {
    cantrips: CANTRIPS(2),
    raw: {
      2: {
        sub: 'Choisis ton cercle druidique (Cercle de la terre dans les règles gratuites)',
        f: [['Forme sauvage', '2 fois par repos court ou long, transforme-toi en une bête déjà vue (FP 1/4 max, sans vol ni nage).']],
        notes: ['Tu prépares SAG + niveau de druide sorts après chaque repos long'],
      },
      4: { notes: ['Forme sauvage : FP 1/2 max, nage autorisée (toujours pas de vol)'] },
      6: { sub: 'Capacité de ton cercle druidique' },
      8: { notes: ['Forme sauvage : FP 1 max, vol autorisé'] },
      10: { sub: 'Capacité de ton cercle druidique' },
      14: { sub: 'Capacité de ton cercle druidique' },
      18: {
        f: [
          ['Jeunesse éternelle', 'Tu vieillis 10 fois moins vite.'],
          ['Incantation bestiale', 'Tu peux lancer tes sorts sous forme sauvage (composantes verbales et somatiques).'],
        ],
      },
      20: { f: [['Archidruide', 'Forme sauvage illimitée, et tu ignores les composantes sans coût de tes sorts de druide.']] },
    },
  },
  Ensorceleur: {
    cantrips: CANTRIPS(4),
    known: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
    perLevel: (l) => (l >= 2 ? [`Points de sorcellerie : ${l}`] : []),
    raw: {
      2: { f: [['Source de magie', 'Tu as des points de sorcellerie : échange-les contre des emplacements de sorts (et inversement) en action bonus.']] },
      3: { f: [['Métamagie', 'Choisis 2 options de métamagie pour modifier tes sorts avec tes points de sorcellerie.']] },
      6: { sub: 'Capacité de ton origine magique' },
      10: { f: [['Métamagie', 'Choisis 1 option de métamagie de plus.']] },
      14: { sub: 'Capacité de ton origine magique' },
      17: { f: [['Métamagie', 'Choisis 1 option de métamagie de plus.']] },
      18: { sub: 'Capacité de ton origine magique' },
      20: { f: [['Restauration ensorcelée', 'Tu récupères 4 points de sorcellerie après un repos court.']] },
    },
  },
  Guerrier: {
    asi: [...BASE_ASI, 6, 14],
    raw: {
      2: { f: [['Fougue', 'Une fois par repos court ou long, prends une action supplémentaire à ton tour.']] },
      3: { sub: 'Choisis ton archétype martial (Champion dans les règles gratuites)' },
      5: { f: [['Attaque supplémentaire', 'Tu attaques deux fois quand tu prends l’action Attaquer.']] },
      7: { sub: 'Capacité de ton archétype martial' },
      9: { f: [['Indomptable', 'Une fois par repos long, relance une sauvegarde ratée.']] },
      10: { sub: 'Capacité de ton archétype martial' },
      11: { f: [['Attaque supplémentaire (3)', 'Tu attaques trois fois avec l’action Attaquer.']] },
      13: { notes: ['Indomptable : 2 fois par repos long'] },
      15: { sub: 'Capacité de ton archétype martial' },
      17: { notes: ['Fougue : 2 fois par repos (1 seule fois par tour)', 'Indomptable : 3 fois par repos long'] },
      18: { sub: 'Capacité de ton archétype martial' },
      20: { f: [['Attaque supplémentaire (4)', 'Tu attaques quatre fois avec l’action Attaquer.']] },
    },
  },
  Magicien: {
    cantrips: CANTRIPS(3),
    perLevel: (l) => (l >= 2 ? ['+2 sorts gratuits dans ton grimoire'] : []),
    raw: {
      2: {
        sub: 'Choisis ta tradition arcanique (École d’évocation dans les règles gratuites)',
        notes: ['Tu prépares INT + niveau de magicien sorts de ton grimoire après chaque repos long'],
      },
      6: { sub: 'Capacité de ta tradition arcanique' },
      10: { sub: 'Capacité de ta tradition arcanique' },
      14: { sub: 'Capacité de ta tradition arcanique' },
      18: { f: [['Maîtrise des sorts', 'Choisis un sort de niveau 1 et un de niveau 2 : tu peux les lancer à leur niveau de base sans emplacement.']] },
      20: { f: [['Sorts de prédilection', 'Choisis 2 sorts de niveau 3 : toujours préparés, chacun lançable une fois sans emplacement par repos court.']] },
    },
  },
  Moine: {
    perLevel: (l) => (l >= 2 ? [`Points de ki : ${l}`] : []),
    raw: {
      2: {
        f: [
          ['Ki', 'Dépense du ki pour Déluge de coups (2 coups à mains nues en action bonus), Défense patiente ou Déplacement aérien. Récupéré après un repos court.'],
          ['Déplacement sans armure', '+3 m de vitesse sans armure ni bouclier.'],
        ],
      },
      3: {
        sub: 'Choisis ta tradition monastique (Voie de la main ouverte dans les règles gratuites)',
        f: [['Parade de projectiles', 'En réaction, réduis les dégâts d’une attaque à distance de 1d10 + DEX + niveau. À 0, tu peux la renvoyer (1 ki).']],
      },
      4: { f: [['Chute ralentie', 'En réaction, réduis tes dégâts de chute de 5 × ton niveau.']] },
      5: {
        f: [
          ['Attaque supplémentaire', 'Tu attaques deux fois quand tu prends l’action Attaquer.'],
          ['Frappe étourdissante', 'Quand tu touches au corps à corps, dépense 1 ki : la cible réussit une sauvegarde de CON ou est étourdie jusqu’à la fin de ton prochain tour.'],
        ],
        notes: ['Arts martiaux : d6'],
      },
      6: {
        sub: 'Capacité de ta tradition monastique',
        f: [['Frappes de ki', 'Tes coups à mains nues comptent comme magiques.']],
        notes: ['Déplacement sans armure : +4,5 m'],
      },
      7: {
        f: [
          ['Dérobade', 'Sauvegarde de DEX pour moitié dégâts : réussite = aucun dégât, échec = moitié.'],
          ['Tranquillité d’esprit', 'Par une action, mets fin à un effet qui te charme ou t’effraie.'],
        ],
      },
      9: { f: [['Déplacement sans armure amélioré', 'Tu peux courir sur les murs et sur l’eau pendant ton tour.']] },
      10: {
        f: [['Pureté physique', 'Immunité aux maladies et au poison.']],
        notes: ['Déplacement sans armure : +6 m'],
      },
      11: { sub: 'Capacité de ta tradition monastique', notes: ['Arts martiaux : d8'] },
      13: { f: [['Langue du soleil et de la lune', 'Tu comprends toutes les langues parlées, et tout le monde te comprend.']] },
      14: {
        f: [['Âme de diamant', 'Maîtrise de toutes les sauvegardes. Dépense 1 ki pour relancer une sauvegarde ratée.']],
        notes: ['Déplacement sans armure : +7,5 m'],
      },
      15: { f: [['Jeunesse éternelle', 'Tu ne souffres plus de la vieillesse et n’as plus besoin de manger ni de boire.']] },
      17: { sub: 'Capacité de ta tradition monastique', notes: ['Arts martiaux : d10'] },
      18: {
        f: [['Désertion de l’âme', 'Dépense 4 ki pour devenir invisible 1 minute (résistance à tous les dégâts sauf force), ou 8 ki pour lancer projection astrale.']],
        notes: ['Déplacement sans armure : +9 m'],
      },
      20: { f: [['Perfection de l’être', 'Si tu n’as plus de ki en lançant l’initiative, tu en récupères 4.']] },
    },
  },
  Occultiste: {
    cantrips: CANTRIPS(2),
    known: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
    raw: {
      2: { f: [['Manifestations occultes', 'Choisis 2 manifestations : de petits pouvoirs permanents (ex. Explosion agonisante).']] },
      3: { f: [['Faveur de pacte', 'Ton patron t’offre un pacte : de la lame (arme magique), de la chaîne (familier spécial) ou du grimoire (3 sorts mineurs de plus).']] },
      5: { notes: ['Manifestations connues : 3'] },
      6: { sub: 'Capacité de ton patron' },
      7: { notes: ['Manifestations connues : 4'] },
      9: { notes: ['Manifestations connues : 5'] },
      10: { sub: 'Capacité de ton patron' },
      11: { f: [['Arcanum mystique (niveau 6)', 'Choisis un sort de niveau 6 : tu peux le lancer une fois par repos long sans emplacement.']] },
      12: { notes: ['Manifestations connues : 6'] },
      13: { f: [['Arcanum mystique (niveau 7)', 'Choisis un sort de niveau 7, lançable une fois par repos long.']] },
      14: { sub: 'Capacité de ton patron' },
      15: { f: [['Arcanum mystique (niveau 8)', 'Choisis un sort de niveau 8, lançable une fois par repos long.']], notes: ['Manifestations connues : 7'] },
      17: { f: [['Arcanum mystique (niveau 9)', 'Choisis un sort de niveau 9, lançable une fois par repos long.']] },
      18: { notes: ['Manifestations connues : 8'] },
      20: { f: [['Maître de l’occulte', 'Une fois par repos long, passe 1 minute à implorer ton patron pour récupérer tous tes emplacements de pacte.']] },
    },
  },
  Paladin: {
    raw: {
      2: {
        f: [
          ['Style de combat', 'Choisis un style de combat (Défense, Duel, Arme à deux mains…).'],
          ['Incantation', 'Tu lances des sorts grâce à ton Charisme. Tu prépares CHA + moitié de ton niveau de paladin sorts.'],
          ['Châtiment divin', 'Quand tu touches au corps à corps, dépense un emplacement : +2d8 radiants (+1d8 par niveau d’emplacement au-dessus de 1, +1d8 contre morts-vivants et fiélons).'],
        ],
      },
      3: {
        sub: 'Prête ton serment sacré (Serment de dévotion dans les règles gratuites)',
        f: [['Santé divine', 'Tu es immunisé contre les maladies.']],
      },
      5: { f: [['Attaque supplémentaire', 'Tu attaques deux fois quand tu prends l’action Attaquer.']] },
      6: { f: [['Aura de protection', 'Toi et tes alliés à 3 m ajoutez ton modificateur de CHA à vos sauvegardes (tant que tu es conscient).']] },
      7: { sub: 'Capacité de ton serment' },
      10: { f: [['Aura de courage', 'Toi et tes alliés à 3 m ne pouvez pas être effrayés.']] },
      11: { f: [['Châtiment divin amélioré', 'Chacune de tes attaques au corps à corps inflige +1d8 radiants.']] },
      14: { f: [['Contact purifiant', 'Par une action, mets fin à un sort sur toi ou un allié consentant (CHA fois par repos long).']] },
      15: { sub: 'Capacité de ton serment' },
      18: { notes: ['Tes auras s’étendent à 9 m'] },
      20: { sub: 'Capacité ultime de ton serment' },
    },
  },
  Rôdeur: {
    known: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
    raw: {
      2: {
        f: [
          ['Style de combat', 'Choisis un style de combat (Archerie, Défense, Duel, Combat à deux armes).'],
          ['Incantation', 'Tu lances des sorts de rôdeur grâce à ta Sagesse.'],
        ],
      },
      3: {
        sub: 'Choisis ton archétype de rôdeur (Chasseur dans les règles gratuites)',
        f: [['Vigilance primitive', 'Dépense un emplacement pour sentir pendant 1 minute par niveau d’emplacement si certains types de créatures sont à 1,5 km.']],
      },
      5: { f: [['Attaque supplémentaire', 'Tu attaques deux fois quand tu prends l’action Attaquer.']] },
      6: { notes: ['Ennemi juré : choisis un type d’ennemi de plus (et une langue)', 'Explorateur-né : choisis un terrain de prédilection de plus'] },
      7: { sub: 'Capacité de ton archétype de rôdeur' },
      8: { f: [['Foulée tout-terrain', 'Le terrain difficile non magique ne te ralentit plus, et les plantes magiques te gênent moins (avantage aux sauvegardes).']] },
      10: {
        f: [['Camouflage naturel', 'Passe 1 minute à te camoufler : +10 en Discrétion tant que tu restes immobile.']],
        notes: ['Explorateur-né : choisis un terrain de prédilection de plus'],
      },
      11: { sub: 'Capacité de ton archétype de rôdeur' },
      14: {
        f: [['Disparition', 'Te cacher est une action bonus, et tu ne peux plus être pisté par des moyens non magiques.']],
        notes: ['Ennemi juré : choisis un type d’ennemi de plus'],
      },
      15: { sub: 'Capacité de ton archétype de rôdeur' },
      18: { f: [['Sens sauvages', 'Tu repères les créatures invisibles à 9 m (pas de désavantage pour les attaquer).']] },
      20: { f: [['Tueur d’ennemis', 'Une fois par tour, ajoute ton modificateur de SAG à l’attaque ou aux dégâts contre un ennemi juré.']] },
    },
  },
  Roublard: {
    asi: [...BASE_ASI, 10],
    perLevel: (l) => (l % 2 === 1 ? [`Attaque sournoise : ${Math.ceil(l / 2)}d6`] : []),
    raw: {
      2: { f: [['Ruse', 'En action bonus : Foncer, Se désengager ou Se cacher.']] },
      3: { sub: 'Choisis ton archétype de roublard (Voleur dans les règles gratuites)' },
      5: { f: [['Esquive instinctive', 'En réaction, divise par deux les dégâts d’une attaque d’un ennemi que tu vois.']] },
      6: { f: [['Expertise', 'Choisis 2 autres compétences maîtrisées (ou outils de voleur) : ta maîtrise compte double.']] },
      7: { f: [['Dérobade', 'Sauvegarde de DEX pour moitié dégâts : réussite = aucun dégât, échec = moitié.']] },
      9: { sub: 'Capacité de ton archétype de roublard' },
      11: { f: [['Savoir-faire', 'Pour tes compétences maîtrisées, un résultat de 9 ou moins au d20 compte comme 10.']] },
      13: { sub: 'Capacité de ton archétype de roublard' },
      14: { f: [['Perception aveugle', 'Tu sais où se trouvent les créatures cachées ou invisibles à 3 m si tu entends.']] },
      15: { f: [['Esprit fuyant', 'Maîtrise des sauvegardes de SAG.']] },
      17: { sub: 'Capacité de ton archétype de roublard' },
      18: { f: [['Insaisissable', 'Aucune attaque contre toi n’a l’avantage tant que tu n’es pas neutralisé.']] },
      20: { f: [['Coup de chance', 'Une fois par repos court ou long, transforme un raté en réussite, ou un jet de caractéristique en 20.']] },
    },
  },
};

/** Notes automatiques liées aux emplacements de sorts. */
function spellNotes(cls: string, lvl: number): string[] {
  const caster = CLASSES.find((c) => c.name === cls)?.caster ?? 'none';
  if (caster === 'none') return [];
  const out: string[] = [];
  const before = maxSpellLevel(cls, lvl - 1);
  const after = maxSpellLevel(cls, lvl);
  if (after > before && after > 0) out.push(`Sorts de niveau ${after} débloqués`);
  if (caster === 'pact') {
    const prev = spellSlots(cls, lvl - 1);
    const cur = spellSlots(cls, lvl);
    const count = cur[cur.length - 1];
    if (count !== prev[prev.length - 1] || cur.length !== prev.length) {
      out.push(`Emplacements de pacte : ${count} de niveau ${cur.length}`);
    }
  }
  return out;
}

function build(cls: string, d: ClassData): Record<number, LevelGain> {
  const res: Record<number, LevelGain> = {};
  const asiLevels = d.asi ?? BASE_ASI;
  for (let lvl = 2; lvl <= 20; lvl++) {
    const r = d.raw[lvl] ?? {};
    const gain: LevelGain = {
      features: (r.f ?? []).map(([name, description]) => ({ name, source: cls, description })),
    };
    if (asiLevels.includes(lvl)) gain.asi = true;
    if (r.sub) gain.subclass = r.sub;
    if (d.cantrips && d.cantrips[lvl - 1] !== d.cantrips[lvl - 2]) gain.cantripsKnown = d.cantrips[lvl - 1];
    if (d.known && d.known[lvl - 1] !== d.known[lvl - 2]) gain.spellsKnown = d.known[lvl - 1];
    const notes = [...spellNotes(cls, lvl), ...(d.perLevel?.(lvl) ?? []), ...(r.notes ?? [])];
    if (notes.length) gain.notes = notes;
    res[lvl] = gain;
  }
  return res;
}

export const PROGRESSION: Record<string, Record<number, LevelGain>> = Object.fromEntries(
  Object.entries(DATA).map(([cls, d]) => [cls, build(cls, d)]),
);

export function levelUpSummary(cls: string, newLevel: number, conMod: number, hitDie: number) {
  return {
    hpAverage: Math.max(1, Math.floor(hitDie / 2) + 1 + conMod),
    gain: PROGRESSION[cls]?.[newLevel] ?? { features: [] },
    proficiencyChanged: [5, 9, 13, 17].includes(newLevel),
  } as { hpAverage: number; gain: LevelGain; proficiencyChanged: boolean };
}
