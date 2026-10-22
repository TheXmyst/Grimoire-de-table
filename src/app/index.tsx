import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import { Body, Button, Card, ErrorText, Field, Pill, Row, Screen, Title } from '../components/ui';
import { useUserId } from '../lib/auth';
import { errorText, supabase } from '../lib/supabase';
import { useTheme } from '../lib/theme';
import type { Campaign } from '../lib/types';

export default function Campaigns() {
  const t = useTheme();
  const router = useRouter();
  const me = useUserId();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newName, setNewName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);
  const [showClosed, setShowClosed] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('campaigns').select('*').order('created_at');
    if (error) setError(errorText(error));
    else setCampaigns(data as Campaign[]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function create() {
    setError('');
    const { data, error } = await supabase
      .from('campaigns')
      .insert({ name: newName.trim(), gm_id: me })
      .select()
      .single();
    if (error) return setError(errorText(error));
    setNewName('');
    router.push(`/campaign/${data.id}`);
  }

  /** Clôturer ou rouvrir : un simple drapeau dans les réglages, les fiches restent intactes. */
  async function setClosed(c: Campaign, closed: boolean) {
    setError('');
    setConfirming(null);
    const settings = { ...c.settings, closed };
    setCampaigns((list) => list.map((x) => (x.id === c.id ? { ...x, settings } : x)));
    const { error } = await supabase.from('campaigns').update({ settings }).eq('id', c.id);
    if (error) {
      setError(errorText(error));
      load();
    }
  }

  const open = campaigns.filter((c) => !c.settings?.closed);
  const closed = campaigns.filter((c) => c.settings?.closed);

  const CampaignCard = ({ c }: { c: Campaign }) => {
    const gm = c.gm_id === me;
    const isClosed = !!c.settings?.closed;
    return (
      <Card>
        <Pressable onPress={() => router.push(`/campaign/${c.id}`)}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Body style={{ fontSize: 18, fontWeight: '700', color: isClosed ? t.muted : t.ink, flexShrink: 1 }}>{c.name}</Body>
            <Pill text={gm ? 'Maître du jeu' : 'Joueur'} tone={gm ? 'accent' : 'neutral'} />
          </Row>
        </Pressable>
        {gm &&
          (isClosed ? (
            <Row>
              <Button small label="Rouvrir la campagne" onPress={() => setClosed(c, false)} />
            </Row>
          ) : confirming === c.id ? (
            <>
              <Body muted style={{ fontSize: 14 }}>
                La campagne sera rangée dans « Campagnes clôturées ». Les fiches ne sont pas effacées, et tu pourras la rouvrir.
              </Body>
              <Row>
                <Button small kind="danger" label="Oui, clôturer" onPress={() => setClosed(c, true)} />
                <Button small label="Annuler" onPress={() => setConfirming(null)} />
              </Row>
            </>
          ) : (
            <Row>
              <Button small label="Clôturer" onPress={() => setConfirming(c.id)} />
            </Row>
          ))}
      </Card>
    );
  };

  async function join() {
    setError('');
    const { data, error } = await supabase.rpc('join_campaign', { code });
    if (error) return setError(errorText(error));
    setCode('');
    router.push(`/campaign/${data}`);
  }

  return (
    <Screen>
      <Title>Mes campagnes</Title>
      {open.length === 0 && <Body muted>Aucune campagne en cours. Crées-en une ou rejoins tes amis.</Body>}
      {open.map((c) => (
        <CampaignCard key={c.id} c={c} />
      ))}

      {closed.length > 0 && (
        <>
          <Pressable onPress={() => setShowClosed(!showClosed)}>
            <Body muted style={{ fontWeight: '700' }}>
              {showClosed ? '▾' : '▸'} Campagnes clôturées ({closed.length})
            </Body>
          </Pressable>
          {showClosed && closed.map((c) => <CampaignCard key={c.id} c={c} />)}
        </>
      )}

      <Card>
        <Title>Rejoindre une campagne</Title>
        <Row>
          <Field label="Code d'invitation" value={code} onChangeText={setCode} autoCapitalize="characters" placeholder="ABC123" />
          <Button label="Rejoindre" onPress={join} disabled={code.trim().length < 4} />
        </Row>
      </Card>

      <Card>
        <Title>Créer une campagne (MJ)</Title>
        <Row>
          <Field label="Nom" value={newName} onChangeText={setNewName} placeholder="La Mine perdue de Phancreux" />
          <Button kind="primary" label="Créer" onPress={create} disabled={!newName.trim()} />
        </Row>
      </Card>

      <ErrorText>{error}</ErrorText>
      <Button label="Se déconnecter" onPress={() => supabase.auth.signOut()} />
      <Body muted style={{ fontSize: 12, color: t.muted }}>Règles D&D 5e (2014)</Body>
    </Screen>
  );
}
