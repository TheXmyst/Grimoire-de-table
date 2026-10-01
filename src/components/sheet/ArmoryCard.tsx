import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ARMORS,
  DON_DOFF,
  WEAPONS,
  armorOfLine,
  armorProficiencies,
  computeAc,
  weaponAttack,
  weaponProficient,
  wornArmor,
  type Armor,
  type Weapon,
} from '../../lib/equipment';
import { parseInventory, serializeInventory } from '../../lib/inventory';
import { useTheme } from '../../lib/theme';
import { Body, Button, Card, Label, Pill, Row, Title } from '../ui';
import type { SheetProps } from './common';

const kg = (n: number) => `${String(n).replace('.', ',')} kg`;

function acLabel(a: Armor) {
  if (a.category === 'bouclier') return `+${a.base}`;
  if (a.category === 'légère') return `${a.base} + DEX`;
  if (a.category === 'intermédiaire') return `${a.base} + DEX (max 2)`;
  return String(a.base);
}

const ARMOR_GROUPS: { title: string; category: Armor['category'] }[] = [
  { title: 'Armures légères', category: 'légère' },
  { title: 'Armures intermédiaires', category: 'intermédiaire' },
  { title: 'Armures lourdes', category: 'lourde' },
];

const WEAPON_GROUPS: { title: string; filter: (w: Weapon) => boolean }[] = [
  { title: 'Armes courantes de corps à corps', filter: (w) => w.group === 'courante' && !w.ranged },
  { title: 'Armes courantes à distance', filter: (w) => w.group === 'courante' && w.ranged },
  { title: 'Armes de guerre de corps à corps', filter: (w) => w.group === 'de guerre' && !w.ranged },
  { title: 'Armes de guerre à distance', filter: (w) => w.group === 'de guerre' && w.ranged },
];

