import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

function Row({
  icon,
  label,
  value,
  onPress,
  danger,
  soon,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  soon?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <MaterialIcons
          name={icon as any}
          size={20}
          color={danger ? ColorPalette.error : ColorPalette.primary}
        />
      </View>
      <Text style={[styles.rowLabel, danger && { color: ColorPalette.error }]}>{label}</Text>
      <View style={styles.rowRight}>
        {soon && <Text style={styles.soonBadge}>Bientôt</Text>}
        {value !== undefined && <Text style={styles.rowValue}>{value}</Text>}
        {onPress && (
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={danger ? ColorPalette.error : C.textMuted}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut, deleteAccount } = useAuth();
  const { favorites } = useFavorites();

  const email = user?.email ?? '';
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '';

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données (favoris, préférences, frigo) seront supprimées définitivement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Dernière confirmation',
              'Voulez-vous vraiment supprimer votre compte ?',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Oui, supprimer',
                  style: 'destructive',
                  onPress: async () => {
                    const { error } = await deleteAccount();
                    if (error) {
                      Alert.alert('Erreur', 'Impossible de supprimer le compte. Réessayez.');
                    } else {
                      router.replace('/auth/login');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', style: 'destructive', onPress: async () => { await signOut(); router.replace('/auth/login'); } },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(email)}</Text>
          </View>
          <Text style={styles.email}>{email}</Text>
          {memberSince !== '' && (
            <Text style={styles.memberSince}>Membre depuis {memberSince}</Text>
          )}
        </View>

        {/* Informations compte */}
        <Text style={styles.sectionLabel}>INFORMATIONS COMPTE</Text>
        <View style={styles.card}>
          <Row icon="person-outline" label="Nom d'affichage" value="—" onPress={() => {}} />
          <View style={styles.divider} />
          <Row icon="email" label="Adresse email" value={email} />
          <View style={styles.divider} />
          <Row icon="lock-outline" label="Changer le mot de passe" onPress={() => {}} />
        </View>

        {/* Mes recettes */}
        <Text style={styles.sectionLabel}>MES RECETTES</Text>
        <View style={styles.card}>
          <Row
            icon="restaurant"
            label="Recettes générées"
            soon
          />
          <View style={styles.divider} />
          <Row
            icon="favorite"
            label="Favoris"
            value={String(favorites.length)}
            onPress={() => router.navigate('/(tabs)/favorites')}
          />
          <View style={styles.divider} />
          <Row
            icon="shopping-cart"
            label="Liste de courses"
            soon
          />
        </View>

        {/* Préférences alimentaires */}
        <Text style={styles.sectionLabel}>PRÉFÉRENCES ALIMENTAIRES</Text>
        <View style={styles.card}>
          <Row icon="no-meals" label="Allergies & exclusions" soon />
          <View style={styles.divider} />
          <Row icon="eco" label="Régime alimentaire" soon />
          <View style={styles.divider} />
          <Row icon="fitness-center" label="Objectif nutritionnel" soon />
        </View>

        {/* Paramètres */}
        <Text style={styles.sectionLabel}>PARAMÈTRES</Text>
        <View style={styles.card}>
          <Row icon="notifications-none" label="Notifications" onPress={() => {}} />
          <View style={styles.divider} />
          <Row icon="language" label="Langue" value="Français" onPress={() => {}} />
          <View style={styles.divider} />
          <Row icon="logout" label="Se déconnecter" onPress={handleSignOut} danger />
          <View style={styles.divider} />
          <Row icon="delete-forever" label="Supprimer le compte" onPress={handleDeleteAccount} danger />
        </View>

        <Text style={styles.version}>v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ColorPalette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: '#000',
  },
  email: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: C.text,
  },
  memberSince: {
    fontSize: FontSize.sm,
    color: C.textMuted,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: C.textMuted,
    letterSpacing: 1,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(19, 236, 91, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  rowLabel: {
    flex: 1,
    fontSize: FontSize.base,
    color: C.text,
    fontWeight: FontWeight.medium,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rowValue: {
    fontSize: FontSize.sm,
    color: C.textMuted,
  },
  soonBadge: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    backgroundColor: C.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginLeft: Spacing.md + 36 + Spacing.md,
  },
  version: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
