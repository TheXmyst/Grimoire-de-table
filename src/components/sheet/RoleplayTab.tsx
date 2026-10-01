import type { Character, DetailKey } from '../../lib/types';
import { View } from 'react-native';
import { Body, Card, Label, Title } from '../ui';
import { Collapsible, TextArea, type SheetProps } from './common';

const FIELDS: { key: keyof Pick<Character, 'backstory' | 'traits' | 'ideals' | 'bonds' | 'flaws'>; label: string; placeholder: string }[] = [
  { key: 'backstory', label: 'Histoire du personnage', placeholder: "D'où vient-il, qu'a-t-il vécu avant l'aventure ?" },
  { key: 'traits', label: 'Traits de personnalité', placeholder: 'Je cite des proverbes à tout propos…' },
  { key: 'ideals', label: 'Idéaux', placeholder: 'Liberté. Personne ne devrait être enchaîné.' },
  { key: 'bonds', label: 'Liens', placeholder: 'Je protège le village où j’ai grandi.' },
  { key: 'flaws', label: 'Défauts', placeholder: 'Je ne résiste jamais à un pari.' },
];

const LOOKS: { key: DetailKey; label: string; placeholder: string }[] = [
  { key: 'age', label: 'Âge', placeholder: '27 ans' },
  { key: 'height', label: 'Taille', placeholder: '1,75 m' },
  { key: 'weight', label: 'Poids', placeholder: '70 kg' },
  { key: 'eyes', label: 'Yeux', placeholder: 'Verts' },
  { key: 'skin', label: 'Peau', placeholder: 'Hâlée' },
  { key: 'hair', label: 'Cheveux', placeholder: 'Bruns, tressés' },
];

export function RoleplayTab({ ch, isGm, isOwner, patch }: SheetProps) {
  const editable = isGm || isOwner;
  return (
    <>
      {(ch.play_guide || isGm) && (
        <Card>
          <Title>Ton tour, pas à pas</Title>
          <TextArea
            value={ch.play_guide}
            editable={isGm}
            minHeight={isGm ? 120 : 40}
            placeholder={"1. Bouge jusqu'à ta vitesse.\n2. Action : attaque ou lance un sort.\n3. Action bonus si une capacité le permet.\nAstuce : …"}
            onSave={(v) => patch({ play_guide: v })}
          />
        </Card>
      )}

      <Card>
        <Title>Rôleplay</Title>
        {ch.background ? <Body muted>Historique : {ch.background}</Body> : null}
        {FIELDS.map((f) => (
          <Collapsible key={f.key} title={f.label} preview={ch[f.key] || (editable ? 'À compléter' : '')}>
            <TextArea value={ch[f.key]} editable={editable} placeholder={f.placeholder} onSave={(v) => patch({ [f.key]: v })} minHeight={90} />
          </Collapsible>
        ))}
      </Card>

      <Card>
        <Title>Apparence</Title>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {LOOKS.map((f) => (
            <View key={f.key} style={{ flexGrow: 1, flexBasis: 140, gap: 4 }}>
              <Label>{f.label}</Label>
              <TextArea value={ch.details[f.key] ?? ''} editable={editable} minHeight={40} placeholder={f.placeholder} onSave={(v) => patch({ details: { ...ch.details, [f.key]: v } })} />
            </View>
          ))}
        </View>
        <Label>Description</Label>
        <TextArea
          value={ch.details.appearance ?? ''}
          editable={editable}
          minHeight={80}
          placeholder="Cicatrice sur la joue, toujours une plume au chapeau…"
          onSave={(v) => patch({ details: { ...ch.details, appearance: v } })}
        />
      </Card>

      <Card>
        <Title>Alliés et organisations</Title>
        <TextArea
          value={ch.details.allies ?? ''}
          editable={editable}
          minHeight={80}
          placeholder="La guilde des marchands de Phandaline, sœur Garaele…"
          onSave={(v) => patch({ details: { ...ch.details, allies: v } })}
        />
      </Card>

      <Card>
        <Title>Trésor</Title>
        <TextArea
          value={ch.details.treasure ?? ''}
          editable={editable}
          minHeight={60}
          placeholder="Gemmes, titres de propriété, objets de valeur…"
          onSave={(v) => patch({ details: { ...ch.details, treasure: v } })}
        />
      </Card>

      {editable && (
        <Card>
          <Title>Notes</Title>
          <TextArea value={ch.notes} editable onSave={(v) => patch({ notes: v })} placeholder="Indices, PNJ rencontrés, quêtes en cours…" minHeight={160} />
        </Card>
      )}
    </>
  );
}
