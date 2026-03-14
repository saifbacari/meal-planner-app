import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors, ColorPalette, FontSize } from '@/constants/theme';

export default function AuthCallback() {
  const { code, error, error_description } = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.replace('/auth/login');
      return;
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (exchangeError) {
          router.replace('/auth/login');
        }
        // Si ok, onAuthStateChange dans AuthContext met à jour la session
        // et _layout redirige automatiquement vers (tabs)
      });
    }
  }, [code, error]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.background }}>
        <Text style={{ color: ColorPalette.error, fontSize: FontSize.md }}>
          {error_description ?? 'Erreur de confirmation'}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.background }}>
      <ActivityIndicator color={Colors.dark.tint} size="large" />
    </View>
  );
}
