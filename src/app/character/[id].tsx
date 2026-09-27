import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AbilitiesTab, skillTotal } from '../../components/sheet/AbilitiesTab';
import { BagTab } from '../../components/sheet/BagTab';
import { CombatTab } from '../../components/sheet/CombatTab';
import { NumField, Stat, Tabs, type SheetProps } from '../../components/sheet/common';
import { RoleplayTab } from '../../components/sheet/RoleplayTab';
import { SpellsTab } from '../../components/sheet/SpellsTab';
import { Body, Button, Card, ErrorText, Field, Label, Pill, Row, Screen, Title } from '../../components/ui';
import { useUserId } from '../../lib/auth';
import { ABILITIES, CLASSES, CLASS_SAVES, SUBCLASS_LABEL, modifier, proficiencyBonus, signed } from '../../lib/rules';
import { errorText, supabase } from '../../lib/supabase';
import { fonts, useTheme } from '../../lib/theme';
import type { Campaign, Character, CharacterSpell, Member } from '../../lib/types';

// Valeurs par défaut si la base n'a pas encore les colonnes de la migration 0003
const withDefaults = (c: Character): Character => ({
  ...c,
  subclass: c.subclass ?? '',
  save_profs: c.save_profs ?? [],
  skill_profs: c.skill_profs ?? [],
  skill_expertise: c.skill_expertise ?? [],
  attacks: c.attacks ?? [],
  coins: { ...{ pc: 0, pa: 0, pe: 0, po: 0, pp: 0 }, ...((c.coins as Partial<Character['coins']> | null) ?? {}) },
  traits: c.traits ?? '',
  ideals: c.ideals ?? '',
  bonds: c.bonds ?? '',
  flaws: c.flaws ?? '',
  backstory: c.backstory ?? '',
});

type TabKey = 'combat' | 'caracs' | 'sorts' | 'sac' | 'perso';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'combat', label: 'Combat' },
  { key: 'caracs', label: 'Caracs' },
  { key: 'sorts', label: 'Sorts' },
  { key: 'sac', label: 'Sac' },
  { key: 'perso', label: 'Perso' },
];

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
  const [tab, setTab] = useState<TabKey>('combat');
  const [amount, setAmount] = useState('5');
  const [lastRoll, setLastRoll] = useState<{ label: string; total: number; detail: string } | null>(null);
  const [error, setError] = useState('');

  const loadSpells = useCallback(async () => {
    const { data, error } = await supabase.from('character_spells').select('*, spells(*)').eq('character_id', id);
    if (error) setError(errorText(error));
    else setSpells((data as CharacterSpell[]).sort((a, b) => a.spells.level - b.spells.level || a.spells.name.localeCompare(b.spells.name)));
  }, [id]);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('characters').select('*').eq('id', id).single();
    if (error) return setError(errorText(error));
    const c = withDefaults(data as Character);
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
        setCh(withDefaults(payload.new as Character)),
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
  const passivePerception = 10 + skillTotal(ch, 'perception');
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

  async function saveEdits() {
    await patch(draft);
    setDraft({});
    setEditing(false);
  }

  const d = { ...ch, ...draft };
  const players = members.filter((m) => m.role === 'player');
  const sheet: SheetProps = {
    ch,
    campaign,
    spells,
    isGm,
    isOwner,
    canHp,
    canInventory,
    patch,
    onRoll: (label, total, detail) => setLastRoll({ label, total, detail }),
    reloadSpells: loadSpells,
  };

  const rollBanner = lastRoll ? (
        <View style={[styles.roll, { borderColor: t.accent, backgroundColor: t.surface }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.ink, fontWeight: '700' }}>{lastRoll.label}</Text>
            <Text style={{ color: t.muted, fontSize: 13 }}>{lastRoll.detail}</Text>
          </View>
          <Text style={[styles.rollTotal, { color: t.accent }]}>{lastRoll.total}</Text>
          <Button small label="OK" onPress={() => setLastRoll(null)} />
        </View>
  ) : null;

  return (
    <Screen overlay={rollBanner}>
      <Stack.Screen options={{ title: ch.name }} />

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flexShrink: 1 }}>
            <Text style={[styles.name, { color: t.ink }]}>{ch.name}</Text>
            <Body muted>
              {ch.race} · {ch.class}
              {ch.subclass ? ` (${ch.subclass})` : ''} niveau {ch.level}
            </Body>
          </View>
          {isGm && !editing && <Button small label="Modifier la fiche" onPress={() => setEditing(true)} />}
        </Row>

        <View style={styles.stats}>
          <Stat label="CA" value={String(ch.ac)} />
          <Stat label="Initiative" value={signed(modifier(ch.abilities.DEX))} />
          <Stat label="Vitesse" value={`${ch.speed} m`} />
          <Stat label="Maîtrise" value={signed(pb)} />
          <Stat label="Perc. passive" value={String(passivePerception)} highlight />
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
            <Field label="Historique" value={d.background} onChangeText={(v) => setDraft({ ...draft, background: v })} placeholder="Acolyte" />
          </Row>
          <Label>Classe</Label>
          <Row>
            {CLASSES.map((c) => (
              <Button
                key={c.name}
                small
                label={c.name}
                kind={c.name === d.class ? 'primary' : 'default'}
                // Changer de classe applique ses sauvegardes maîtrisées par défaut
                onPress={() => setDraft({ ...draft, class: c.name, save_profs: CLASS_SAVES[c.name] ?? [] })}
              />
            ))}
          </Row>
          <Field
            label={SUBCLASS_LABEL[d.class] ?? 'Sous-classe'}
            value={d.subclass}
            onChangeText={(v) => setDraft({ ...draft, subclass: v })}
            placeholder={d.class === 'Clerc' ? 'Domaine de la Vie' : ''}
          />
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
          <Body muted style={{ fontSize: 13 }}>Les maîtrises de sauvegardes et de compétences se cochent dans l'onglet Caracs.</Body>
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
            <Button
              kind="danger"
              label="Supprimer la fiche"
              onPress={async () => {
                const { error } = await supabase.from('characters').delete().eq('id', ch.id);
                if (error) setError(errorText(error));
                else router.back();
              }}
            />
          </Row>
        </Card>
      )}

      <ErrorText>{error}</ErrorText>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === 'combat' && <CombatTab {...sheet} />}
      {tab === 'caracs' && <AbilitiesTab {...sheet} />}
      {tab === 'sorts' && <SpellsTab {...sheet} />}
      {tab === 'sac' && <BagTab {...sheet} />}
      {tab === 'perso' && <RoleplayTab {...sheet} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontFamily: fonts.display, fontSize: 26, fontWeight: '700' },
  big: { fontFamily: fonts.display, fontSize: 28, fontWeight: '700' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amount: { width: 60, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16, textAlign: 'center' },
  bar: { height: 8, borderRadius: 99, overflow: 'hidden' },
  roll: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 10, padding: 12, elevation: 6 },
  rollTotal: { fontFamily: fonts.display, fontSize: 32, fontWeight: '700' },
});
