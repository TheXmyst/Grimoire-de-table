import * as Clipboard from 'expo-clipboard';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Body, Button, Card, ErrorText, Field, Label, Pill, Row, Screen, Title, Toggle } from '../../components/ui';
import { useUserId } from '../../lib/auth';
import { importPregen } from '../../lib/importPregen';
import { CLASS_TEMPLATES } from '../../lib/classTemplates';
import { PREGENS, type Pregen } from '../../lib/pregens';
import { CLASSES, CLASS_SAVES } from '../../lib/rules';
import { errorText, supabase } from '../../lib/supabase';
import { fonts, useTheme } from '../../lib/theme';
import type { Campaign, CampaignSettings, Character, Member } from '../../lib/types';

export default function CampaignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const router = useRouter();
  const me = useUserId();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Nouvelle fiche
  const [name, setName] = useState('');
  const [cls, setCls] = useState('Guerrier');
  const [race, setRace] = useState('Humain');
  const [playerId, setPlayerId] = useState<string | null>(null);

  const isGm = campaign?.gm_id === me;

  const load = useCallback(async () => {
    const [c, m, ch] = await Promise.all([
      supabase.from('campaigns').select('*').eq('id', id).single(),
      supabase.from('campaign_members').select('*, profiles(display_name)').eq('campaign_id', id),
      supabase.from('characters').select('*').eq('campaign_id', id).order('name'),
    ]);
    const err = c.error || m.error || ch.error;
    if (err) setError(errorText(err));
    if (c.data) setCampaign(c.data as Campaign);
    if (m.data) setMembers(m.data as Member[]);
    if (ch.data) setCharacters(ch.data as Character[]);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function setSetting<K extends keyof CampaignSettings>(key: K, value: CampaignSettings[K]) {
    if (!campaign) return;
    const settings = { ...campaign.settings, [key]: value };
    setCampaign({ ...campaign, settings });
    const { error } = await supabase.from('campaigns').update({ settings }).eq('id', campaign.id);
    if (error) setError(errorText(error));
  }

  async function createCharacter() {
    setError('');
    const hitDie = CLASSES.find((c) => c.name === cls)?.hitDie ?? 8;
    const { data, error } = await supabase
      .from('characters')
      .insert({ campaign_id: id, name: name.trim(), class: cls, race: race.trim(), player_id: playerId, hp: hitDie, hp_max: hitDie, save_profs: CLASS_SAVES[cls] ?? [] })
      .select()
      .single();
    if (error) return setError(errorText(error));
    setName('');
    router.push(`/character/${data.id}`);
  }

  async function addPregen(p: Pregen, open = false) {
    setError('');
    setImporting(p.name);
    try {
      const characterId = await importPregen(id, p);
      await load();
      if (open) router.push(`/character/${characterId}`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setImporting(null);
    }
  }

  async function removeMember(userId: string) {
    const { error } = await supabase.from('campaign_members').delete().eq('campaign_id', id).eq('user_id', userId);
    if (error) setError(errorText(error));
    load();
  }

  async function copyCode() {
    if (!campaign) return;
    await Clipboard.setStringAsync(campaign.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!campaign) return <Screen><ErrorText>{error}</ErrorText></Screen>;

  const players = members.filter((m) => m.role === 'player');
  const nameOf = (uid: string | null) =>
    uid ? members.find((m) => m.user_id === uid)?.profiles?.display_name ?? 'Joueur parti' : 'Non attribuée';
  const visible = isGm ? characters : characters.filter((c) => c.player_id === me);

  return (
    <Screen>
      <Stack.Screen options={{ title: campaign.name }} />

      {isGm && (
        <Card>
          <Label>Code d'invitation à donner aux joueurs</Label>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 34, fontWeight: '700', letterSpacing: 4, color: t.accent }}>
              {campaign.invite_code}
            </Text>
            <Button small label={copied ? 'Copié' : 'Copier'} onPress={copyCode} />
          </Row>
        </Card>
      )}

      <Card>
        <Title>{isGm ? 'Fiches de la campagne' : 'Mes personnages'}</Title>
        {visible.length === 0 && (
          <Body muted>{isGm ? 'Aucune fiche. Crée la première ci-dessous.' : "Le MJ ne t'a pas encore attribué de fiche."}</Body>
        )}
        {visible.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => router.push(`/character/${c.id}`)}
            style={{ borderTopWidth: 1, borderColor: t.line, paddingTop: 10 }}
          >
            <Row style={{ justifyContent: 'space-between' }}>
              <Body style={{ fontWeight: '700', fontSize: 17 }}>{c.name}</Body>
              <Pill text={`Niv. ${c.level}`} tone="warn" />
            </Row>
            <Body muted>
              {c.class} · {c.race} · PV {c.hp}/{c.hp_max}
              {isGm ? ` · ${nameOf(c.player_id)}` : ''}
            </Body>
          </Pressable>
        ))}
      </Card>

      {isGm && (
        <Card>
          <Title>Nouvelle fiche</Title>
          <Row>
            <Field label="Nom du personnage" value={name} onChangeText={setName} placeholder="Elyndra Ventcourbe" />
            <Field label="Espèce" value={race} onChangeText={setRace} />
          </Row>
          <Label>Classe</Label>
          <Row>
            {CLASSES.map((c) => (
              <Button key={c.name} small label={c.name} kind={c.name === cls ? 'primary' : 'default'} onPress={() => setCls(c.name)} />
            ))}
          </Row>
          <Label>Attribuer à</Label>
          <Row>
            <Button small label="Personne" kind={playerId === null ? 'primary' : 'default'} onPress={() => setPlayerId(null)} />
            {players.map((p) => (
              <Button
                key={p.user_id}
                small
                label={p.profiles?.display_name ?? 'Joueur'}
                kind={playerId === p.user_id ? 'primary' : 'default'}
                onPress={() => setPlayerId(p.user_id)}
              />
            ))}
          </Row>
          <Button kind="primary" label="Créer la fiche" onPress={createCharacter} disabled={!name.trim()} />
        </Card>
      )}

      {isGm && (
        <Card>
          <Title>Personnages prétirés</Title>
          <Body muted>Des fiches de niveau 1 prêtes à jouer, sorts compris. Ajoute-les puis attribue-les à tes joueurs.</Body>
          {PREGENS.map((p) => {
            const already = characters.some((c) => c.name === p.name);
            return (
              <Row key={p.name} style={{ justifyContent: 'space-between', borderTopWidth: 1, borderColor: t.line, paddingTop: 8 }}>
                <View style={{ flexShrink: 1 }}>
                  <Body style={{ fontWeight: '700' }}>{p.name}</Body>
                  <Body muted style={{ fontSize: 14 }}>{p.race} · {p.class}</Body>
                </View>
                {already ? (
                  <Pill text="Ajouté" />
                ) : (
                  <Button small label={importing === p.name ? 'Ajout…' : 'Ajouter'} disabled={importing !== null} onPress={() => addPregen(p)} />
                )}
              </Row>
            );
          })}
        </Card>
      )}

      {isGm && (
        <Card>
          <Title>Modèles de classe</Title>
          <Body muted>
            Une fiche standard de niveau 1 pour chaque classe (humain, équipement de départ, sorts). Crée-la, puis renomme-la et
            ajuste-la dans le panneau MJ de la fiche.
          </Body>
          <Row style={{ flexWrap: 'wrap' }}>
            {CLASS_TEMPLATES.map((p) => (
              <Button
                key={p.name}
                small
                label={importing === p.name ? 'Création…' : p.class}
                disabled={importing !== null}
                onPress={() => addPregen(p, true)}
              />
            ))}
          </Row>
        </Card>
      )}

      <Card>
        <Title>Table</Title>
        {members.map((m) => (
          <Row key={m.user_id} style={{ justifyContent: 'space-between' }}>
            <Body>{m.profiles?.display_name ?? '…'}</Body>
            <Row>
              <Pill text={m.role === 'gm' ? 'MJ' : 'Joueur'} tone={m.role === 'gm' ? 'accent' : 'neutral'} />
              {isGm && m.role === 'player' && <Button small kind="danger" label="Retirer" onPress={() => removeMember(m.user_id)} />}
            </Row>
          </Row>
        ))}
        {players.length === 0 && isGm && <Body muted>Donne le code d'invitation à tes joueurs pour qu'ils rejoignent.</Body>}
      </Card>

      {isGm && (
        <Card>
          <Title>Réglages de la campagne</Title>
          <Toggle
            label="Les joueurs gèrent leurs points de vie"
            value={campaign.settings.players_edit_hp}
            onChange={(v) => setSetting('players_edit_hp', v)}
          />
          <Toggle
            label="Les joueurs gèrent leur inventaire"
            value={campaign.settings.players_edit_inventory}
            onChange={(v) => setSetting('players_edit_inventory', v)}
          />
          <Toggle
            label="Le MJ valide les sorts choisis"
            value={campaign.settings.spell_approval}
            onChange={(v) => setSetting('spell_approval', v)}
          />
          <Toggle
            label="Option : encombrement des armures (malus en Acrobaties, Athlétisme, initiative)"
            value={!!campaign.settings.armor_encumbrance}
            onChange={(v) => setSetting('armor_encumbrance', v)}
          />
        </Card>
      )}

      <ErrorText>{error}</ErrorText>
      {!isGm && <Button kind="danger" label="Quitter la campagne" onPress={() => removeMember(me).then(() => router.back())} />}
    </Screen>
  );
}
