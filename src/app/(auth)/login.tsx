// app/(auth)/login.tsx
import { router } from 'expo-router';
import { BrainCircuit } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completa todos los campos.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: reemplaza con tu auth real (Supabase, Firebase, etc.)
      await new Promise((r) => setTimeout(r, 800));
      router.replace('/(tabs)');
    } catch (e) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.inner,
          {
            paddingTop: insets.top + 48,
            paddingBottom: insets.bottom + 32,
          },
        ]}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <BrainCircuit size={32} color='#34d399' strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>FOREMIND</Text>
          <Text style={styles.subtitle}>Ingresa a tu cuenta</Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setError(null);
              }}
              placeholder='tu@email.com'
              placeholderTextColor='#475569'
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='email'
              returnKeyType='next'
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setError(null);
              }}
              placeholder='••••••••'
              placeholderTextColor='#475569'
              secureTextEntry
              autoComplete='password'
              returnKeyType='done'
              onSubmitEditing={handleLogin}
            />
          </View>

          {/* Error inline */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* ── Primary CTA ── */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#020617' />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Register ── */}
        <TouchableOpacity
          style={styles.registerBtn}
          activeOpacity={0.7}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta?{' '}
            <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // slate-950
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },

  // ── header ──
  header: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#34d399',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    letterSpacing: 1,
  },

  // ── form ──
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#0f172a', // slate-900
    borderWidth: 1,
    borderColor: '#1e293b', // slate-800
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#e2e8f0',
  },
  errorText: {
    fontSize: 12,
    color: '#f87171', // red-400
    textAlign: 'center',
    marginTop: -4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 12,
    color: '#34d399',
    fontWeight: '500',
  },

  // ── button ──
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#10b981',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#020617',
    letterSpacing: 0.5,
  },

  // ── divider ──
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1e293b',
  },
  dividerText: {
    fontSize: 13,
    color: '#475569',
  },

  // ── register ──
  registerBtn: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#64748b',
  },
  registerLink: {
    color: '#34d399',
    fontWeight: '600',
  },
});
