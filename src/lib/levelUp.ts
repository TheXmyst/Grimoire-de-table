// Ce que le bouton « Passer au niveau N » met à jour tout seul sur la fiche.
import { classResources } from './conditions';
import type { Feature } from './rules';
import type { Character, Resource } from './types';
import { addPatronFeature, patronOf } from './warlock';

/** Dé d'arts martiaux du moine. */
const martialDie = (l: number) => (l >= 17 ? '1d10' : l >= 11 ? '1d8' : l >= 5 ? '1d6' : '1d4');
/** Bonus de vitesse sans armure du moine, en mètres. */
const monkSpeed = (l: number) => (l >= 18 ? 9 : l >= 14 ? 7.5 : l >= 10 ? 6 : l >= 6 ? 4.5 : l >= 2 ? 3 : 0);
const rageDamage = (l: number) => (l >= 16 ? 4 : l >= 9 ? 3 : 2);
const rageCount = (l: number) => (l >= 17 ? 6 : l >= 12 ? 5 : l >= 6 ? 4 : l >= 3 ? 3 : 2);

const UNARMED = /mains? nues?|poing|arts martiaux/i;
const meters = (n: number) => `${String(n).replace('.', ',')} m`;

/** Les valeurs à écrire sur la fiche et la liste, en clair, de ce qui change. */
export function levelUpChanges(ch: Character, next: number, hpAverage: number, newFeatures: Feature[]) {
  const changes: string[] = [`PV max ${ch.hp_max} → ${ch.hp_max + hpAverage}`];
  const known = new Set(ch.features.map((f) => f.name));
  let features = [...ch.features, ...newFeatures.filter((f) => !known.has(f.name))];
  let resources: Resource[] = ch.resources;
  let attacks = ch.attacks;
  let speed = ch.speed;

  // Ressources de classe : on met le maximum à jour, sans rendre ce qui a déjà été dépensé
  for (const r of classResources(ch.class, next, ch.abilities)) {
    const old = resources.find((x) => x.name === r.name);
    if (!old) {
      resources = [...resources, r];
      changes.push(`Nouvelle ressource : ${r.name} (${r.max})`);
    } else if (old.max !== r.max || old.reset !== r.reset) {
      resources = resources.map((x) => (x.name === r.name ? { ...x, max: r.max, reset: r.reset, used: Math.min(x.used, r.max) } : x));
      changes.push(`${r.name} : ${old.max} → ${r.max === 99 ? 'illimité' : r.max}`);
    }
  }

  const rewrite = (name: string, fn: (d: string) => string) => {
    features = features.map((f) => (f.name === name ? { ...f, description: fn(f.description) } : f));
  };

  if (ch.class === 'Moine') {
    const before = martialDie(ch.level);
    const after = martialDie(next);
    if (before !== after) {
      attacks = attacks.map((a) => (UNARMED.test(`${a.name} ${a.note ?? ''}`) && a.dice === before ? { ...a, dice: after } : a));
      rewrite('Arts martiaux', (d) => d.replaceAll(before, after));
      changes.push(`Coups à mains nues : ${before} → ${after}`);
    }
    const delta = monkSpeed(next) - monkSpeed(ch.level);
    if (delta > 0) {
      speed = ch.speed + delta;
      changes.push(`Vitesse ${meters(ch.speed)} → ${meters(speed)} (sans armure)`);
    }
  }

  if (ch.class === 'Barbare') {
    if (next === 5) {
      speed = ch.speed + 3;
      changes.push(`Vitesse ${meters(ch.speed)} → ${meters(speed)} (sans armure lourde)`);
    }
    rewrite('Rage', (d) =>
      d.replace(/^\d+ fois par repos long/, next >= 20 ? 'À volonté' : `${rageCount(next)} fois par repos long`).replace(/\+\d aux dégâts/, `+${rageDamage(next)} aux dégâts`),
    );
    if (rageDamage(next) !== rageDamage(ch.level)) changes.push(`Dégâts de rage : +${rageDamage(ch.level)} → +${rageDamage(next)}`);
  }

  if (ch.class === 'Roublard' && next % 2 === 1) {
    const dice = `${Math.ceil(next / 2)}d6`;
    rewrite('Attaque sournoise', (d) => d.replace(/\d+d6/, dice));
    changes.push(`Attaque sournoise : ${Math.ceil(ch.level / 2)}d6 → ${dice}`);
  }

  // Sorcier : l'aptitude du protecteur arrive avec le niveau
  const patron = patronOf(ch);
  if (patron) {
    for (const g of patron.features.filter((g) => g.level === next && !features.some((f) => f.name === g.name))) {
      const added = addPatronFeature({ ...ch, features, resources }, patron, g);
      features = added.features;
      resources = added.resources;
      changes.push(`${patron.name} : ${g.name}`);
    }
  }

  const fresh = features.length - ch.features.length;
  if (fresh > 0) changes.push(`${fresh} capacité${fresh > 1 ? 's' : ''} ajoutée${fresh > 1 ? 's' : ''} dans l'onglet Capacités`);

  const values: Partial<Character> = {
    level: next,
    hp_max: ch.hp_max + hpAverage,
    hp: ch.hp + hpAverage,
    features,
    resources,
    attacks,
    speed,
  };
  return { values, changes };
}
