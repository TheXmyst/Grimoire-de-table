import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ABILITIES, hitDieOf, modifier, proficiencyBonus, rollDice, signed, type Attack } from '../../lib/rules';
import { fonts, useTheme } from '../../lib/theme';
import { Body, Button, Card, Field, Label, Row, Title, Toggle } from '../ui';
import { NumField, longRestValues, type SheetProps } from './common';
import { SpellSlots } from './SpellsTab';

/** Dés de vie et jets contre la mort. */
function Vitality({ ch, isGm, isOwner, canHp, patch, onRoll }: SheetProps) {
  const t = useTheme();
  const die = hitDieOf(ch.class);
  const left = Math.max(0, ch.level - ch.hit_dice_used);
  const canEdit = isGm || isOwner;

  // Repos court : on dépense un dé de vie, on récupère dé + modificateur de CON
  function spendHitDie() {
    const r = 1 + Math.floor(Math.random() * die);
    const con = modifier(ch.abilities.CON);
    const gain = Math.max(0, r + con);
    patch({ hit_dice_used: ch.hit_dice_used + 1, hp: Math.min(ch.hp_max, ch.hp + gain) });
    onRoll(`Dé de vie : +${gain} PV`, gain, `d${die} (${r}) ${signed(con)} CON`);
  }

  function deathSave() {
    const r = 1 + Math.floor(Math.random() * 20);
    if (r === 20) {
      patch({ hp: 1, death_successes: 0, death_failures: 0 });
      onRoll('Jet contre la mort : 20 naturel, tu te relèves avec 1 PV !', r, 'd20');
    } else if (r === 1) {
      patch({ death_failures: Math.min(3, ch.death_failures + 2) });
      onRoll('Jet contre la mort : 1 naturel, deux échecs', r, 'd20');
    } else if (r >= 10) {
      patch({ death_successes: Math.min(3, ch.death_successes + 1) });
      onRoll('Jet contre la mort : réussite', r, 'd20 (10 ou plus)');
    } else {
      patch({ death_failures: Math.min(3, ch.death_failures + 1) });
      onRoll('Jet contre la mort : échec', r, 'd20 (9 ou moins)');
    }
  }

  const Boxes = ({ n, color, field }: { n: number; color: string; field: 'death_successes' | 'death_failures' }) => (
    <Row style={{ gap: 6 }}>
      {[0, 1, 2].map((i) => (
        <Pressable
          key={i}
          disabled={!canEdit}
          accessibilityLabel={`${field === 'death_successes' ? 'Réussite' : 'Échec'} ${i + 1}`}
          onPress={() => patch({ [field]: i < n ? i : i + 1 })}
          style={[styles.box, { borderColor: color, backgroundColor: i < n ? color : 'transparent' }]}
        />
      ))}
    </Row>
  );

  return (
    <Card>
      <Title>Dés de vie et survie</Title>
      <Row style={{ justifyContent: 'space-between' }}>
        <Body>
          Dés de vie : <Text style={{ fontWeight: '700' }}>{left}</Text> / {ch.level} (d{die})
        </Body>
        {canEdit && (
          <Row>
            {canHp && <Button small label="Repos court : dépenser un dé" disabled={left === 0 || ch.hp >= ch.hp_max} onPress={spendHitDie} />}
            <Button small label="Repos long" onPress={() => patch(longRestValues(ch, canHp))} />
          </Row>
        )}
      </Row>
      {(ch.hp === 0 || ch.death_successes > 0 || ch.death_failures > 0) ? (
        <View style={{ gap: 8 }}>
          <Label>Jets contre la mort</Label>
          <Row style={{ gap: 16 }}>
            <Row style={{ gap: 8 }}><Body muted>Réussites</Body><Boxes n={ch.death_successes} color={t.good} field="death_successes" /></Row>
            <Row style={{ gap: 8 }}><Body muted>Échecs</Body><Boxes n={ch.death_failures} color={t.bad} field="death_failures" /></Row>
          </Row>
          {canEdit && (
            <Row>
              <Button small kind="primary" label="Lancer le jet" onPress={deathSave} />
              <Button small label="Remettre à zéro" onPress={() => patch({ death_successes: 0, death_failures: 0 })} />
            </Row>
          )}
          {ch.death_successes >= 3 && <Body style={{ color: t.good }}>Stabilisé : plus de jets à faire.</Body>}
          {ch.death_failures >= 3 && <Body style={{ color: t.bad }}>Trois échecs : le personnage est mort.</Body>}
        </View>
      ) : (
        <Body muted style={{ fontSize: 13 }}>Les jets contre la mort apparaissent ici quand les PV tombent à 0.</Body>
      )}
    </Card>
  );
}

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
              {a.note ? <Text style={{ color: t.muted, fontSize: 13, width: '100%' }}>{a.note}</Text> : null}
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
            <Field
              label="Notes (portée, propriétés)"
              value={draft.note ?? ''}
              onChangeText={(v) => setDraft({ ...draft, note: v })}
              placeholder="Finesse, légère. Lancer 6/18 m."
            />
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

      <Vitality {...props} />
      <SpellSlots {...props} />
    </>
  );
}

const styles = StyleSheet.create({
  attack: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  attackMain: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  nums: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hitCol: { width: 64, alignItems: 'center' },
  dmgCol: { width: 150 },
  box: { width: 22, height: 22, borderRadius: 4, borderWidth: 2 },
  hit: { fontFamily: fonts.display, fontSize: 22, fontWeight: '700' },
});
