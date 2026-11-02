import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { Button, Card, ErrorText, Field, Loading, Screen } from '../components/ui';
import { useAuth } from '../lib/auth';
import { authErrorText } from '../lib/authErrors';
import { supabase } from '../lib/supabase';
import { fonts, useTheme } from '../lib/theme';

/** Le lien de l'e-mail arrive avec #access_token=…&refresh_token=…&type=recovery (ou #error_description=… s'il a expiré). */
function readLinkHash(): {
  access_token?: string;
  refresh_token?: string;
  error?: string;
} {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return {
    access_token: params.get('access_token') ?? undefined,
    refresh_token: params.get('refresh_token') ?? undefined,
    error: params.get('error_description') ?? undefined,
  };
}

export default function ResetPassword() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const link = readLinkHash();
    if (link.error) setError('Ce lien a expiré ou a déjà servi. Redemande un e-mail depuis « Mot de passe oublié ? ».');
    if (link.access_token && link.refresh_token) {
      supabase.auth
        .setSession({
          access_token: link.access_token,
          refresh_token: link.refresh_token,
        })
        .then(({ error }) => {
          if (error) setError('Ce lien a expiré ou a déjà servi. Redemande un e-mail depuis « Mot de passe oublié ? ».');
          // On retire les jetons de la barre d'adresse
          window.history.replaceState(null, '', window.location.pathname);
          setReady(true);
        });
    } else setReady(true);
  }, []);

  async function save() {
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(authErrorText(error));
    setDone(true);
  }

  if (!ready) return <Loading />;

  return (
    <Screen>
      <View style={{ paddingTop: 48, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 28,
            fontWeight: '700',
            color: t.ink,
          }}
        >
          Nouveau mot de passe
        </Text>
      </View>
      <Card style={{ maxWidth: 440, width: '100%', alignSelf: 'center' }}>
        {done ? (
          <>
            <Text style={{ color: t.good, fontSize: 16 }}>C'est fait ! Ton mot de passe est changé et tu es connecté.</Text>
            <Button kind="primary" label="Aller à mes campagnes" onPress={() => router.replace('/')} />
          </>
        ) : session ? (
          <>
            <View style={{ flexDirection: 'row' }}>
              <Field label="Nouveau mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Field label="Le même, encore une fois" value={confirm} onChangeText={setConfirm} secureTextEntry />
            </View>
            {password.length > 0 && password.length < 6 && <Text style={{ color: t.muted, fontSize: 13 }}>6 caractères minimum.</Text>}
            {confirm.length > 0 && confirm !== password && (
              <Text style={{ color: t.bad, fontSize: 13 }}>Les deux mots de passe sont différents.</Text>
            )}
            <ErrorText>{error}</ErrorText>
            <Button kind="primary" label="Enregistrer" onPress={save} disabled={busy || password.length < 6 || confirm !== password} />
          </>
        ) : (
          <>
            <ErrorText>
              {error || 'Ouvre cette page avec le lien reçu par e-mail après avoir cliqué sur « Mot de passe oublié ? ».'}
            </ErrorText>
            <Button label="Retour à la connexion" onPress={() => router.replace('/login')} />
          </>
        )}
      </Card>
    </Screen>
  );
}
