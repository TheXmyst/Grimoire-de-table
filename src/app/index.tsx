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
      {campaigns.length === 0 && <Body muted>Aucune campagne pour l'instant. Crées-en une ou rejoins tes amis.</Body>}
      {campaigns.map((c) => (
        <Pressable key={c.id} onPress={() => router.push(`/campaign/${c.id}`)}>
          <Card>
            <Row style={{ justifyContent: 'space-between' }}>
              <Body style={{ fontSize: 18, fontWeight: '700' }}>{c.name}</Body>
              <Pill text={c.gm_id === me ? 'Maître du jeu' : 'Joueur'} tone={c.gm_id === me ? 'accent' : 'neutral'} />
            </Row>
          </Card>
        </Pressable>
      ))}

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
