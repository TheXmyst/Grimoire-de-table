import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Body, Button, Card, ErrorText, Field, Label, Pill, Row, Screen, Title, Toggle } from '../../components/ui';
import { useUserId } from '../../lib/auth';
import { SPELL_LEVEL_LABEL, hasCantrips, maxSpellLevel } from '../../lib/rules';
import { errorText, supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/theme';
import type { Campaign, Character, Spell } from '../../lib/types';

export default function SpellPicker() {
  const { characterId } = useLocalSearchParams<{ characterId: string }>();
  const t = useTheme();
  const me = useUserId();
  const [ch, setCh] = useState<Character | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState('');

  // Sort maison (MJ)
  const [hbName, setHbName] = useState('');
  const [hbLevel, setHbLevel] = useState('1');
  const [hbDesc, setHbDesc] = useState('');

  const load = useCallback(async () => {
    const { data: c, error } = await supabase.from('characters').select('*').eq('id', characterId).single();
    if (error) return setError(errorText(error));
    setCh(c as Character);
    const [camp, sp, cs] = await Promise.all([
      supabase.from('campaigns').select('*').eq('id', c.campaign_id).single(),
      supabase.from('spells').select('*').or(`campaign_id.is.null,campaign_id.eq.${c.campaign_id}`).order('level').order('name'),
      supabase.from('character_spells').select('spell_id').eq('character_id', characterId),
    ]);
    if (camp.data) setCampaign(camp.data as Campaign);
    if (sp.data) setSpells(sp.data as Spell[]);
    if (cs.data) setKnown(new Set(cs.data.map((r) => r.spell_id as string)));
  }, [characterId]);

  useEffect(() => {
    load();
  }, [load]);

  const isGm = campaign?.gm_id === me;
  const maxLvl = ch ? maxSpellLevel(ch.class, ch.level) : -1;

  const available = useMemo(() => {
    if (!ch) return [];
    const q = query.trim().toLowerCase();
    return spells.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (showAll && isGm) return true;
      // Les sorts maison sans classe sont ouverts à tous ; sinon la classe doit correspondre
      const classOk = s.classes.length === 0 || s.classes.includes(ch.class);
      const levelOk = s.level <= maxLvl && (s.level > 0 || hasCantrips(ch.class));
      return classOk && levelOk;
    });
  }, [spells, ch, query, maxLvl, showAll, isGm]);

  async function learn(spellId: string) {
    setError('');
    const { error } = await supabase.from('character_spells').insert({ character_id: characterId, spell_id: spellId });
    if (error) return setError(errorText(error));
    setKnown(new Set([...known, spellId]));
  }

  async function addHomebrew() {
    if (!campaign) return;
    const { error } = await supabase.from('spells').insert({
      campaign_id: campaign.id,
      name: hbName.trim(),
      level: Math.min(9, Math.max(0, parseInt(hbLevel, 10) || 0)),
      description: hbDesc.trim(),
      classes: ch ? [ch.class] : [],
    });
    if (error) return setError(errorText(error));
    setHbName('');
    setHbDesc('');
    load();
  }

  if (!ch || !campaign) return <Screen><ErrorText>{error}</ErrorText></Screen>;

  const levels = [...new Set(available.map((s) => s.level))];

  return (
    <Screen>
      <Card>
        <Body>
          {ch.name}, {ch.class} niveau {ch.level} :{' '}
          {maxLvl < 0 ? "pas encore de sorts à ce niveau." : `sorts jusqu'au ${SPELL_LEVEL_LABEL(maxLvl).toLowerCase()}.`}
        </Body>
        {campaign.settings.spell_approval && !isGm && <Body muted>Tes choix seront validés par le MJ.</Body>}
        <Field label="Rechercher" value={query} onChangeText={setQuery} placeholder="Boule de feu" />
        {isGm && <Toggle label="Montrer tous les sorts (hors classe et niveau)" value={showAll} onChange={setShowAll} />}
      </Card>

      {levels.map((lvl) => (
        <Card key={lvl}>
          <Title>{SPELL_LEVEL_LABEL(lvl)}</Title>
          {available
            .filter((s) => s.level === lvl)
            .map((s) => (
              <View key={s.id} style={{ borderTopWidth: 1, borderColor: t.line, paddingTop: 8, gap: 6 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Pressable style={{ flexShrink: 1 }} onPress={() => setOpen(open === s.id ? null : s.id)}>
                    <Body style={{ fontWeight: '700' }}>{s.name}</Body>
                    <Body muted style={{ fontSize: 14 }}>
                      {[s.school, s.casting_time, s.range].filter(Boolean).join(' · ')}
                    </Body>
                  </Pressable>
                  <Row>
                    {s.campaign_id && <Pill text="Maison" tone="accent" />}
                    {known.has(s.id) ? <Pill text="Appris" /> : <Button small kind="primary" label="Apprendre" onPress={() => learn(s.id)} />}
                  </Row>
                </Row>
                {open === s.id && (
                  <View style={{ gap: 4 }}>
                    <Body muted style={{ fontSize: 14 }}>
                      Composantes : {s.components || '—'} · Durée : {s.duration || '—'}
                      {s.concentration ? ' · Concentration' : ''}
                      {s.ritual ? ' · Rituel' : ''}
                    </Body>
                    <Body>{s.description}</Body>
                  </View>
                )}
              </View>
            ))}
        </Card>
      ))}

      {available.length === 0 && (
        <Card>
          <Body muted>
            Aucun sort disponible. {spells.length === 0 ? "La liste de sorts n'est pas encore chargée sur le serveur." : ''}
          </Body>
        </Card>
      )}

      {isGm && (
        <Card>
          <Title>Créer un sort maison</Title>
          <Row>
            <Field label="Nom" value={hbName} onChangeText={setHbName} />
            <View style={{ flexBasis: 90 }}>
              <Field label="Niveau (0-9)" value={hbLevel} onChangeText={setHbLevel} keyboardType="number-pad" />
            </View>
          </Row>
          <Field label="Description" value={hbDesc} onChangeText={setHbDesc} multiline style={{ minHeight: 90, textAlignVertical: 'top' }} />
          <Label>Réservé à la classe {ch.class} dans cette campagne</Label>
          <Button kind="primary" label="Créer le sort" onPress={addHomebrew} disabled={!hbName.trim()} />
        </Card>
      )}

      <ErrorText>{error}</ErrorText>
    </Screen>
  );
}
