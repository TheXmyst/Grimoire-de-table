import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CONDITIONS, EXHAUSTION, classResources } from '../../lib/conditions';
import { fonts, useTheme } from '../../lib/theme';
import type { Resource } from '../../lib/types';
import { Body, Button, Card, Field, Label, Row, Title } from '../ui';
import type { SheetProps } from './common';

/** États, épuisement et concentration : ce qui change d'un tour à l'autre. */
export function StatusCard({ ch, isGm, isOwner, patch }: SheetProps) {
  const t = useTheme();
  const canEdit = isGm || isOwner;
  const [open, setOpen] = useState<string | null>(null);
  const [conc, setConc] = useState('');

  function toggle(name: string) {
    const has = ch.conditions.includes(name);
    patch({ conditions: has ? ch.conditions.filter((c) => c !== name) : [...ch.conditions, name] });
  }

  const active = CONDITIONS.filter((c) => ch.conditions.includes(c.name));

  return (
    <Card>
      <Title>États</Title>
      <View style={styles.chips}>
        {CONDITIONS.map((c) => {
          const on = ch.conditions.includes(c.name);
          return (
            <Pressable
              key={c.name}
              accessibilityRole="switch"
              accessibilityState={{ checked: on }}
              onPress={() => (canEdit ? toggle(c.name) : setOpen(open === c.name ? null : c.name))}
              onLongPress={() => setOpen(open === c.name ? null : c.name)}
              style={[styles.chip, { borderColor: on ? t.bad : t.line, backgroundColor: on ? t.bad : 'transparent' }]}
            >
              <Text style={{ color: on ? t.bg : t.muted, fontWeight: '700', fontSize: 13 }}>{c.name}</Text>
            </Pressable>
          );
        })}
      </View>
      {active.map((c) => (
        <Body key={c.name}>
          <Text style={{ fontWeight: '700' }}>{c.name} : </Text>
          {c.summary}
        </Body>
      ))}
      {open && !ch.conditions.includes(open) && (
        <Body muted>
          <Text style={{ fontWeight: '700' }}>{open} : </Text>
          {CONDITIONS.find((c) => c.name === open)?.summary}
        </Body>
      )}
      {canEdit && <Body muted style={{ fontSize: 13 }}>Touche un état pour l'activer ou l'enlever, appui long pour lire son effet.</Body>}

      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <Label>Épuisement</Label>
        <Row style={{ gap: 6 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Pressable
              key={n}
              disabled={!canEdit}
              accessibilityLabel={`Épuisement niveau ${n}`}
              onPress={() => patch({ exhaustion: ch.exhaustion === n ? n - 1 : n })}
              style={[styles.pip, { borderColor: n <= ch.exhaustion ? t.bad : t.line, backgroundColor: n <= ch.exhaustion ? t.bad : 'transparent' }]}
            >
              <Text style={{ color: n <= ch.exhaustion ? t.bg : t.muted, fontWeight: '700' }}>{n}</Text>
            </Pressable>
          ))}
        </Row>
      </Row>
      {ch.exhaustion > 0 && (
        <Body style={{ color: t.bad }}>
          Niveau {ch.exhaustion} : {EXHAUSTION.slice(1, ch.exhaustion + 1).join(' ')} Un repos long retire un niveau.
        </Body>
      )}

      <Label>Concentration</Label>
      {ch.concentration ? (
        <Row style={{ justifyContent: 'space-between' }}>
          <Body style={{ flexShrink: 1 }}>
            Tu maintiens <Text style={{ fontWeight: '700' }}>{ch.concentration}</Text>. Si tu subis des dégâts : sauvegarde de CON, DD 10 ou la
            moitié des dégâts si c'est plus.
          </Body>
          {canEdit && <Button small label="Arrêter" onPress={() => patch({ concentration: '' })} />}
        </Row>
      ) : canEdit ? (
        <Row>
          <TextInput
            value={conc}
            onChangeText={setConc}
            placeholder="Sort maintenu (Bénédiction…)"
            placeholderTextColor={t.muted}
            accessibilityLabel="Sort de concentration"
            style={[styles.input, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]}
          />
          <Button
            small
            label="Commencer"
            disabled={!conc.trim()}
            onPress={() => {
              patch({ concentration: conc.trim() });
              setConc('');
            }}
          />
        </Row>
      ) : (
        <Body muted>Aucune.</Body>
      )}
    </Card>
  );
}

