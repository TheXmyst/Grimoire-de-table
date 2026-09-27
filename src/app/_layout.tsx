import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Loading } from '../components/ui';
import { AuthProvider, useAuth } from '../lib/auth';
import { isConfigured } from '../lib/supabase';
import { fonts, useTheme } from '../lib/theme';

function Gate() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const t = useTheme();

  useEffect(() => {
    if (loading) return;
    const onLogin = segments[0] === 'login';
    if (!session && !onLogin) router.replace('/login');
    if (session && onLogin) router.replace('/');
  }, [session, loading, segments, router]);

  if (loading) return <Loading />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: t.surface },
        headerTintColor: t.ink,
        headerTitleStyle: { fontFamily: fonts.display, fontWeight: '700' },
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Grimoire de Table' }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="campaign/[id]" options={{ title: 'Campagne' }} />
      <Stack.Screen name="character/[id]" options={{ title: 'Fiche' }} />
      <Stack.Screen name="spells/[characterId]" options={{ title: 'Choisir des sorts', presentation: 'modal' }} />
    </Stack>
  );
}

function MissingConfig() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12, backgroundColor: t.bg }}>
      <Text style={{ color: t.ink, fontSize: 22, fontWeight: '700' }}>Serveur non configuré</Text>
      <Text style={{ color: t.muted, fontSize: 16 }}>
        Renseigne EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY (voir le README).
      </Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {isConfigured ? (
        <AuthProvider>
          <Gate />
        </AuthProvider>
      ) : (
        <MissingConfig />
      )}
    </SafeAreaProvider>
  );
}
