import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { XP_THRESHOLDS, levelUpSummary } from '../../lib/progression';
import { hitDieOf, modifier, proficiencyBonus, signed, spellSlots } from '../../lib/rules';
import { useTheme } from '../../lib/theme';
import type { Character } from '../../lib/types';
import { Body, Button, Label, Row } from '../ui';

type Props = { ch: Character; isGm: boolean; patch: (values: Partial<Character>) => Promise<void> };

/** Emplacements gagnés entre deux niveaux, en texte (« 1 emplacement de niveau 2 »). */
function newSlots(cls: string, from: number, to: number): string[] {
  const before = spellSlots(cls, from);
  const after = spellSlots(cls, to);
  return after
    .map((n, i) => ({ level: i + 1, gained: n - (before[i] ?? 0) }))
    .filter((s) => s.gained > 0)
    .map((s) => `+${s.gained} emplacement${s.gained > 1 ? 's' : ''} de niveau ${s.level}`);
}

/** Barre d'expérience et ce que le personnage gagne au niveau suivant. */
export function LevelPanel({ ch, isGm, patch }: Props) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [gain, setGain] = useState('100');
  const [busy, setBusy] = useState(false);

  const next = ch.level + 1;
  const maxed = ch.level >= 20;
  const floor = XP_THRESHOLDS[ch.level] ?? 0;
  const goal = XP_THRESHOLDS[next] ?? floor;
  const pct = maxed ? 1 : Math.max(0, Math.min(1, (ch.xp - floor) / Math.max(1, goal - floor)));
  const ready = !maxed && ch.xp >= goal;

  const conMod = modifier(ch.abilities.CON);
  const summary = maxed ? null : levelUpSummary(ch.class, next, conMod, hitDieOf(ch.class));
  const slots = maxed ? [] : newSlots(ch.class, ch.level, next);

  async function addXp() {
    const n = parseInt(gain, 10) || 0;
    if (n) await patch({ xp: Math.max(0, ch.xp + n) });
  }

  async function levelUp() {
    if (!summary) return;
    setBusy(true);
    const known = new Set(ch.features.map((f) => f.name));
    await patch({
      level: next,
      hp_max: ch.hp_max + summary.hpAverage,
      hp: ch.hp + summary.hpAverage,
      features: [...ch.features, ...summary.gain.features.filter((f) => !known.has(f.name))],
    });
    setBusy(false);
    setOpen(false);
  }

  return (
    <View style={{ gap: 6 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Label>Expérience · niveau {ch.level}</Label>
        <Body muted style={{ fontSize: 14 }}>
          {maxed ? `${ch.xp} XP · niveau maximum` : `${ch.xp} / ${goal} XP`}
        </Body>
      </Row>
      <View style={[styles.bar, { backgroundColor: t.sunk }]}>
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: ready ? t.brass : t.accent }} />
      </View>

      {isGm && (
        <Row>
          <TextInput
            value={gain}
            onChangeText={setGain}
            keyboardType="number-pad"
            accessibilityLabel="XP à donner"
            style={[styles.input, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]}
          />
          <Button small label="Donner l'XP" onPress={addXp} />
        </Row>
      )}

      {!maxed && (
        <View style={[styles.box, { borderColor: ready ? t.brass : t.line, backgroundColor: t.bg }]}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: ready ? t.brass : t.ink, fontWeight: '700', fontSize: 16, flexShrink: 1 }}>
              {ready ? `Niveau ${next} atteint !` : `Au niveau ${next}`}
            </Text>
            <Button small label={open ? 'Masquer' : 'Ce que je gagne'} onPress={() => setOpen(!open)} />
          </Row>
          {ready && !isGm && !open && <Body muted>Demande à ton MJ de valider ta montée de niveau.</Body>}

          {open && summary && (
            <View style={{ gap: 6 }}>
              <Gain title="Points de vie">
                +{summary.hpAverage} PV max (moyenne du d{hitDieOf(ch.class)} {signed(conMod)} de CON), ou lance le dé si ton MJ préfère. +1 dé de vie.
              </Gain>
              {summary.proficiencyChanged && (
                <Gain title="Bonus de maîtrise">
                  Passe à {signed(proficiencyBonus(next))} : attaques, compétences maîtrisées, sauvegardes et DD de sorts augmentent.
                </Gain>
              )}
              {summary.gain.features.map((f) => (
                <Gain key={f.name} title={f.name}>
                  {f.description}
                </Gain>
              ))}
              {summary.gain.subclass && <Gain title="Sous-classe">{summary.gain.subclass}</Gain>}
              {summary.gain.asi && (
                <Gain title="Amélioration de caractéristique">
                  +2 à une caractéristique, ou +1 à deux (maximum 20). Ou, si ton MJ autorise les dons, un don à la place.
                </Gain>
              )}
              {(slots.length > 0 || summary.gain.cantripsKnown || summary.gain.spellsKnown) && (
                <Gain title="Sorts">
                  {[
                    ...slots,
                    summary.gain.cantripsKnown ? `${summary.gain.cantripsKnown} sorts mineurs connus au total` : '',
                    summary.gain.spellsKnown ? `${summary.gain.spellsKnown} sorts connus au total` : '',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  . Choisis les nouveaux dans l'onglet Sorts.
                </Gain>
              )}
              {summary.gain.notes?.map((n) => (
                <Body key={n} muted>
                  • {n}
                </Body>
              ))}
              {isGm && (
                <Button
                  kind="primary"
                  label={busy ? 'Montée…' : `Passer au niveau ${next}`}
                  disabled={busy}
                  onPress={levelUp}
                />
              )}
              {isGm && (
                <Body muted style={{ fontSize: 13 }}>
                  Ajoute les PV moyens et les nouvelles capacités à la fiche. Les caractéristiques, la sous-classe et les sorts se règlent
                  ensuite à la main.
                </Body>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function Gain({ title, children }: { title: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ color: t.ink, fontWeight: '700', fontSize: 15 }}>{title}</Text>
      <Text style={{ color: t.ink, fontSize: 15 }}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  input: { width: 80, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16, textAlign: 'center' },
  box: { borderWidth: 1, borderRadius: 8, padding: 10, gap: 8 },
});
