import { View, Text } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function FridgeScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">Frigo</ThemedText>
      <Text style={{ marginTop: 12, opacity: 0.6 }}>À venir</Text>
    </ThemedView>
  );
}
