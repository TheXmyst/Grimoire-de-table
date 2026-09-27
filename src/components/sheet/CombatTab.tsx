import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ABILITIES, modifier, proficiencyBonus, rollDice, signed, type Attack } from '../../lib/rules';
import { fonts, useTheme } from '../../lib/theme';
import { Body, Button, Card, Field, Label, Row, Title, Toggle } from '../ui';
import { NumField, type SheetProps } from './common';
import { SpellSlots } from './SpellsTab';

const EMPTY: Attack = { name: '', ability: 'FOR', proficient: true, dice: '1d6', type: 'contondant', bonus: 0 };

export function attackNumbers(ch: SheetProps['ch'], a: Attack) {
  const mod = modifier(ch.abilities[a.ability]);
  const toHit = mod + (a.proficient ? proficiencyBonus(ch.level) : 0) + a.bonus;
  const dmgBonus = mod + a.bonus;
  return { toHit, dmgBonus, damage: `${a.dice} ${dmgBonus ? signed(dmgBonus) : ''} ${a.type}`.replace(/\s+/g, ' ').trim() };
}

export function CombatTab(props: SheetProps) {
  const { ch, canInventory, patch, onRoll } = props;
  const t = useTheme();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Attack>(EMPTY);

  function startEdit(index: number | 'new') {
    setDraft(index === 'new' ? EMPTY : ch.attacks[index]);
    setEditing(index === 'new' ? ch.attacks.length : index);
  }

  async function save() {
    if (editing === null) return;
    const attacks = [...ch.attacks];
    attacks[editing] = { ...draft, name: draft.name.trim() || 'Attaque' };
    await patch({ attacks });
    setEditing(null);
  }

  async function remove() {
    if (editing === null) return;
    await patch({ attacks: ch.attacks.filter((_, i) => i !== editing) });
    setEditing(null);
  }

  function attack(a: Attack) {
    const n = attackNumbers(ch, a);
    const d = 1 + Math.floor(Math.random() * 20);
    const crit = d === 20;
    const dmg = rollDice(a.dice);
    // Coup critique : on double les dés de dégâts
    const extra = crit ? rollDice(a.dice) : { total: 0, rolls: [] };
    const total = dmg.total + extra.total + n.dmgBonus;
    onRoll(
      `${a.name} : ${d + n.toHit} pour toucher${crit ? ' (critique !)' : d === 1 ? ' (échec critique)' : ''}`,
      Math.max(0, total),
      `d20 (${d}) ${signed(n.toHit)} · dégâts ${a.dice}${crit ? ' ×2' : ''} (${[...dmg.rolls, ...extra.rolls].join(', ')}) ${signed(n.dmgBonus)} ${a.type}`,
    );
  }

  return (
    <>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Title>Attaques et armes</Title>
          {canInventory && editing === null && <Button small label="Ajouter" onPress={() => startEdit('new')} />}
        </Row>
        {ch.attacks.length === 0 && editing === null && <Body muted>Aucune arme. Ajoute par exemple une masse d'armes ou une fronde.</Body>}

        {ch.attacks.map((a, i) => {
          const n = attackNumbers(ch, a);
          return (
            <View key={i} style={[styles.attack, { borderColor: t.line }]}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Attaquer avec ${a.name}`} style={styles.attackMain} onPress={() => attack(a)}>
                <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16, flexShrink: 1 }}>{a.name}</Text>
                <View style={styles.nums}>
                  <View style={styles.hitCol}>
                    <Text style={[styles.hit, { color: t.accent }]}>{signed(n.toHit)}</Text>
                    <Label>Toucher</Label>
                  </View>
                  <View style={styles.dmgCol}>
                    <Text style={{ color: t.ink, fontSize: 15 }}>{n.damage}</Text>
                    <Label>Dégâts</Label>
                  </View>
                </View>
              </Pressable>
              {canInventory && <Button small label="Modifier" onPress={() => startEdit(i)} />}
            </View>
          );
        })}
        {ch.attacks.length > 0 && <Body muted style={{ fontSize: 13 }}>Touche une arme pour lancer l'attaque et les dégâts.</Body>}

        {editing !== null && (
          <View style={{ gap: 10, borderTopWidth: 1, borderColor: t.line, paddingTop: 12 }}>
            <Row>
              <Field label="Nom de l'arme" value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} placeholder="Masse d'armes" />
              <View style={{ flexBasis: 90 }}>
                <Field label="Dés" value={draft.dice} onChangeText={(v) => setDraft({ ...draft, dice: v })} placeholder="1d6" autoCapitalize="none" />
              </View>
              <Field label="Type de dégâts" value={draft.type} onChangeText={(v) => setDraft({ ...draft, type: v })} placeholder="contondant" />
            </Row>
            <Label>Caractéristique utilisée</Label>
            <Row>
              {ABILITIES.map((a) => (
                <Button key={a.key} small label={a.key} kind={draft.ability === a.key ? 'primary' : 'default'} onPress={() => setDraft({ ...draft, ability: a.key })} />
              ))}
            </Row>
            <Toggle label="Maîtrisée (ajoute le bonus de maîtrise)" value={draft.proficient} onChange={(v) => setDraft({ ...draft, proficient: v })} />
            <View style={{ maxWidth: 200 }}>
              <NumField label="Bonus magique (+1, +2…)" value={draft.bonus} onChange={(v) => setDraft({ ...draft, bonus: v })} />
            </View>
            <Body muted>
              Résultat : {signed(attackNumbers(ch, draft).toHit)} pour toucher, {attackNumbers(ch, draft).damage}
            </Body>
            <Row>
              <Button kind="primary" label="Enregistrer" onPress={save} />
              <Button label="Annuler" onPress={() => setEditing(null)} />
              {editing < ch.attacks.length && <Button kind="danger" label="Supprimer" onPress={remove} />}
            </Row>
          </View>
        )}
      </Card>

      <SpellSlots {...props} />
    </>
  );
}

const styles = StyleSheet.create({
  attack: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  attackMain: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  nums: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hitCol: { width: 64, alignItems: 'center' },
  dmgCol: { width: 150 },
  hit: { fontFamily: fonts.display, fontSize: 22, fontWeight: '700' },
});
