import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Body, Button, Card, ErrorText, Field, Label, Loading, Pill, Row, Screen, Title, Toggle } from '../../components/ui';
import { useUserId } from '../../lib/auth';
import { SPELL_LEVEL_LABEL, hasCantrips, maxSpellLevel } from '../../lib/rules';
import { errorText, supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/theme';
import type { Campaign, Character, Spell } from '../../lib/types';

/** Sorts déjà téléchargés, par campagne, le temps que l'appli reste ouverte. */
const spellCache = new Map<string, Spell[]>();

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
  // Niveaux dépliés : on n'affiche pas des centaines de sorts d'un coup
  const [openLevels, setOpenLevels] = useState<Set<number> | null>(null);
  const [error, setError] = useState('');

  // Sort maison (MJ)
  const [hbName, setHbName] = useState('');
  const [hbLevel, setHbLevel] = useState('1');
  const [hbDesc, setHbDesc] = useState('');

  const load = useCallback(async () => {
    // La fiche (avec sa campagne) et les sorts déjà connus partent en même temps
    const [res, cs] = await Promise.all([
      supabase.from('characters').select('*, campaigns(*)').eq('id', characterId).single(),
      supabase.from('character_spells').select('spell_id').eq('character_id', characterId),
    ]);
    if (res.error) return setError(errorText(res.error));
    const { campaigns: camp, ...c } = res.data as Character & { campaigns: Campaign };
    setCh(c as Character);
    setCampaign(camp);
    if (cs.data) setKnown(new Set(cs.data.map((r) => r.spell_id as string)));
    // La liste des sorts (lourde) est gardée en mémoire : la 2e ouverture est immédiate
    const cached = spellCache.get(c.campaign_id);
    if (cached) setSpells(cached);
    const sp = await supabase.from('spells').select('*').or(`campaign_id.is.null,campaign_id.eq.${c.campaign_id}`).order('level').order('name');
    if (sp.data) {
      spellCache.set(c.campaign_id, sp.data as Spell[]);
      setSpells(sp.data as Spell[]);
    }
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

  if (!ch || !campaign) return error ? <Screen><ErrorText>{error}</ErrorText></Screen> : <Loading />;

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

      {levels.map((lvl) => {
        const count = available.filter((s) => s.level === lvl).length;
        // Par défaut : tout est déplié pour une recherche ou une petite liste, sinon le plus haut niveau seulement
        const expanded = openLevels ? openLevels.has(lvl) : query.trim() !== '' || available.length <= 40 || lvl === levels[levels.length - 1];
        const toggleLevel = () => {
          const base = openLevels ?? new Set(levels.filter((l) => l === levels[levels.length - 1] || available.length <= 40));
          const next = new Set(base);
          if (expanded) next.delete(lvl);
          else next.add(lvl);
          setOpenLevels(next);
        };
        return (
        <Card key={lvl}>
          <Pressable accessibilityRole="button" onPress={toggleLevel}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Title>{SPELL_LEVEL_LABEL(lvl)}</Title>
              <Body muted>
                {count} sort{count > 1 ? 's' : ''} {expanded ? '−' : '+'}
              </Body>
            </Row>
          </Pressable>
          {expanded && available
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
        );
      })}

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