const EMPTY: Resource = { name: '', max: 1, used: 0, reset: 'long' };

/** Capacités à usages limités : rage, ki, conduit divin, second souffle… */
export function ResourcesCard({ ch, isGm, isOwner, patch }: SheetProps) {
  const t = useTheme();
  const canEdit = isGm || isOwner;
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Resource>(EMPTY);

  const use = (i: number, delta: number) =>
    patch({ resources: ch.resources.map((r, j) => (j === i ? { ...r, used: Math.max(0, Math.min(r.max, r.used + delta)) } : r)) });

  async function save() {
    if (editing === null) return;
    const list = [...ch.resources];
    list[editing] = { ...draft, name: draft.name.trim() || 'Ressource', max: Math.max(1, draft.max), used: Math.min(draft.used, Math.max(1, draft.max)) };
    await patch({ resources: list });
    setEditing(null);
  }

  const suggested = classResources(ch.class, ch.level, ch.abilities);

  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <Title>Ressources</Title>
        {canEdit && ch.resources.some((r) => r.reset === 'court' && r.used > 0) && (
          <Button small label="Repos court" onPress={() => patch({ resources: ch.resources.map((r) => (r.reset === 'court' ? { ...r, used: 0 } : r)) })} />
        )}
      </Row>
      {ch.resources.length === 0 && <Body muted>Aucune ressource à suivre (rage, ki, conduit divin…).</Body>}
      {ch.resources.map((r, i) => {
        const left = r.max - r.used;
        return (
          <View key={i} style={[styles.res, { borderColor: t.line }]}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16 }}>{r.name}</Text>
              <Text style={{ color: t.muted, fontSize: 13 }}>Revient après un repos {r.reset}</Text>
            </View>
            <Text style={[styles.count, { color: left > 0 ? t.ink : t.bad }]}>
              {left}/{r.max}
            </Text>
            {canEdit && <Button small label="Utiliser" disabled={left <= 0} onPress={() => use(i, 1)} />}
            {canEdit && <Button small label="+1" disabled={r.used <= 0} onPress={() => use(i, -1)} />}
            {isGm && editing === null && (
              <Button
                small
                label="Modifier"
                onPress={() => {
                  setDraft(r);
                  setEditing(i);
                }}
              />
            )}
          </View>
        );
      })}

      {isGm && editing === null && (
        <Row>
          <Button
            small
            label="Ajouter"
            onPress={() => {
              setDraft(EMPTY);
              setEditing(ch.resources.length);
            }}
          />
          {suggested.length > 0 && (
            <Button
              small
              label={`Ressources de ${ch.class.toLowerCase()} niv. ${ch.level}`}
              onPress={() => {
                const others = ch.resources.filter((r) => !suggested.some((s) => s.name === r.name));
                patch({ resources: [...suggested, ...others] });
              }}
            />
          )}
        </Row>
      )}

      {editing !== null && (
        <View style={{ gap: 10, borderTopWidth: 1, borderColor: t.line, paddingTop: 12 }}>
          <Row>
            <Field label="Nom" value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} placeholder="Rage" />
            <Field label="Maximum" value={String(draft.max)} keyboardType="number-pad" onChangeText={(v) => setDraft({ ...draft, max: parseInt(v, 10) || 0 })} />
          </Row>
          <Row>
            <Body muted>Revient après un repos</Body>
            <Button small kind={draft.reset === 'court' ? 'primary' : 'default'} label="court" onPress={() => setDraft({ ...draft, reset: 'court' })} />
            <Button small kind={draft.reset === 'long' ? 'primary' : 'default'} label="long" onPress={() => setDraft({ ...draft, reset: 'long' })} />
          </Row>
          <Row>
            <Button kind="primary" label="Enregistrer" onPress={save} />
            <Button label="Annuler" onPress={() => setEditing(null)} />
            {editing < ch.resources.length && (
              <Button
                kind="danger"
                label="Supprimer"
                onPress={async () => {
                  await patch({ resources: ch.resources.filter((_, j) => j !== editing) });
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

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  pip: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 16 },
  res: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  count: { fontFamily: fonts.display, fontSize: 20, fontWeight: '700', minWidth: 44, textAlign: 'center' },
});
