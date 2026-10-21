import { useRouter, type Href } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../lib/theme';

/** Retour dans l'en-tête, même quand la page a été ouverte directement (lien, rechargement). */
export function BackButton({ to, label }: { to: Href; label: string }) {
  const router = useRouter();
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Retour : ${label}`}
      onPress={() => (router.canGoBack() ? router.back() : router.replace(to))}
      style={{ paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 }}
      hitSlop={8}
    >
      <Text style={{ color: t.ink, fontSize: 16, fontWeight: '700' }}>← {label}</Text>
    </Pressable>
  );
}
