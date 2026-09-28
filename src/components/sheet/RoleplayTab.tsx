import type { Character } from '../../lib/types';
import { Body, Card, Title } from '../ui';
import { Collapsible, TextArea, type SheetProps } from './common';

const FIELDS: { key: keyof Pick<Character, 'backstory' | 'traits' | 'ideals' | 'bonds' | 'flaws'>; label: string; placeholder: string }[] = [
  { key: 'backstory', label: 'Histoire du personnage', placeholder: "D'où vient-il, qu'a-t-il vécu avant l'aventure ?" },
  { key: 'traits', label: 'Traits de personnalité', placeholder: 'Je cite des proverbes à tout propos…' },
  { key: 'ideals', label: 'Idéaux', placeholder: 'Liberté. Personne ne devrait être enchaîné.' },
  { key: 'bonds', label: 'Liens', placeholder: 'Je protège le village où j’ai grandi.' },
  { key: 'flaws', label: 'Défauts', placeholder: 'Je ne résiste jamais à un pari.' },
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

      {editable && (
        <Card>
          <Title>Notes</Title>
          <TextArea value={ch.notes} editable onSave={(v) => patch({ notes: v })} placeholder="Indices, PNJ rencontrés, quêtes en cours…" minHeight={160} />
        </Card>
      )}
    </>
  );
}
