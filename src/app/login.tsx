import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, ErrorText, Field, Screen } from '../components/ui';
import { errorText, supabase } from '../lib/supabase';
import { fonts, useTheme } from '../lib/theme';

export default function Login() {
  const t = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError('');
    setInfo('');
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() || undefined } },
        });
        if (error) throw error;
        if (!data.session) setInfo('Compte créé. Confirme ton adresse e-mail puis connecte-toi.');
      }
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={{ paddingTop: 48, gap: 6, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 32, fontWeight: '700', color: t.ink }}>
          Grimoire de Table
        </Text>
        <Text style={{ color: t.muted, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>
          D&D 5e · zéro papier
        </Text>
      </View>
      <Card style={{ maxWidth: 440, width: '100%', alignSelf: 'center' }}>
        {mode === 'signup' && (
          <Field label="Nom affiché" value={name} onChangeText={setName} placeholder="Kevin" />
        )}
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <Field label="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
        <ErrorText>{error}</ErrorText>
        {info ? <Text style={{ color: t.good }}>{info}</Text> : null}
        <Button
          kind="primary"
          label={mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
          onPress={submit}
          disabled={busy || !email || password.length < 6}
        />
        <Button
          label={mode === 'signin' ? 'Pas encore de compte ? Inscription' : "J'ai déjà un compte"}
          onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        />
      </Card>
    </Screen>
  );
}
