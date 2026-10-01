import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COINS, coinsInGold, type CoinKey } from '../../lib/rules';
import { fonts, useTheme } from '../../lib/theme';
import { Body, Button, Card, Field, Label, Row, Title, Toggle } from '../ui';
import { ArmoryCard } from './ArmoryCard';
import type { MagicItem } from '../../lib/types';
import { parseInventory, serializeInventory, type Item } from '../../lib/inventory';
import { Collapsible, TextArea, type SheetProps } from './common';

export function BagTab(props: SheetProps) {
  const { ch, canInventory, patch } = props;
  const strength = ch.abilities.FOR;
  const t = useTheme();
  const [step, setStep] = useState('1');
  const n = Math.max(1, parseInt(step, 10) || 1);

  function change(key: CoinKey, delta: number) {
    patch({ coins: { ...ch.coins, [key]: Math.max(0, (ch.coins[key] ?? 0) + delta) } });
  }

  const total = coinsInGold(ch.coins);

  const items = parseInventory(ch.inventory);
  const indexed = items.map((item, index) => ({ item, index }));
  const worn = indexed.filter((i) => i.item.equipped);
  const carried = indexed.filter((i) => !i.item.equipped);
  const [draft, setDraft] = useState('');

  const save = (next: Item[]) => patch({ inventory: serializeInventory(next) });
  const toggle = (index: number) => save(items.map((it, i) => (i === index ? { ...it, equipped: !it.equipped } : it)));
  const remove = (index: number) => save(items.filter((_, i) => i !== index));
  function add() {
    if (!draft.trim()) return;
    save([...items, { text: draft.trim(), equipped: false }]);
    setDraft('');
  }

  return (
    <>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Title>Bourse</Title>
          <Body muted>≈ {Number.isInteger(total) ? total : total.toFixed(2)} po</Body>
        </Row>
        <View style={styles.coins}>
          {COINS.map((c) => (
            <View key={c.key} style={[styles.coin, { borderColor: c.key === 'po' ? t.brass : t.line, backgroundColor: t.bg }]}>
              <Label>{c.label}</Label>
              <Text style={[styles.amount, { color: c.key === 'po' ? t.brass : t.ink }]}>{ch.coins[c.key] ?? 0}</Text>
              <Text style={{ color: t.muted, fontSize: 12 }}>{c.name}</Text>
              {canInventory && (
                <Row style={{ gap: 6, justifyContent: 'center' }}>
                  <Button small label="−" onPress={() => change(c.key, -n)} />
                  <Button small label="+" onPress={() => change(c.key, n)} />
                </Row>
              )}
            </View>
          ))}
        </View>
        {canInventory && (
          <Row>
            <Body muted>Ajouter ou retirer par</Body>
            <TextInput
              value={step}
              onChangeText={setStep}
              keyboardType="number-pad"
              accessibilityLabel="Quantité de pièces par appui"
              style={[styles.step, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]}
            />
          </Row>
        )}
      </Card>

      <ArmoryCard {...props} />

      <Card>
        <Title>Équipement porté</Title>
        {worn.length === 0 && <Body muted>Rien de porté. Appuie sur « Porter » à côté d'un objet du sac.</Body>}
        {worn.map(({ item, index }) => (
          <ItemRow key={index} text={item.text} worn canEdit={canInventory} onToggle={() => toggle(index)} onRemove={() => remove(index)} />
        ))}
      </Card>

      <MagicItems ch={ch} canEdit={canInventory} patch={patch} />

      <Card>
        <Title>Sac</Title>
        <Body muted style={{ fontSize: 13 }}>
          Tu peux porter jusqu'à {String(strength * 7.5).replace('.', ',')} kg (FOR × 7,5), et pousser ou tirer le double.
        </Body>
        {carried.length === 0 && <Body muted>Le sac est vide.</Body>}
        {carried.map(({ item, index }) => (
          <ItemRow key={index} text={item.text} worn={false} canEdit={canInventory} onToggle={() => toggle(index)} onRemove={() => remove(index)} />
        ))}
        {canInventory && (
          <Row>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={add}
              placeholder="Nouvel objet : corde de 15 m, potion de soins…"
              placeholderTextColor={t.muted}
              accessibilityLabel="Nouvel objet"
              style={[styles.newItem, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]}
            />
            <Button small kind="primary" label="Ajouter" onPress={add} disabled={!draft.trim()} />
          </Row>
        )}
        {canInventory && (
          <Collapsible title="Modifier en texte" preview="Une ligne par objet, « * » devant ce qui est porté">
            <TextArea value={ch.inventory} editable onSave={(v) => patch({ inventory: v })} minHeight={200} />
          </Collapsible>
        )}
      </Card>
    </>
  );
}

const EMPTY_MAGIC: MagicItem = { name: '', attuned: false, description: '' };

/** Objets magiques, avec le lien (3 au maximum). */
function MagicItems({ ch, canEdit, patch }: { ch: SheetProps['ch']; canEdit: boolean; patch: SheetProps['patch'] }) {
  const t = useTheme();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<MagicItem>(EMPTY_MAGIC);
  const attuned = ch.magic_items.filter((m) => m.attuned).length;

  async function save() {
    if (editing === null) return;
    const list = [...ch.magic_items];
    list[editing] = { ...draft, name: draft.name.trim() || 'Objet magique' };
    await patch({ magic_items: list });
    setEditing(null);
  }

  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <Title>Objets magiques</Title>
        <Body muted style={{ color: attuned > 3 ? t.bad : t.muted }}>Lien {attuned}/3</Body>
      </Row>
      {ch.magic_items.length === 0 && editing === null && <Body muted>Aucun objet magique pour l'instant.</Body>}
      {ch.magic_items.map((m, i) => (
        <View key={i} style={[styles.item, { borderColor: t.line, alignItems: 'flex-start' }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }}>
              {m.name}
              {m.attuned ? <Text style={{ color: t.brass }}>  · lié</Text> : null}
            </Text>
            {m.description ? <Text style={{ color: t.ink, fontSize: 15 }}>{m.description}</Text> : null}
          </View>
          {canEdit && editing === null && (
            <Button
              small
              label="Modifier"
              onPress={() => {
                setDraft(m);
                setEditing(i);
              }}
            />
          )}
        </View>
      ))}
      {canEdit && editing === null && (
        <Button
          small
          label="Ajouter un objet magique"
          onPress={() => {
            setDraft(EMPTY_MAGIC);
            setEditing(ch.magic_items.length);
          }}
        />
      )}
      {editing !== null && (
        <View style={{ gap: 10, borderTopWidth: 1, borderColor: t.line, paddingTop: 12 }}>
          <Field label="Nom" value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} placeholder="Cape de protection" />
          <Field
            label="Effet"
            value={draft.description}
            onChangeText={(v) => setDraft({ ...draft, description: v })}
            placeholder="+1 à la CA et aux jets de sauvegarde"
            multiline
            style={{ minHeight: 70, textAlignVertical: 'top' }}
          />
          <Toggle label="Lié (harmonisé) à ce personnage" value={draft.attuned} onChange={(v) => setDraft({ ...draft, attuned: v })} />
          <Row>
            <Button kind="primary" label="Enregistrer" onPress={save} />
            <Button label="Annuler" onPress={() => setEditing(null)} />
            {editing < ch.magic_items.length && (
              <Button
                kind="danger"
                label="Supprimer"
                onPress={async () => {
                  await patch({ magic_items: ch.magic_items.filter((_, j) => j !== editing) });
                  setEditing(null);
                }}
              />
            )}
          </Row>
        </View>
      )}
    </Card>
  );
}

function ItemRow({
  text,
  worn,
  canEdit,
  onToggle,
  onRemove,
}: {
  text: string;
  worn: boolean;
  canEdit: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const t = useTheme();
  return (
    <View style={[styles.item, { borderColor: t.line }]}>
      <Text style={{ color: t.ink, fontSize: 16, flex: 1, fontWeight: worn ? '700' : '400' }}>{text}</Text>
      {canEdit && <Button small label={worn ? 'Ranger' : 'Porter'} onPress={onToggle} />}
      {canEdit && !worn && <Button small kind="danger" label="✕" onPress={onRemove} />}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  newItem: { flex: 1, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 16 },
  coins: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  coin: { flexGrow: 1, flexBasis: 110, borderWidth: 1, borderRadius: 8, padding: 8, alignItems: 'center', gap: 4 },
  amount: { fontFamily: fonts.display, fontSize: 26, fontWeight: '700' },
  step: { width: 70, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16, textAlign: 'center' },
});
