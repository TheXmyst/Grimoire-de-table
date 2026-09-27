import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Button, Card, ErrorText, Field, Label, Pill, Row, Screen, Title } from '../../components/ui';
import { useUserId } from '../../lib/auth';
import {
  ABILITIES,
  CLASSES,
  SPELL_LEVEL_LABEL,
  maxSpellLevel,
  modifier,
  proficiencyBonus,
  signed,
  spellSlots,
  type AbilityKey,
} from '../../lib/rules';
import { errorText, supabase } from '../../lib/supabase';
import { fonts, useTheme } from '../../lib/theme';
import type { Campaign, Character, CharacterSpell, Member } from '../../lib/types';

export default function CharacterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const router = useRouter();
  const me = useUserId();
  const [ch, setCh] = useState<Character | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [spells, setSpells] = useState<CharacterSpell[]>([]);
  const [draft, setDraft] = useState<Partial<Character>>({});
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState('5');
  const [error, setError] = useState('');

  const loadSpells = useCallback(async () => {
    const { data, error } = await supabase.from('character_spells').select('*, spells(*)').eq('character_id', id);
    if (error) setError(errorText(error));
    else setSpells((data as CharacterSpell[]).sort((a, b) => a.spells.level - b.spells.level || a.spells.name.localeCompare(b.spells.name)));
  }, [id]);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('characters').select('*').eq('id', id).single();
    if (error) return setError(errorText(error));
    const c = data as Character;
    setCh(c);
    const [camp, mem] = await Promise.all([
      supabase.from('campaigns').select('*').eq('id', c.campaign_id).single(),
      supabase.from('campaign_members').select('*, profiles(display_name)').eq('campaign_id', c.campaign_id),
    ]);
    if (camp.data) setCampaign(camp.data as Campaign);
    if (mem.data) setMembers(mem.data as Member[]);
    loadSpells();
  }, [id, loadSpells]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Mise à jour en direct quand le MJ (ou le joueur sur un autre appareil) modifie la fiche
  useEffect(() => {
    const channel = supabase
      .channel(`character-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'characters', filter: `id=eq.${id}` }, (payload) =>
        setCh(payload.new as Character),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'character_spells', filter: `character_id=eq.${id}` }, () =>
        loadSpells(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, loadSpells]);

  if (!ch || !campaign) return <Screen><ErrorText>{error}</ErrorText></Screen>;

  const isGm = campaign.gm_id === me;
  const isOwner = ch.player_id === me;
  const canHp = isGm || (isOwner && campaign.settings.players_edit_hp);
  const canInventory = isGm || (isOwner && campaign.settings.players_edit_inventory);
  const pb = proficiencyBonus(ch.level);
  const slots = spellSlots(ch.class, ch.level);
  const maxLvl = maxSpellLevel(ch.class, ch.level);
  const hpPct = ch.hp_max > 0 ? Math.max(0, Math.min(1, ch.hp / ch.hp_max)) : 0;

  async function patch(values: Partial<Character>) {
    if (!ch) return;
    setError('');
    const previous = ch;
    setCh({ ...ch, ...values });
    const { error } = await supabase.from('characters').update(values).eq('id', ch.id);
    if (error) {
      setError(errorText(error));
      setCh(previous);
    }
  }

  function changeHp(sign: 1 | -1) {
    if (!ch) return;
    const n = Math.abs(parseInt(amount, 10) || 0);
    if (sign < 0) {
      // Les dégâts entament d'abord les PV temporaires
      const fromTemp = Math.min(ch.temp_hp, n);
      patch({ temp_hp: ch.temp_hp - fromTemp, hp: Math.max(0, ch.hp - (n - fromTemp)) });
    } else {
      patch({ hp: Math.min(ch.hp_max, ch.hp + n) });
    }
  }

  function toggleSlot(level: number, index: number) {
    if (!ch) return;
    const used = ch.slots_used[level] ?? 0;
    patch({ slots_used: { ...ch.slots_used, [level]: index < used ? index : index + 1 } });
  }

  async function saveEdits() {
    await patch(draft);
    setDraft({});
    setEditing(false);
  }

  async function setSpellStatus(spellId: string, status: 'approved') {
    const { error } = await supabase.from('character_spells').update({ status }).eq('character_id', id).eq('spell_id', spellId);
    if (error) setError(errorText(error));
    loadSpells();
  }

  async function removeSpell(spellId: string) {
    const { error } = await supabase.from('character_spells').delete().eq('character_id', id).eq('spell_id', spellId);
    if (error) setError(errorText(error));
    loadSpells();
  }

  const d = { ...ch, ...draft };
  const players = members.filter((m) => m.role === 'player');

  return (
    <Screen>
      <Stack.Screen options={{ title: ch.name }} />

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flexShrink: 1 }}>
            <Text style={[styles.name, { color: t.ink }]}>{ch.name}</Text>
            <Body muted>
              {ch.race} · {ch.class} niveau {ch.level}
            </Body>
          </View>
          {isGm && !editing && <Button small label="Modifier la fiche" onPress={() => setEditing(true)} />}
        </Row>

        <View style={styles.bigRow}>
          <Stat label="CA" value={String(ch.ac)} />
          <Stat label="Initiative" value={signed(modifier(ch.abilities.DEX))} />
          <Stat label="Vitesse" value={`${ch.speed} m`} />
          <Stat label="Maîtrise" value={signed(pb)} />
        </View>

        <Label>Points de vie</Label>
        <Row>
          <Text style={[styles.big, { color: t.ink }]}>{ch.hp}</Text>
          <Body muted>/ {ch.hp_max}</Body>
          {ch.temp_hp > 0 && <Pill text={`+${ch.temp_hp} temp.`} tone="warn" />}
          <View style={{ flex: 1 }} />
          {canHp && (
            <>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="number-pad"
                accessibilityLabel="Montant"
                style={[styles.amount, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]}
              />
              <Button small kind="danger" label="Dégâts" onPress={() => changeHp(-1)} />
              <Button small label="Soins" onPress={() => changeHp(1)} />
            </>
          )}
        </Row>
        <View style={[styles.bar, { backgroundColor: t.sunk }]}>
          <View style={{ width: `${hpPct * 100}%`, height: '100%', backgroundColor: hpPct < 0.3 ? t.bad : t.good }} />
        </View>
      </Card>

      {editing && (
        <Card>
          <Title>Modifier (MJ)</Title>
          <Row>
            <Field label="Nom" value={d.name} onChangeText={(v) => setDraft({ ...draft, name: v })} />
            <Field label="Espèce" value={d.race} onChangeText={(v) => setDraft({ ...draft, race: v })} />
            <Field label="Historique" value={d.background} onChangeText={(v) => setDraft({ ...draft, background: v })} />
          </Row>
          <Label>Classe</Label>
          <Row>
            {CLASSES.map((c) => (
              <Button
                key={c.name}
                small
                label={c.name}
                kind={c.name === d.class ? 'primary' : 'default'}
                onPress={() => setDraft({ ...draft, class: c.name })}
              />
            ))}
          </Row>
          <Row>
            <NumField label="Niveau" value={d.level} onChange={(v) => setDraft({ ...draft, level: Math.min(20, Math.max(1, v)) })} />
            <NumField label="XP" value={d.xp} onChange={(v) => setDraft({ ...draft, xp: v })} />
            <NumField label="PV max" value={d.hp_max} onChange={(v) => setDraft({ ...draft, hp_max: v })} />
            <NumField label="PV temp." value={d.temp_hp} onChange={(v) => setDraft({ ...draft, temp_hp: v })} />
            <NumField label="CA" value={d.ac} onChange={(v) => setDraft({ ...draft, ac: v })} />
            <NumField label="Vitesse (m)" value={d.speed} onChange={(v) => setDraft({ ...draft, speed: v })} />
          </Row>
          <Row>
            {ABILITIES.map((a) => (
              <NumField
                key={a.key}
                label={a.key}
                value={d.abilities[a.key]}
                onChange={(v) => setDraft({ ...draft, abilities: { ...d.abilities, [a.key]: v } })}
              />
            ))}
          </Row>
          <Label>Joueur</Label>
          <Row>
            <Button small label="Personne" kind={d.player_id === null ? 'primary' : 'default'} onPress={() => setDraft({ ...draft, player_id: null })} />
            {players.map((p) => (
              <Button
                key={p.user_id}
                small
                label={p.profiles?.display_name ?? 'Joueur'}
                kind={d.player_id === p.user_id ? 'primary' : 'default'}
                onPress={() => setDraft({ ...draft, player_id: p.user_id })}
              />
            ))}
          </Row>
          <Row>
            <Button kind="primary" label="Enregistrer" onPress={saveEdits} />
            <Button label="Annuler" onPress={() => { setDraft({}); setEditing(false); }} />
            <Button kind="danger" label="Supprimer la fiche" onPress={async () => {
              const { error } = await supabase.from('characters').delete().eq('id', ch.id);
              if (error) setError(errorText(error)); else router.back();
            }} />
          </Row>
        </Card>
      )}

      <Card>
        <Title>Caractéristiques</Title>
        <View style={styles.abilities}>
          {ABILITIES.map((a) => (
            <View key={a.key} style={[styles.ability, { borderColor: t.line, backgroundColor: t.bg }]}>
              <Label>{a.label}</Label>
              <Text style={[styles.big, { color: t.ink }]}>{signed(modifier(ch.abilities[a.key as AbilityKey]))}</Text>
              <Body muted>{ch.abilities[a.key as AbilityKey]}</Body>
            </View>
          ))}
        </View>
      </Card>

      {maxLvl >= 0 && (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Title>Sorts</Title>
            {(isGm || isOwner) && (
              <Button small kind="primary" label="Choisir des sorts" onPress={() => router.push(`/spells/${ch.id}`)} />
            )}
          </Row>
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
                      onPress={() => toggleSlot(i + 1, j)}
                      style={[styles.pip, { borderColor: t.brass, backgroundColor: used ? 'transparent' : t.brass }]}
                    />
                  );
                })}
              </Row>
            ) : null,
          )}
          {spells.length === 0 && <Body muted>Aucun sort appris pour l'instant.</Body>}
          {spells.map((s) => (
            <View key={s.spell_id} style={[styles.spell, { borderColor: t.line }]}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flexShrink: 1 }}>
                  <Body style={{ fontWeight: '700' }}>{s.spells.name}</Body>
                  <Body muted style={{ fontSize: 14 }}>
                    {SPELL_LEVEL_LABEL(s.spells.level)} · {s.spells.casting_time} · {s.spells.range}
                    {s.spells.concentration ? ' · Concentration' : ''}
                  </Body>
                </View>
                <Row>
                  {s.status === 'pending' && <Pill text="En attente du MJ" tone="warn" />}
                  {isGm && s.status === 'pending' && <Button small kind="primary" label="Valider" onPress={() => setSpellStatus(s.spell_id, 'approved')} />}
                  {(isGm || (isOwner && s.status === 'pending')) && (
                    <Button small kind="danger" label="Retirer" onPress={() => removeSpell(s.spell_id)} />
                  )}
                </Row>
              </Row>
            </View>
          ))}
          {(isGm || isOwner) && slots.some((n) => n > 0) && (
            <Button small label="Repos long : récupérer les emplacements" onPress={() => patch(canHp ? { slots_used: {}, hp: ch.hp_max } : { slots_used: {} })} />
          )}
        </Card>
      )}

      <Card>
        <Title>Inventaire</Title>
        <TextArea value={ch.inventory} editable={canInventory} onSave={(v) => patch({ inventory: v })} />
      </Card>

      {(isGm || isOwner) && (
        <Card>
          <Title>Notes du personnage</Title>
          <TextArea value={ch.notes} editable onSave={(v) => patch({ notes: v })} />
        </Card>
      )}

      <ErrorText>{error}</ErrorText>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View style={[styles.stat, { borderColor: t.line, backgroundColor: t.bg }]}>
      <Label>{label}</Label>
      <Text style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: '700', color: t.ink }}>{value}</Text>
    </View>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexBasis: 90, flexGrow: 1 }}>
      <Field label={label} value={String(value)} keyboardType="number-pad" onChangeText={(v) => onChange(parseInt(v, 10) || 0)} />
    </View>
  );
}

/** Zone de texte enregistrée quand on quitte le champ, et resynchronisée si la fiche change ailleurs. */
function TextArea({ value, editable, onSave }: { value: string; editable: boolean; onSave: (v: string) => void }) {
  const t = useTheme();
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(value);
  }, [value, focused]);
  return (
    <TextInput
      multiline
      editable={editable}
      value={text}
      onChangeText={setText}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        if (text !== value) onSave(text);
      }}
      style={[styles.textarea, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]}
    />
  );
}

const styles = StyleSheet.create({
  name: { fontFamily: fonts.display, fontSize: 26, fontWeight: '700' },
  big: { fontFamily: fonts.display, fontSize: 28, fontWeight: '700' },
  bigRow: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center', gap: 2 },
  abilities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ability: { flexGrow: 1, flexBasis: 100, borderWidth: 1, borderRadius: 8, padding: 8, alignItems: 'center' },
  amount: { width: 60, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16, textAlign: 'center' },
  bar: { height: 8, borderRadius: 99, overflow: 'hidden' },
  pip: { width: 26, height: 26, borderRadius: 13, borderWidth: 2 },
  spell: { borderTopWidth: 1, paddingTop: 8 },
  textarea: { minHeight: 120, borderWidth: 1, borderRadius: 6, padding: 10, fontSize: 16, textAlignVertical: 'top' },
});
