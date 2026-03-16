import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFridge, FridgeItem } from '@/contexts/FridgeContext';
import { BarcodeScannerModal } from '@/components/modals/BarcodeScannerModal';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

const CATEGORIES: { label: string; emoji: string; names: string[] }[] = [
  { label: 'Essentiels', emoji: '🫙', names: ["huile d'olive", 'beurre', 'sel & poivre', 'ail', 'oignon'] },
  { label: 'Féculents & Céréales', emoji: '🍝', names: ['pâtes', 'riz', 'farine', 'pain', 'lentilles'] },
  { label: 'Produits frais', emoji: '🥚', names: ['œufs', 'lait', 'fromage', 'yaourt', 'crème fraîche'] },
  { label: 'Fruits & Légumes', emoji: '🥦', names: ['tomates', 'pommes de terre', 'carottes', 'citron', 'épinards'] },
  { label: 'Sauces & Condiments', emoji: '🥫', names: ['moutarde', 'sauce soja', 'coulis de tomate', 'vinaigre', 'olives'] },
  { label: 'Herbes & Épices', emoji: '🌿', names: ['herbes fraîches', 'cumin', 'paprika', 'cannelle', 'thym'] },
  { label: 'Douceurs', emoji: '🍯', names: ['sucre', 'miel', 'chocolat', 'confiture'] },
];

function groupByCategory(items: FridgeItem[]): { label: string; emoji: string; items: FridgeItem[] }[] {
  const result: { label: string; emoji: string; items: FridgeItem[] }[] = [];
  const assigned = new Set<string>();

  for (const cat of CATEGORIES) {
    const matched = items.filter((item) =>
      cat.names.some((n) => n.toLowerCase() === item.name.toLowerCase())
    );
    if (matched.length > 0) {
      result.push({ label: cat.label, emoji: cat.emoji, items: matched });
      matched.forEach((i) => assigned.add(i.id));
    }
  }

  const others = items.filter((i) => !assigned.has(i.id));
  if (others.length > 0) {
    result.push({ label: 'Autres', emoji: '📦', items: others });
  }

  return result;
}

export default function FridgeScreen() {
  const insets = useSafeAreaInsets();
  const { items, addItem, removeItem, clearFridge } = useFridge();
  const [inputValue, setInputValue] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    addItem(inputValue);
    setInputValue('');
  };

  const handleClear = () => {
    Alert.alert(
      'Vider le frigo',
      'Supprimer tous les ingrédients ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Vider', style: 'destructive', onPress: clearFridge },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="kitchen" size={26} color={C.text} />
          <Text style={styles.headerTitle}>Mon Frigo</Text>
          {items.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{items.length}</Text>
            </View>
          )}
        </View>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Vider</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Ajouter un ingrédient..."
          placeholderTextColor={C.textMuted}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={[styles.addBtn, !inputValue.trim() && styles.addBtnDisabled]}
          onPress={handleAdd}
          disabled={!inputValue.trim()}
        >
          <MaterialIcons name="add" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* List */}
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="kitchen" size={64} color={C.border} />
          <Text style={styles.emptyTitle}>Votre frigo est vide</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez des ingrédients par saisie ou en scannant un produit
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {groupByCategory(items).map((cat) => (
            <View key={cat.label} style={styles.category}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryCount}>{cat.items.length}</Text>
              </View>
              {cat.items.map((item) => (
                <View key={item.id} style={styles.item}>
                  <View style={styles.itemDot} />
                  <Text style={styles.itemName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={styles.removeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialIcons name="close" size={18} color={C.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Scan button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity style={styles.scanBtn} onPress={() => setShowScanner(true)}>
          <MaterialIcons name="qr-code-scanner" size={20} color="#000" />
          <Text style={styles.scanBtnText}>Scanner un produit</Text>
        </TouchableOpacity>
      </View>

      <BarcodeScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onProductFound={(name) => {
          addItem(name);
          setShowScanner(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  badge: {
    backgroundColor: ColorPalette.primary,
    borderRadius: Radius.full,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#000',
  },
  clearBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: ColorPalette.error,
  },
  clearBtnText: {
    fontSize: FontSize.sm,
    color: ColorPalette.error,
    fontWeight: FontWeight.medium,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.base,
    color: C.text,
  },
  addBtn: {
    backgroundColor: ColorPalette.primary,
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  category: {
    gap: Spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: C.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  categoryCount: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    backgroundColor: C.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColorPalette.primary,
  },
  itemName: {
    flex: 1,
    fontSize: FontSize.base,
    color: C.text,
    fontWeight: FontWeight.medium,
  },
  removeBtn: {
    padding: Spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  scanBtn: {
    backgroundColor: ColorPalette.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  scanBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#000',
  },
});
