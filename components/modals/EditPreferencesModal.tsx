import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChoiceCard } from '@/components/onboarding/ChoiceCard';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

const GOALS = [
  { id: 'lose_weight', emoji: '🏃', label: 'Perdre du poids' },
  { id: 'eat_healthy', emoji: '🥗', label: 'Manger sain' },
  { id: 'build_muscle', emoji: '💪', label: 'Prise de masse' },
  { id: 'maintain', emoji: '⚖️', label: 'Maintien en forme' },
];

const BASE_DIETS = [
  { id: 'omnivore', emoji: '🍖', label: 'Omnivore' },
  { id: 'vegetarian', emoji: '🥦', label: 'Végétarien' },
  { id: 'vegan', emoji: '🌱', label: 'Vegan' },
  { id: 'pescatarian', emoji: '🐟', label: 'Pescétarien' },
];

const RESTRICTIONS = [
  { id: 'halal', emoji: '☪️', label: 'Halal' },
  { id: 'kosher', emoji: '✡️', label: 'Casher' },
  { id: 'no_pork', emoji: '🐷', label: 'Sans porc' },
];

const ALLERGIES = [
  { id: 'gluten', emoji: '🌾', label: 'Gluten' },
  { id: 'lactose', emoji: '🥛', label: 'Lactose' },
  { id: 'nuts', emoji: '🥜', label: 'Noix' },
  { id: 'seafood', emoji: '🦐', label: 'Fruits de mer' },
  { id: 'eggs', emoji: '🥚', label: 'Œufs' },
  { id: 'soy', emoji: '🫘', label: 'Soja' },
  { id: 'peanuts', emoji: '🥜', label: 'Arachides' },
];

const TIMES = [
  { id: 'under15', emoji: '⚡', label: '< 15 min' },
  { id: '15-30', emoji: '🕐', label: '15 – 30 min' },
  { id: '30-60', emoji: '🕑', label: '30 – 60 min' },
  { id: 'over60', emoji: '🍳', label: '+ 1 heure' },
];

const LEVELS = [
  { id: 'beginner', emoji: '🌱', label: 'Débutant' },
  { id: 'intermediate', emoji: '👨‍🍳', label: 'Intermédiaire' },
  { id: 'advanced', emoji: '🔥', label: 'Passionné' },
  { id: 'chef', emoji: '⭐', label: 'Chef' },
];

const EQUIPMENT = [
  { id: 'oven', emoji: '🔥', label: 'Four' },
  { id: 'microwave', emoji: '⚡', label: 'Micro-ondes' },
  { id: 'air_fryer', emoji: '💨', label: 'Air Fryer' },
  { id: 'blender', emoji: '🌀', label: 'Mixeur / Blender' },
  { id: 'steamer', emoji: '♨️', label: 'Cuiseur vapeur' },
  { id: 'pressure_cooker', emoji: '🫕', label: 'Cocotte-minute' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function EditPreferencesModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { preferences, savePreferences } = usePreferences();

  const [goal, setGoal] = useState<string>(preferences.goals?.[0] ?? '');
  const [baseDiet, setBaseDiet] = useState<string>(
    BASE_DIETS.find((d) => preferences.diet.includes(d.id))?.id ?? 'omnivore'
  );
  const [restriction, setRestriction] = useState<string>(
    preferences.diet.find((d) => RESTRICTIONS.some((r) => r.id === d)) ?? ''
  );
  const [allergies, setAllergies] = useState<string[]>(preferences.allergies);
  const [time, setTime] = useState<string>(preferences.preferred_time);
  const [level, setLevel] = useState<string>(preferences.cooking_level);
  const [equipment, setEquipment] = useState<string[]>(preferences.equipment);
  const [saving, setSaving] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  const handleSave = async () => {
    setSaving(true);
    await savePreferences({ goals: goal ? [goal] : [], diet: restriction ? [baseDiet, restriction] : [baseDiet], allergies, preferred_time: time, cooking_level: level, equipment });
    setSaving(false);
    onClose();
  };

  // Reset local state to current preferences when modal opens
  const handleOpen = () => {
    setGoal(preferences.goals?.[0] ?? '');
    setBaseDiet(BASE_DIETS.find((d) => preferences.diet.includes(d.id))?.id ?? 'omnivore');
    setRestriction(preferences.diet.find((d) => RESTRICTIONS.some((r) => r.id === d)) ?? '');
    setAllergies(preferences.allergies);
    setTime(preferences.preferred_time);
    setLevel(preferences.cooking_level);
    setEquipment(preferences.equipment);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      onShow={handleOpen}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <MaterialIcons name="close" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes préférences</Text>
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator size="small" color="#000" />
              : <Text style={styles.saveBtnText}>Enregistrer</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          <Text style={styles.sectionLabel}>Objectif principal</Text>
          <View style={styles.grid}>
            {GOALS.map((item) => (
              <ChoiceCard
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={goal === item.id}
                onPress={() => setGoal(item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Type de régime</Text>
          <View style={styles.grid}>
            {BASE_DIETS.map((item) => (
              <ChoiceCard
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={baseDiet === item.id}
                onPress={() => setBaseDiet(item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Restrictions religieuses / culturelles</Text>
          <View style={styles.grid}>
            {RESTRICTIONS.map((item) => (
              <ChoiceCard
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={restriction === item.id}
                onPress={() => setRestriction((prev) => prev === item.id ? '' : item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Allergies & intolérances</Text>
          <View style={styles.grid}>
            {ALLERGIES.map((item) => (
              <ChoiceCard
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={allergies.includes(item.id)}
                onPress={() => toggle(allergies, setAllergies, item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Temps de préparation</Text>
          <View style={styles.grid}>
            {TIMES.map((item) => (
              <ChoiceCard
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={time === item.id}
                onPress={() => setTime(item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Niveau en cuisine</Text>
          <View style={styles.grid}>
            {LEVELS.map((item) => (
              <ChoiceCard
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={level === item.id}
                onPress={() => setLevel(item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Équipement cuisine</Text>
          <Text style={styles.hint}>La poêle et la casserole sont toujours incluses.</Text>
          <View style={styles.grid}>
            {EQUIPMENT.map((item) => (
              <ChoiceCard
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={equipment.includes(item.id)}
                onPress={() => toggle(equipment, setEquipment, item.id)}
              />
            ))}
          </View>

        </ScrollView>
      </View>
    </Modal>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: Spacing.sm,
  },
  iconBtn: {
    padding: Spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: C.text,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: ColorPalette.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#000',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  hint: {
    fontSize: FontSize.sm,
    color: C.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
