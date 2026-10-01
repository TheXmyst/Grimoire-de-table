import { modifier, type AbilityKey } from './rules';
import type { Resource } from './types';

/** Les états du jeu (annexe A du Manuel des joueurs), résumés pour la table. */
export const CONDITIONS: { name: string; summary: string }[] = [
  { name: 'À terre', summary: "Tu ne peux que ramper ou te relever (moitié de ta vitesse). Désavantage à tes attaques. Avantage pour qui t'attaque à 1,5 m, désavantage pour qui t'attaque de plus loin." },
  { name: 'Agrippé', summary: "Ta vitesse tombe à 0. L'état cesse si celui qui t'agrippe est neutralisé ou si tu es éloigné de lui." },
  { name: 'Assourdi', summary: "Tu n'entends rien : tu rates automatiquement les tests qui demandent l'ouïe." },
  { name: 'Aveuglé', summary: "Tu ne vois rien : tu rates les tests qui demandent la vue. Désavantage à tes attaques, avantage pour qui t'attaque." },
  { name: 'Charmé', summary: "Tu ne peux pas attaquer celui qui t'a charmé ni le viser avec un effet nuisible. Il a l'avantage à ses tests pour interagir socialement avec toi." },
  { name: 'Effrayé', summary: "Désavantage à tes tests et attaques tant que la source de ta peur est en vue. Tu ne peux pas t'en approcher volontairement." },
  { name: 'Empoisonné', summary: 'Désavantage à tes jets d’attaque et à tes tests de caractéristique.' },
  { name: 'Entravé', summary: 'Vitesse 0. Désavantage à tes attaques et à tes sauvegardes de Dextérité. Avantage pour qui t’attaque.' },
  { name: 'Étourdi', summary: 'Tu es neutralisé, tu ne peux pas bouger et tu parles à peine. Tu rates les sauvegardes de FOR et DEX. Avantage pour qui t’attaque.' },
  { name: 'Inconscient', summary: "Neutralisé, à terre, tu lâches ce que tu tiens et ne remarques rien. Tu rates les sauvegardes de FOR et DEX. Avantage pour qui t'attaque, et tout coup à 1,5 m est un critique." },
  { name: 'Invisible', summary: 'On ne te voit pas sans magie. Avantage à tes attaques, désavantage pour qui t’attaque.' },
  { name: 'Neutralisé', summary: "Tu ne peux faire ni action ni réaction." },
  { name: 'Paralysé', summary: "Neutralisé, tu ne peux ni bouger ni parler. Tu rates les sauvegardes de FOR et DEX. Avantage pour qui t'attaque, et tout coup à 1,5 m est un critique." },
  { name: 'Pétrifié', summary: "Changé en pierre et neutralisé. Tu rates les sauvegardes de FOR et DEX, tu résistes à tous les dégâts et ne vieillis plus. Avantage pour qui t'attaque." },
];

/** Effets cumulés de chaque niveau d'épuisement (index = niveau). */
export const EXHAUSTION: string[] = [
  'Aucun épuisement.',
  'Désavantage aux tests de caractéristique.',
  'Vitesse divisée par deux.',
  'Désavantage aux jets d’attaque et de sauvegarde.',
  'Points de vie maximum divisés par deux.',
  'Vitesse réduite à 0.',
  'Mort.',
];

/** Ressources de départ d'une classe au niveau donné, pour remplir la fiche d'un clic. */
export function classResources(cls: string, level: number, abilities: Record<AbilityKey, number>): Resource[] {
  const cha = Math.max(1, modifier(abilities.CHA));
  const r = (name: string, max: number, reset: Resource['reset']): Resource => ({ name, max, used: 0, reset });
  switch (cls) {
    case 'Barbare':
      return [r('Rage', level >= 20 ? 99 : level >= 17 ? 6 : level >= 12 ? 5 : level >= 6 ? 4 : level >= 3 ? 3 : 2, 'long')];
    case 'Barde':
      return [r('Inspiration bardique', cha, level >= 5 ? 'court' : 'long')];
    case 'Clerc':
      return level >= 2 ? [r('Conduit divin', level >= 18 ? 3 : level >= 6 ? 2 : 1, 'court')] : [];
    case 'Druide':
      return level >= 2 ? [r('Forme sauvage', 2, 'court')] : [];
    case 'Ensorceleur':
      return level >= 2 ? [r('Points de sorcellerie', level, 'long')] : [];
    case 'Guerrier': {
      const list = [r('Second souffle', 1, 'court')];
      if (level >= 2) list.push(r('Fougue', level >= 17 ? 2 : 1, 'court'));
      if (level >= 9) list.push(r('Indomptable', level >= 17 ? 3 : level >= 13 ? 2 : 1, 'long'));
      return list;
    }
    case 'Magicien':
      return [r('Restauration arcanique', 1, 'long')];
    case 'Moine':
      return level >= 2 ? [r('Ki', level, 'court')] : [];
    case 'Paladin':
      return [r('Sens divin', 1 + cha, 'long'), r('Imposition des mains (PV)', 5 * level, 'long'), ...(level >= 3 ? [r('Conduit divin', 1, 'court')] : [])];
    default:
      return [];
  }
}
