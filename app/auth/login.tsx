import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ColorPalette, Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

// Affiche brièvement le dernier caractère saisi avant de masquer
function usePasswordPeek(setter: (v: string) => void) {
  const [secure, setSecure] = useState(true);
  const prevLength = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((text: string) => {
    setter(text);
    if (text.length > prevLength.current) {
      setSecure(false);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setSecure(true), 300);
    } else {
      if (timeout.current) clearTimeout(timeout.current);
      setSecure(true);
    }
    prevLength.current = text.length;
  }, [setter]);

  return { secure, handleChange };
}

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const pwdPeek = usePasswordPeek(setPassword);
  const confirmPeek = usePasswordPeek(setConfirmPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!email.includes('@')) return 'Adresse email invalide.';
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
    if (mode === 'signup' && password !== confirmPassword) return 'Les mots de passe ne correspondent pas.';
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    if (mode === 'login') {
      const { error: authError } = await signIn(email, password);
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else {
        router.replace('/');
      }
    } else {
      const { error: authError, needsConfirmation } = await signUp(email, password);
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else if (needsConfirmation) {
        setSuccess('Compte créé ! Vérifiez votre email pour confirmer.');
      } else {
        router.replace('/');
      }
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>🥗</Text>
          <Text style={styles.title}>Recettes Maison</Text>
          <Text style={styles.subtitle}>Cuisinez avec ce que vous avez</Text>
        </View>

        <View style={styles.card}>
          {/* Mode toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}
              onPress={() => switchMode('login')}
            >
              <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>
                Connexion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
              onPress={() => switchMode('signup')}
            >
              <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>
                Inscription
              </Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          <View style={styles.fields}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={C.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={pwdPeek.handleChange}
              secureTextEntry={pwdPeek.secure}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              returnKeyType={mode === 'login' ? 'done' : 'next'}
              onSubmitEditing={mode === 'login' ? handleSubmit : undefined}
            />
            {mode === 'signup' && (
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={C.textMuted}
                value={confirmPassword}
                onChangeText={confirmPeek.handleChange}
                secureTextEntry={confirmPeek.secure}
                autoComplete="new-password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            )}
          </View>

          {/* Error / Success */}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.successMsg}>{success}</Text> : null}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>
                {mode === 'login' ? 'Se connecter' : "S'inscrire"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: C.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: C.textMuted,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: C.background,
    borderRadius: Radius.md,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: ColorPalette.primary,
  },
  toggleText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: C.textMuted,
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: FontWeight.semibold,
  },
  fields: {
    gap: Spacing.sm,
  },
  input: {
    backgroundColor: C.background,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.base,
    color: C.text,
  },
  error: {
    fontSize: FontSize.sm,
    color: ColorPalette.error,
    textAlign: 'center',
  },
  successMsg: {
    fontSize: FontSize.sm,
    color: ColorPalette.primary,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: ColorPalette.primary,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#000',
  },
});
