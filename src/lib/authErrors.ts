import { Platform } from 'react-native';
import { errorText, supabase } from './supabase';

/** Page où mène le lien de l'e-mail « mot de passe oublié ». Toujours la version web : elle s'ouvre aussi depuis un téléphone. */
export const RESET_PASSWORD_URL =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? `${window.location.origin}/Grimoire-de-table/reset-password`
    : 'https://thexmyst.github.io/Grimoire-de-table/reset-password';

/** true / false si l'adresse a un compte, null si on ne peut pas savoir (script 0011 pas encore lancé). */
export async function emailExists(email: string): Promise<boolean | null> {
  const { data, error } = await supabase.rpc('email_exists', {
    p_email: email.trim(),
  });
  return error || typeof data !== 'boolean' ? null : data;
}

/** Les messages de Supabase Auth, traduits en français clair. */
export function authErrorText(e: unknown) {
  const msg = errorText(e);
  if (/email not confirmed/i.test(msg))
    return "Ton adresse e-mail n'est pas encore confirmée. Clique sur le lien reçu par e-mail à l'inscription.";
  if (/already registered|already been registered/i.test(msg))
    return 'Un compte existe déjà avec cette adresse. Connecte-toi, ou utilise « Mot de passe oublié ? ».';
  if (/rate limit|only request this after|too many/i.test(msg))
    return "Trop d'essais d'un coup. Patiente quelques minutes avant de réessayer.";
  if (/should be different/i.test(msg)) return "Le nouveau mot de passe doit être différent de l'ancien.";
  if (/password should be at least|weak password/i.test(msg)) return 'Mot de passe trop court : 6 caractères minimum.';
  if (/invalid email|unable to validate email/i.test(msg)) return "Cette adresse e-mail n'a pas l'air valide.";
  if (/failed to fetch|network/i.test(msg)) return 'Impossible de joindre le serveur. Vérifie ta connexion internet.';
  return msg;
}