/** Choix de l'armure, du bouclier et des armes, avec CA et malus calculés selon les règles. */
export function ArmoryCard({ ch, campaign, isGm, canInventory, patch }: SheetProps) {
  const t = useTheme();
  const [picker, setPicker] = useState<'armor' | 'weapon' | null>(null);
  const canEdit = isGm || canInventory;

  const { armor, shield } = wornArmor(ch);
  const computed = computeAc(ch, armor, shield);
  const profs = armorProficiencies(ch);
  const encumbrance = !!campaign.settings.armor_encumbrance;

  // Changer d'armure : on range l'ancienne dans le sac et on porte la nouvelle
  async function wear(next: Armor | null, kind: 'body' | 'shield') {
    const items = parseInventory(ch.inventory).map((it) => {
      const a = it.equipped ? armorOfLine(it.text) : undefined;
      const sameKind = a && (kind === 'shield' ? a.category === 'bouclier' : a.category !== 'bouclier');
      return sameKind ? { ...it, equipped: false } : it;
    });
    if (next) {
      const owned = items.findIndex((it) => armorOfLine(it.text)?.name === next.name);
      if (owned >= 0) items[owned] = { ...items[owned], equipped: true };
      else items.unshift({ text: next.name, equipped: true });
    }
    const inventory = serializeInventory(items);
    const values: Parameters<typeof patch>[0] = { inventory };
    if (isGm) {
      const after = wornArmor({ ...ch, inventory });
      const ac = computeAc(ch, after.armor, after.shield);
      values.ac = ac.ac;
      values.ac_note = ac.note;
    }
    await patch(values);
    setPicker(null);
  }

  async function addWeapon(weapon: Weapon) {
    const items = parseInventory(ch.inventory);
    items.unshift({ text: weapon.name, equipped: true });
    await patch({ attacks: [...ch.attacks, weaponAttack(ch, weapon)], inventory: serializeInventory(items) });
  }

  const warnings: string[] = [];
  for (const a of [armor, shield]) {
    if (a && !profs.has(a.category)) {
      warnings.push(
        `Tu ne maîtrises pas ${a.category === 'bouclier' ? 'le bouclier' : `les armures ${a.category}s`} : désavantage à tout test, sauvegarde ou attaque de FOR ou DEX, et impossible de lancer des sorts.`,
      );
    }
  }
  if (armor?.strength && ch.abilities.FOR < armor.strength) {
    warnings.push(`Force ${armor.strength} requise (tu as ${ch.abilities.FOR}) : ta vitesse baisse de 3 m.`);
  }
  if (armor?.stealthDisadvantage) warnings.push('Désavantage aux tests de Discrétion.');
  if (encumbrance && armor?.category === 'intermédiaire') warnings.push('Encombrement : désavantage aux tests d’Acrobaties.');
  if (encumbrance && armor?.category === 'lourde') warnings.push('Encombrement : désavantage en initiative, en Acrobaties et en Athlétisme.');

  return (
    <Card>
      <Title>Armurerie</Title>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ flexShrink: 1, gap: 2 }}>
          <Body>
            <Text style={{ fontWeight: '700' }}>{armor ? armor.name : 'Sans armure'}</Text>
            {shield ? ' + bouclier' : ''}
          </Body>
          <Body muted style={{ fontSize: 14 }}>
            CA calculée {computed.ac} : {computed.note}
          </Body>
        </View>
        {computed.ac !== ch.ac &&
          (isGm ? (
            <Button small kind="primary" label={`Appliquer CA ${computed.ac}`} onPress={() => patch({ ac: computed.ac, ac_note: computed.note })} />
          ) : (
            <Pill text={`Fiche : CA ${ch.ac}`} tone="warn" />
          ))}
      </Row>
      {warnings.map((w) => (
        <Body key={w} style={{ color: t.bad, fontSize: 14 }}>
          • {w}
        </Body>
      ))}
      {(armor || shield) && (
        <Body muted style={{ fontSize: 13 }}>
          {[armor, shield]
            .filter((a): a is Armor => !!a)
            .map((a) => `${a.category === 'bouclier' ? 'Bouclier' : a.name} : ${DON_DOFF[a.category].on} pour l'enfiler, ${DON_DOFF[a.category].off} pour l'ôter`)
            .join(' · ')}
          . Ôter une armure va deux fois plus vite avec de l'aide.
        </Body>
      )}

      {canEdit && (
        <Row>
          <Button small label={picker === 'armor' ? 'Fermer' : "Changer d'armure"} onPress={() => setPicker(picker === 'armor' ? null : 'armor')} />
          <Button small label={shield ? 'Poser le bouclier' : 'Prendre un bouclier'} onPress={() => wear(shield ? null : ARMORS.find((a) => a.category === 'bouclier')!, 'shield')} />
          <Button small label={picker === 'weapon' ? 'Fermer' : 'Ajouter une arme'} onPress={() => setPicker(picker === 'weapon' ? null : 'weapon')} />
        </Row>
      )}

      {picker === 'armor' && (
        <View style={{ gap: 6 }}>
          {armor && <Button small label="Retirer l'armure" onPress={() => wear(null, 'body')} />}
          {ARMOR_GROUPS.map((g) => (
            <View key={g.category} style={{ gap: 4 }}>
              <Label>
                {g.title}
                {profs.has(g.category) ? '' : ' · non maîtrisées'}
              </Label>
              {ARMORS.filter((a) => a.category === g.category).map((a) => {
                const current = armor?.name === a.name;
                return (
                  <View key={a.name} style={[styles.row, { borderColor: t.line }]}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16 }}>{a.name}</Text>
                      <Text style={{ color: t.muted, fontSize: 13 }}>
                        CA {acLabel(a)}
                        {a.strength ? ` · For ${a.strength}` : ''}
                        {a.stealthDisadvantage ? ' · Discrétion désav.' : ''} · {kg(a.weight)} · {a.price} po
                      </Text>
                      <Text style={{ color: t.muted, fontSize: 13 }}>{a.note}</Text>
                    </View>
                    {current ? <Pill text="Portée" tone="accent" /> : <Button small label="Porter" onPress={() => wear(a, 'body')} />}
                  </View>
                );
              })}
            </View>
          ))}
          {!isGm && <Body muted style={{ fontSize: 13 }}>Ton MJ validera la nouvelle CA sur ta fiche.</Body>}
        </View>
      )}

      {picker === 'weapon' && (
        <View style={{ gap: 6 }}>
          {WEAPON_GROUPS.map((g) => (
            <View key={g.title} style={{ gap: 4 }}>
              <Label>{g.title}</Label>
              {WEAPONS.filter(g.filter).map((wpn) => {
                const prof = weaponProficient(ch, wpn);
                const has = ch.attacks.some((a) => a.name === wpn.name);
                return (
                  <View key={wpn.name} style={[styles.row, { borderColor: t.line }]}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16 }}>
                        {wpn.name}
                        {prof ? '' : <Text style={{ color: t.bad, fontWeight: '400', fontSize: 13 }}>  non maîtrisée</Text>}
                      </Text>
                      <Text style={{ color: t.muted, fontSize: 13 }}>
                        {wpn.dice} {wpn.type}
                        {wpn.versatile ? ` (${wpn.versatile} à deux mains)` : ''}
                        {wpn.range ? ` · ${wpn.range} m` : ''}
                        {wpn.properties.length ? ` · ${wpn.properties.join(', ')}` : ''} · {kg(wpn.weight)} · {wpn.price}
                      </Text>
                    </View>
                    <Button small label={has ? 'Encore une' : 'Ajouter'} onPress={() => addWeapon(wpn)} />
                  </View>
                );
              })}
            </View>
          ))}
          <Body muted style={{ fontSize: 13 }}>
            L'arme arrive dans tes attaques (bonus calculés) et dans ton équipement porté. Sans maîtrise, tu n'ajoutes pas ton bonus de maîtrise au
            toucher.
          </Body>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
});
