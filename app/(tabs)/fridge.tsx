import { useState, useRef, useMemo } from 'react';
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

const FOOD_SUGGESTIONS = [
  // Fruits
  'pomme', 'poire', 'banane', 'orange', 'citron', 'citron vert', 'fraise', 'framboise',
  'myrtille', 'cerise', 'raisin', 'mangue', 'ananas', 'kiwi', 'pêche', 'abricot',
  'prune', 'melon', 'pastèque', 'avocat', 'figue', 'grenade', 'papaye', 'litchi',
  // Légumes
  'tomate', 'carotte', 'pomme de terre', 'oignon', 'oignon rouge', 'ail', 'courgette',
  'aubergine', 'poivron rouge', 'poivron vert', 'poivron jaune', 'brocoli', 'chou-fleur',
  'épinard', 'salade', 'laitue', 'roquette', 'concombre', 'poireau', 'champignon',
  'céleri', 'betterave', 'haricots verts', 'petits pois', 'maïs', 'asperge', 'artichaut',
  'navet', 'fenouil', 'radis', 'patate douce', 'courge', 'potiron', 'chou', 'chou rouge',
  // Viandes
  'poulet', 'escalope de poulet', 'cuisse de poulet', 'blanc de poulet',
  'bœuf', 'steak haché', 'côte de bœuf', 'agneau', 'côtelette d\'agneau',
  'veau', 'porc', 'côte de porc', 'dinde', 'canard', 'lapin',
  'saucisse', 'merguez', 'chipolata', 'lardons', 'jambon',
  // Poissons & fruits de mer
  'saumon', 'thon', 'thon en boîte', 'cabillaud', 'dorade', 'lieu noir',
  'crevette', 'moule', 'sardine', 'maquereau', 'truite', 'sole',
  // Produits laitiers
  'lait', 'lait de coco', 'beurre', 'crème fraîche', 'crème liquide',
  'fromage râpé', 'gruyère', 'mozzarella', 'parmesan', 'camembert', 'brie',
  'ricotta', 'feta', 'yaourt', 'fromage blanc', 'mascarpone',
  // Œufs
  'œufs',
  // Féculents & Céréales
  'pâtes', 'spaghetti', 'tagliatelles', 'penne', 'riz', 'riz basmati',
  'farine', 'farine de blé', 'semoule', 'quinoa', 'boulgour', 'polenta',
  'pain de mie', 'baguette', 'levure', 'biscottes',
  // Légumineuses
  'lentilles', 'lentilles corail', 'pois chiches', 'haricots blancs',
  'haricots rouges', 'fèves', 'edamame',
  // Huiles & Condiments
  "huile d'olive", 'huile de tournesol', 'huile de sésame',
  'vinaigre', 'vinaigre balsamique', 'vinaigre de cidre',
  'moutarde', 'sauce soja', 'sauce worcestershire', 'ketchup', 'mayonnaise',
  'tabasco', 'sriracha', 'nuoc-mâm', 'tahini', 'pesto',
  // Conserves & Sauces
  'coulis de tomate', 'tomates concassées', 'tomates pelées', 'concentré de tomate',
  'olives', 'câpres', 'cornichons',
  // Herbes & Épices
  'basilic', 'persil', 'coriandre', 'thym', 'romarin', 'laurier', 'ciboulette',
  'cumin', 'paprika', 'curry', 'cannelle', 'curcuma', 'gingembre', 'piment',
  'noix de muscade', 'herbes de provence', 'origan', 'aneth', 'estragon',
  // Sucré & Boulangerie
  'sucre', 'sucre roux', 'miel', 'sirop d\'érable', 'chocolat noir',
  'chocolat au lait', 'poudre de cacao', 'confiture', 'nutella',
  // Fruits secs & Graines
  'noix', 'amande', 'noisette', 'pistache', 'noix de cajou', 'noix de coco râpée',
  'graines de sésame', 'graines de chia', 'graines de tournesol',
  // Bouillons
  'bouillon de légumes', 'bouillon de poulet', 'bouillon de bœuf',
];

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const CATEGORIES: { label: string; emoji: string; names: string[] }[] = [
  {
    label: 'Fruits & Légumes', emoji: '🥦', names: [
      'pomme', 'poire', 'banane', 'orange', 'citron', 'citron vert', 'fraise', 'framboise',
      'myrtille', 'cerise', 'raisin', 'mangue', 'ananas', 'kiwi', 'peche', 'pêche', 'abricot',
      'prune', 'melon', 'pasteque', 'pastèque', 'avocat', 'figue', 'grenade', 'papaye', 'litchi',
      'clementine', 'clémentine', 'mandarine', 'pamplemousse', 'nectarine', 'brugnon',
      'tomate', 'tomates', 'carotte', 'carottes', 'pomme de terre', 'pommes de terre',
      'oignon', 'oignon rouge', 'ail', 'courgette', 'aubergine',
      'poivron', 'poivron rouge', 'poivron vert', 'poivron jaune',
      'brocoli', 'chou-fleur', 'epinard', 'épinard', 'epinards', 'épinards',
      'salade', 'laitue', 'roquette', 'concombre', 'poireau', 'champignon', 'champignons',
      'celeri', 'céleri', 'betterave', 'haricots verts', 'petits pois', 'mais', 'maïs',
      'asperge', 'artichaut', 'navet', 'fenouil', 'radis', 'patate douce',
      'courge', 'potiron', 'chou', 'chou rouge', 'brocolis',
    ],
  },
  {
    label: 'Viandes', emoji: '🥩', names: [
      'poulet', 'escalope de poulet', 'cuisse de poulet', 'blanc de poulet', 'filet de poulet',
      'boeuf', 'bœuf', 'steak hache', 'steak haché', 'cote de boeuf', 'côte de bœuf',
      'agneau', 'cote d\'agneau', 'côtelette d\'agneau', 'veau', 'porc', 'cote de porc', 'côte de porc',
      'dinde', 'canard', 'lapin', 'saucisse', 'merguez', 'chipolata', 'lardons', 'jambon',
      'bacon', 'chorizo', 'andouille', 'boudin',
    ],
  },
  {
    label: 'Poissons & Fruits de mer', emoji: '🐟', names: [
      'saumon', 'thon', 'thon en boite', 'thon en boîte', 'cabillaud', 'dorade', 'lieu noir',
      'crevette', 'crevettes', 'moule', 'moules', 'sardine', 'sardines', 'maquereau', 'truite', 'sole',
      'bar', 'colin', 'merlu', 'calamar', 'seiche', 'homard', 'langoustine',
    ],
  },
  {
    label: 'Produits frais', emoji: '🥚', names: [
      'oeuf', 'œuf', 'oeufs', 'œufs', 'lait', 'lait de coco', 'beurre', 'creme fraiche',
      'crème fraîche', 'creme liquide', 'crème liquide', 'fromage rape', 'fromage râpé',
      'gruyere', 'gruyère', 'mozzarella', 'parmesan', 'camembert', 'brie', 'ricotta',
      'feta', 'yaourt', 'fromage blanc', 'mascarpone', 'emmental', 'comté', 'comte',
      'roquefort', 'cheddar', 'gouda', 'creme', 'crème',
    ],
  },
  {
    label: 'Féculents & Céréales', emoji: '🍝', names: [
      'pates', 'pâtes', 'spaghetti', 'tagliatelles', 'penne', 'fusilli', 'farfalle', 'lasagne',
      'riz', 'riz basmati', 'riz rond', 'farine', 'farine de ble', 'farine de blé',
      'semoule', 'quinoa', 'boulgour', 'polenta', 'pain', 'pain de mie', 'baguette',
      'biscottes', 'levure', 'chapelure',
    ],
  },
  {
    label: 'Légumineuses', emoji: '🫘', names: [
      'lentilles', 'lentilles corail', 'pois chiches', 'haricots blancs',
      'haricots rouges', 'feves', 'fèves', 'edamame', 'soja', 'tofu',
    ],
  },
  {
    label: 'Sauces & Condiments', emoji: '🥫', names: [
      "huile d'olive", 'huile de tournesol', 'huile de sesame', 'huile de sésame', 'huile',
      'vinaigre', 'vinaigre balsamique', 'vinaigre de cidre',
      'moutarde', 'sauce soja', 'ketchup', 'mayonnaise', 'tabasco', 'sriracha',
      'nuoc-mam', 'nuoc-mâm', 'tahini', 'pesto', 'coulis de tomate', 'tomates concassees',
      'tomates concassées', 'tomates pelees', 'tomates pelées', 'concentre de tomate',
      'concentré de tomate', 'olives', 'capres', 'câpres', 'cornichons', 'sauce worcestershire',
    ],
  },
  {
    label: 'Herbes & Épices', emoji: '🌿', names: [
      'basilic', 'persil', 'coriandre', 'thym', 'romarin', 'laurier', 'ciboulette',
      'cumin', 'paprika', 'curry', 'cannelle', 'curcuma', 'gingembre', 'piment',
      'noix de muscade', 'herbes de provence', 'origan', 'aneth', 'estragon',
      'sel', 'poivre', 'sel & poivre',
    ],
  },
  {
    label: 'Fruits secs & Graines', emoji: '🥜', names: [
      'noix', 'amande', 'amandes', 'noisette', 'noisettes', 'pistache', 'pistaches',
      'noix de cajou', 'noix de coco rapee', 'noix de coco râpée',
      'graines de sesame', 'graines de sésame', 'graines de chia', 'graines de tournesol',
      'raisins secs', 'pruneaux', 'abricots secs', 'cacahuetes', 'cacahuètes',
    ],
  },
  {
    label: 'Douceurs', emoji: '🍯', names: [
      'sucre', 'sucre roux', 'miel', "sirop d'erable", "sirop d'érable",
      'chocolat', 'chocolat noir', 'chocolat au lait', 'poudre de cacao',
      'confiture', 'nutella', 'caramel', 'vanille',
    ],
  },
  {
    label: 'Bouillons & Fonds', emoji: '🍲', names: [
      'bouillon de legumes', 'bouillon de légumes', 'bouillon de poulet',
      'bouillon de boeuf', 'bouillon de bœuf', 'fond de veau',
    ],
  },
];

function groupByCategory(items: FridgeItem[]): { label: string; emoji: string; items: FridgeItem[] }[] {
  const result: { label: string; emoji: string; items: FridgeItem[] }[] = [];
  const assigned = new Set<string>();

  for (const cat of CATEGORIES) {
    const catNamesNorm = new Set(cat.names.map(normalize));
    const matched = items.filter((item) => catNamesNorm.has(normalize(item.name)));
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

  const suggestions = useMemo(() => {
    const q = inputValue.trim();
    if (q.length < 2) return [];
    const qn = normalize(q);
    const inFridge = new Set(items.map((i) => normalize(i.name)));
    return FOOD_SUGGESTIONS.filter(
      (s) => normalize(s).includes(qn) && !inFridge.has(normalize(s))
    ).slice(0, 6);
  }, [inputValue, items]);

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

      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.suggestionsRow}
        >
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.suggestionChip}
              onPress={() => { addItem(s); setInputValue(''); }}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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
  suggestionsRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  suggestionChip: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  suggestionText: {
    fontSize: FontSize.sm,
    color: C.text,
    fontWeight: FontWeight.medium,
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
