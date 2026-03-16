import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const { preferences, loading: prefsLoading } = usePreferences();

  if (authLoading || (!!session && prefsLoading)) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.dark.tint} size="large" />
      </View>
    );
  }

  if (!session) return <Redirect href="/auth/login" />;
  if (!preferences.onboarding_completed) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
