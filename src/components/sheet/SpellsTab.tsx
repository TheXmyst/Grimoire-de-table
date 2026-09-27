import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SPELL_LEVEL_LABEL, maxSpellLevel, spellSlots } from '../../lib/rules';
import { errorText, supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/theme';
import type { CharacterSpell } from '../../lib/types';
import { Body, Button, Card, ErrorText, Pill, Row, Title } from '../ui';
import type { SheetProps } from './common';

export function SpellSlots({ ch, isGm, isOwner, canHp, patch }: SheetProps) {
  const t = useTheme();
  const slots = spellSlots(ch.class, ch.level);
  if (!slots.some((n) => n > 0)) return null;

  function toggle(level: number, index: number) {
    const used = ch.slots_used[level] ?? 0;
    patch({ slots_used: { ...ch.slots_used, [level]: index < used ? index : index + 1 } });
  }

  return (
    <Card>
      <Title>Emplacements de sorts</Title>
      {slots.map((count, i) =>
        count > 0 ? (
          <Row key={i}>
            <Body muted style={{ width: 80 }}>{SPELL_LEVEL_LABEL(i + 1)}</Body>
            {Array.from({ length: count }, (_, j) => {
              const used = j < (ch.slots_used[i + 1] ?? 0);
              return (
                <Pressable
                  key={j}
                  accessibilityLabel={`Emplacement ${j + 1} ${used ? 'utilisé' : 'disponible'}`}
                  disabled={!isGm && !isOwner}
                  onPress={() => toggle(i + 1, j)}
                  style={[styles.pip, { borderColor: t.brass, backgroundColor: used ? 'transparent' : t.brass }]}
                />
              );
            })}
          </Row>
        ) : null,
      )}
      {(isGm || isOwner) && (
        <Row>
          <Button small label="Repos long" onPress={() => patch(canHp ? { slots_used: {}, hp: ch.hp_max } : { slots_used: {} })} />
        </Row>
      )}
    </Card>
  );
}

function SpellRow({ s, isGm, isOwner, onChange }: { s: CharacterSpell; isGm: boolean; isOwner: boolean; onChange: () => void }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  async function approve() {
    const { error } = await supabase.from('character_spells').update({ status: 'approved' }).eq('character_id', s.character_id).eq('spell_id', s.spell_id);
    if (error) setError(errorText(error));
    onChange();
  }

  async function remove() {
    const { error } = await supabase.from('character_spells').delete().eq('character_id', s.character_id).eq('spell_id', s.spell_id);
    if (error) setError(errorText(error));
    onChange();
  }

  const sp = s.spells;
  return (
    <View style={[styles.spell, { borderColor: t.line }]}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Pressable style={{ flexShrink: 1, flexGrow: 1 }} onPress={() => setOpen(!open)} accessibilityRole="button">
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16 }}>{sp.name}</Text>
          <Text style={{ color: t.muted, fontSize: 14 }}>
            {[sp.casting_time, sp.range, sp.concentration ? 'Concentration' : '', sp.ritual ? 'Rituel' : ''].filter(Boolean).join(' · ')}
          </Text>
        </Pressable>
        <Row>
          {s.status === 'pending' && <Pill text="En attente du MJ" tone="warn" />}
          {isGm && s.status === 'pending' && <Button small kind="primary" label="Valider" onPress={approve} />}
          {(isGm || (isOwner && s.status === 'pending')) && <Button small kind="danger" label="Retirer" onPress={remove} />}
        </Row>
      </Row>
      {open && (
        <View style={{ gap: 4, paddingTop: 6 }}>
          <Text style={{ color: t.muted, fontSize: 14 }}>
            {sp.school} · Composantes : {sp.components || '—'} · Durée : {sp.duration || '—'}
          </Text>
          <Body>{sp.description}</Body>
        </View>
      )}
      <ErrorText>{error}</ErrorText>
    </View>
  );
}

export function SpellsTab(props: SheetProps) {
  const { ch, spells, isGm, isOwner, reloadSpells } = props;
  const router = useRouter();
  const maxLvl = maxSpellLevel(ch.class, ch.level);
  const cantrips = spells.filter((s) => s.spells.level === 0);
  const leveled = spells.filter((s) => s.spells.level > 0);
  const levels = [...new Set(leveled.map((s) => s.spells.level))].sort((a, b) => a - b);

  if (maxLvl < 0 && spells.length === 0) {
    return (
      <Card>
        <Body muted>
          {ch.class} niveau {ch.level} : pas de sorts pour l'instant.
        </Body>
      </Card>
    );
  }

  return (
    <>
      {(isGm || isOwner) && (
        <Button kind="primary" label="Choisir des sorts" onPress={() => router.push(`/spells/${ch.id}`)} />
      )}

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Title>Tours de magie</Title>
          <Pill text="Illimités" />
        </Row>
        {cantrips.length === 0 && <Body muted>Aucun tour de magie appris.</Body>}
        {cantrips.map((s) => (
          <SpellRow key={s.spell_id} s={s} isGm={isGm} isOwner={isOwner} onChange={reloadSpells} />
        ))}
      </Card>

      <SpellSlots {...props} />

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Title>Sorts à emplacements</Title>
          {maxLvl > 0 && <Pill text={`Jusqu'au niveau ${maxLvl}`} tone="accent" />}
        </Row>
        {leveled.length === 0 && <Body muted>Aucun sort appris.</Body>}
        {levels.map((lvl) => (
          <View key={lvl} style={{ gap: 2 }}>
            <LevelLabel lvl={lvl} />
            {leveled
              .filter((s) => s.spells.level === lvl)
              .map((s) => (
                <SpellRow key={s.spell_id} s={s} isGm={isGm} isOwner={isOwner} onChange={reloadSpells} />
              ))}
          </View>
        ))}
      </Card>
    </>
  );
}

function LevelLabel({ lvl }: { lvl: number }) {
  const t = useTheme();
  return (
    <Text style={{ color: t.brass, fontWeight: '700', letterSpacing: 1, fontSize: 12, textTransform: 'uppercase', marginTop: 6 }}>
      {SPELL_LEVEL_LABEL(lvl)}
    </Text>
  );
}

const styles = StyleSheet.create({
  pip: { width: 26, height: 26, borderRadius: 13, borderWidth: 2 },
  spell: { borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 8 },
});
