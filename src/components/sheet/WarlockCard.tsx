import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spellSlots } from '../../lib/rules';
import { useTheme } from '../../lib/theme';
import {
  INVOCATIONS,
  PACTS,
  PATRONS,
  addPatronFeature,
  arcanumLevels,
  choosePact,
  choosePatron,
  invocationsKnown,
  invocationsOf,
  missingPrerequisite,
  pactOf,
  patronOf,
  toggleInvocation,
} from '../../lib/warlock';
import { Body, Button, Card, Label, Pill, Row, Title } from '../ui';
import type { SheetProps } from './common';

/** Tout ce qui est propre au sorcier : protecteur d'outre-monde, magie de pacte, pacte et invocations occultes. */
export function WarlockCard({ ch, isGm, patch }: SheetProps) {
  const t = useTheme();
  const [picking, setPicking] = useState<'patron' | 'pact' | 'invocations' | null>(null);
  const toggle = (p: typeof picking) => setPicking(picking === p ? null : p);

  const patron = patronOf(ch);
  const pact = pactOf(ch);
  const invocations = invocationsOf(ch);
  const maxInvocations = invocationsKnown(ch.level);
  const slots = spellSlots(ch.class, ch.level);
  const slotLevel = slots.length;
  const slotCount = slots[slotLevel - 1] ?? 0;
  const arcana = arcanumLevels(ch.level);
  const hasFeature = (name: string) => ch.features.some((f) => f.name === name);

  const Option = ({ name, text, current, onPick }: { name: string; text: string; current: boolean; onPick: () => void }) => (
    <View style={[styles.row, { borderColor: t.line }]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16 }}>{name}</Text>
        <Text style={{ color: t.muted, fontSize: 14 }}>{text}</Text>
      </View>
      {current ? <Pill text="Choisi" tone="accent" /> : <Button small label="Choisir" onPress={onPick} />}
    </View>
  );

  return (
    <Card>
      <Title>Pacte du sorcier</Title>
      <Body>
        <Text style={{ fontWeight: '700' }}>Magie de pacte : </Text>
        {slotCount} emplacement{slotCount > 1 ? 's' : ''} de niveau {slotLevel}. Tous tes sorts se lancent à ce niveau, et les emplacements
        reviennent après un repos court ou long.
      </Body>
      {arcana.length > 0 && (
        <Body>
          <Text style={{ fontWeight: '700' }}>Arcanum mystique : </Text>
          un sort de niveau {arcana.join(', ')}, chacun lançable une fois par repos long sans emplacement. Choisis-les dans le grimoire.
        </Body>
      )}

      {/* Protecteur d'outre-monde */}
      <Row style={{ justifyContent: 'space-between', marginTop: 6 }}>
        <Label>Protecteur d’outre-monde</Label>
        {isGm && patron && <Button small label={picking === 'patron' ? 'Fermer' : 'Changer'} onPress={() => toggle('patron')} />}
      </Row>
      {patron ? (
        <>
          <Body>
            <Text style={{ fontWeight: '700' }}>{patron.name}. </Text>
            {patron.summary}
          </Body>
          <Body muted style={{ fontSize: 14 }}>
            Sorts en plus dans ta liste :{' '}
            {patron.spells
              .slice(0, slotLevel)
              .map((names, i) => `niv. ${i + 1} ${names.join(', ')}`)
              .join(' · ')}
          </Body>
          {patron.features.map((g) => {
            const owned = hasFeature(g.name);
            const reached = ch.level >= g.level;
            return (
              <View key={g.name} style={[styles.row, { borderColor: t.line }]}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: reached ? t.ink : t.muted, fontWeight: '700', fontSize: 16 }}>
                    {g.name} <Text style={{ fontWeight: '400', fontSize: 13 }}>· niveau {g.level}</Text>
                  </Text>
                  {reached && <Text style={{ color: t.muted, fontSize: 14 }}>{g.description}</Text>}
                </View>
                {reached && !owned && (isGm ? <Button small kind="primary" label="Ajouter" onPress={() => patch(addPatronFeature(ch, patron, g))} /> : <Pill text="À ajouter" tone="warn" />)}
              </View>
            );
          })}
        </>
      ) : (
        <Body muted>{isGm ? 'Choisis avec ton joueur l’entité qui lui donne ses pouvoirs.' : 'Ton MJ choisira avec toi l’entité qui te donne tes pouvoirs.'}</Body>
      )}
      {isGm && (!patron || picking === 'patron') &&
        PATRONS.map((p) => (
          <Option
            key={p.name}
            name={p.name}
            text={`${p.summary} Aptitudes : ${p.features.map((g) => g.name).join(', ')}.`}
            current={patron?.name === p.name}
            onPick={() => {
              patch(choosePatron(ch, p));
              setPicking(null);
            }}
          />
        ))}

      {/* Pacte */}
      <Row style={{ justifyContent: 'space-between', marginTop: 6 }}>
        <Label>Pacte</Label>
        {isGm && pact && <Button small label={picking === 'pact' ? 'Fermer' : 'Changer'} onPress={() => toggle('pact')} />}
      </Row>
      {ch.level < 3 && !pact ? (
        <Body muted>Ton protecteur t’offrira un pacte au niveau 3 : la chaîne, la lame ou le grimoire.</Body>
      ) : pact ? (
        <Body>
          <Text style={{ fontWeight: '700' }}>{pact.name}. </Text>
          {pact.description}
        </Body>
      ) : (
        !isGm && <Body muted>Ton MJ choisira ton pacte avec toi.</Body>
      )}
      {isGm && (ch.level >= 3 || pact) && (!pact || picking === 'pact') &&
        PACTS.map((p) => (
          <Option
            key={p.name}
            name={p.name}
            text={p.description}
            current={pact?.name === p.name}
            onPick={() => {
              patch(choosePact(ch, p));
              setPicking(null);
            }}
          />
        ))}

      {/* Invocations occultes */}
      <Row style={{ justifyContent: 'space-between', marginTop: 6 }}>
        <Label>
          Invocations occultes {maxInvocations > 0 ? `${invocations.length}/${maxInvocations}` : ''}
        </Label>
        {isGm && maxInvocations > 0 && <Button small label={picking === 'invocations' ? 'Fermer' : 'Choisir'} onPress={() => toggle('invocations')} />}
      </Row>
      {maxInvocations === 0 ? (
        <Body muted>Tu en gagneras 2 au niveau 2 : de petits pouvoirs permanents.</Body>
      ) : invocations.length === 0 ? (
        <Body muted>{isGm ? `À choisir : ${maxInvocations}.` : 'Ton MJ choisira tes invocations avec toi.'}</Body>
      ) : (
        invocations.map((f) => (
          <Body key={f.name}>
            <Text style={{ fontWeight: '700' }}>{f.name} : </Text>
            {f.description}
          </Body>
        ))
      )}
      {invocations.length > maxInvocations && <Body style={{ color: t.bad, fontSize: 14 }}>Une de trop pour le niveau {ch.level}.</Body>}
      {isGm && picking === 'invocations' && (
        <View style={{ gap: 4 }}>
          {INVOCATIONS.map((inv) => {
            const owned = invocations.some((f) => f.name === inv.name);
            const missing = missingPrerequisite(inv, ch.level, pact);
            const prereq = [inv.level ? `niveau ${inv.level}` : '', inv.pact?.toLowerCase() ?? '', inv.blast ? 'sort mineur Décharge occulte' : ''].filter(Boolean).join(', ');
            return (
              <View key={inv.name} style={[styles.row, { borderColor: t.line }]}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: missing ? t.muted : t.ink, fontWeight: '700', fontSize: 16 }}>{inv.name}</Text>
                  {prereq ? <Text style={{ color: missing ? t.bad : t.muted, fontSize: 13 }}>Prérequis : {prereq}</Text> : null}
                  <Text style={{ color: t.muted, fontSize: 14 }}>{inv.description}</Text>
                </View>
                {owned ? (
                  <Button small label="Retirer" onPress={() => patch(toggleInvocation(ch, inv))} />
                ) : (
                  <Button small label="Prendre" disabled={!!missing || invocations.length >= maxInvocations} onPress={() => patch(toggleInvocation(ch, inv))} />
                )}
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
});
