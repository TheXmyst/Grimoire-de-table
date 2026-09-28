import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PROFICIENCY_KINDS, type Feature } from '../../lib/rules';
import { useTheme } from '../../lib/theme';
import { Body, Button, Card, Field, Label, Row, Title } from '../ui';
import { TextArea, type SheetProps } from './common';

const EMPTY: Feature = { name: '', source: '', description: '' };

export function FeaturesTab({ ch, isGm, patch }: SheetProps) {
  const t = useTheme();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Feature>(EMPTY);

  function startEdit(index: number | 'new') {
    setDraft(index === 'new' ? EMPTY : ch.features[index]);
    setEditing(index === 'new' ? ch.features.length : index);
  }

  async function save() {
    if (editing === null) return;
    const features = [...ch.features];
    features[editing] = { ...draft, name: draft.name.trim() || 'Capacité' };
    await patch({ features });
    setEditing(null);
  }

  async function remove() {
    if (editing === null) return;
    await patch({ features: ch.features.filter((_, i) => i !== editing) });
    setEditing(null);
  }

  // Les capacités sont regroupées par origine : classe, race, historique…
  const sources = [...new Set(ch.features.map((f) => f.source || 'Autre'))];

  return (
    <>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Title>Capacités</Title>
          {isGm && editing === null && <Button small label="Ajouter" onPress={() => startEdit('new')} />}
        </Row>
        {ch.features.length === 0 && editing === null && (
          <Body muted>Aucune capacité. Le MJ peut ajouter celles de la race, de la classe et de l'historique.</Body>
        )}
        {sources.map((src) => (
          <View key={src} style={{ gap: 6 }}>
            <Text style={[styles.source, { color: t.brass }]}>{src}</Text>
            {ch.features.map((f, i) =>
              (f.source || 'Autre') === src ? (
                <View key={i} style={[styles.feature, { borderColor: t.line }]}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16, flexShrink: 1 }}>{f.name}</Text>
                    {isGm && editing === null && <Button small label="Modifier" onPress={() => startEdit(i)} />}
                  </Row>
                  {f.description ? <Body>{f.description}</Body> : null}
                </View>
              ) : null,
            )}
          </View>
        ))}

        {editing !== null && (
          <View style={{ gap: 10, borderTopWidth: 1, borderColor: t.line, paddingTop: 12 }}>
            <Row>
              <Field label="Nom" value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} placeholder="Second souffle" />
              <Field label="Origine" value={draft.source} onChangeText={(v) => setDraft({ ...draft, source: v })} placeholder="Guerrier, Naine, Acolyte…" />
            </Row>
            <Field
              label="Description"
              value={draft.description}
              onChangeText={(v) => setDraft({ ...draft, description: v })}
              multiline
              style={{ minHeight: 90, textAlignVertical: 'top' }}
            />
            <Row>
              <Button kind="primary" label="Enregistrer" onPress={save} />
              <Button label="Annuler" onPress={() => setEditing(null)} />
              {editing < ch.features.length && <Button kind="danger" label="Supprimer" onPress={remove} />}
            </Row>
          </View>
        )}
      </Card>

      <Card>
        <Title>Maîtrises et langues</Title>
        {PROFICIENCY_KINDS.map((k) => (
          <View key={k.key} style={{ gap: 4 }}>
            <Label>{k.label}</Label>
            {isGm ? (
              <TextArea
                value={ch.proficiencies[k.key] ?? ''}
                editable
                minHeight={44}
                onSave={(v) => patch({ proficiencies: { ...ch.proficiencies, [k.key]: v } })}
              />
            ) : (
              <Body>{ch.proficiencies[k.key] || '—'}</Body>
            )}
          </View>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  source: { fontWeight: '700', letterSpacing: 1, fontSize: 12, textTransform: 'uppercase', marginTop: 4 },
  feature: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, gap: 4 },
});
