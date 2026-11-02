import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, ErrorText, Field, Screen } from '../components/ui';
import { authErrorText, emailExists, RESET_PASSWORD_URL } from '../lib/authErrors';
import { supabase } from '../lib/supabase';
import { fonts, useTheme } from '../lib/theme';

type Mode = 'signin' | 'signup' | 'forgot';

/** En ligne pour que le champ ne prenne pas 120 px de haut */
const Line = ({ children }: { children: ReactNode }) => <View style={{ flexDirection: 'row' }}>{children}</View>;

export default function Login() {
  const t = useTheme();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  /** Le mot de passe était faux : on met « Mot de passe oublié ? » en avant */
  const [wrongPassword, setWrongPassword] = useState(false);

  function switchTo(next: Mode) {
    setMode(next);
    setError('');
    setInfo('');
    setWrongPassword(false);
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (!error) return;
    if (!/invalid login credentials/i.test(error.message)) throw error;
    // Supabase répond pareil pour « adresse inconnue » et « mauvais mot de passe » : on vérifie l'adresse
    const exists = await emailExists(email);
    if (exists === false) setError("Aucun compte n'existe avec cette adresse. Vérifie l'orthographe, ou crée un compte.");
    else if (exists === true) {
      setError('Mot de passe incorrect.');
      setWrongPassword(true);
    } else setError('Adresse e-mail ou mot de passe incorrect.');
  }

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: name.trim() || undefined } },
    });
    if (error) throw error;
    if (!data.session) setInfo('Compte créé. Confirme ton adresse e-mail puis connecte-toi.');
  }

  async function sendReset() {
    if ((await emailExists(email)) === false) {
      setError("Aucun compte n'existe avec cette adresse. Vérifie l'orthographe.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: RESET_PASSWORD_URL,
    });
    if (error) throw error;
    setInfo(
      `E-mail envoyé à ${email.trim()}. Ouvre le lien qu'il contient pour choisir un nouveau mot de passe (pense à regarder dans les spams).`,
    );
  }

  async function submit() {
    setBusy(true);
    setError('');
    setInfo('');
    setWrongPassword(false);
    try {
      if (mode === 'signin') await signIn();
      else if (mode === 'signup') await signUp();
      else await sendReset();
    } catch (e) {
      setError(authErrorText(e));
    } finally {
      setBusy(false);
    }
  }

  const validEmail = /\S+@\S+\.\S+/.test(email.trim());

  return (
    <Screen>
      <View style={{ paddingTop: 48, gap: 6, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 32,
            fontWeight: '700',
            color: t.ink,
          }}
        >
          Grimoire de Table
        </Text>
        <Text
          style={{
            color: t.muted,
            fontSize: 14,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          D&D 5e · zéro papier
        </Text>
      </View>
      <Card style={{ maxWidth: 440, width: '100%', alignSelf: 'center' }}>
        {mode === 'forgot' && (
          <Text style={{ color: t.muted, fontSize: 15 }}>
            Indique ton adresse e-mail : tu vas recevoir un lien pour choisir un nouveau mot de passe.
          </Text>
        )}
        {mode === 'signup' && (
          <Line>
            <Field label="Nom affiché" value={name} onChangeText={setName} placeholder="Kevin" />
          </Line>
        )}
        <Line>
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </Line>
        {mode !== 'forgot' && (
          <Line>
            <Field label="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
          </Line>
        )}
        {mode === 'signup' && password.length > 0 && password.length < 6 && (
          <Text style={{ color: t.muted, fontSize: 13 }}>6 caractères minimum.</Text>
        )}
        <ErrorText>{error}</ErrorText>
        {info ? <Text style={{ color: t.good }}>{info}</Text> : null}
        <Button
          kind="primary"
          label={mode === 'signin' ? 'Se connecter' : mode === 'signup' ? 'Créer mon compte' : 'Envoyer le lien'}
          onPress={submit}
          disabled={busy || !validEmail || (mode !== 'forgot' && password.length < 6)}
        />
        {mode === 'signin' && (
          <Button kind={wrongPassword ? 'primary' : 'default'} label="Mot de passe oublié ?" onPress={() => switchTo('forgot')} />
        )}
        {mode === 'forgot' ? (
          <Button label="Retour à la connexion" onPress={() => switchTo('signin')} />
        ) : (
          <Button
            label={mode === 'signin' ? 'Pas encore de compte ? Inscription' : "J'ai déjà un compte"}
            onPress={() => switchTo(mode === 'signin' ? 'signup' : 'signin')}
          />
        )}
      </Card>
    </Screen>
  );
}
