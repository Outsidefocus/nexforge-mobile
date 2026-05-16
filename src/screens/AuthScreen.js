import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../theme'
import { Button, Card } from '../components/UI'
import { useStore } from '../store'

export default function AuthScreen({ navigation }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const login = useStore(s => s.login)

  const handleSubmit = () => {
    if (!email.trim()) { Alert.alert('Error', 'Please enter your email'); return }
    if (!password.trim()) { Alert.alert('Error', 'Please enter a password'); return }
    login({ username: username || 'Player_One', email })
    navigation.replace('Main')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Text style={{ fontSize: 32 }}>⚡</Text>
            </View>
            <Text style={styles.logoText}>NEXFORGE</Text>
            <Text style={styles.logoSub}>Gaming Equipment Platform</Text>
          </View>

          {/* Tab switcher */}
          <View style={styles.tabRow}>
            {['login', 'register'].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.tab, mode === m && styles.tabActive]}
                onPress={() => setMode(m)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                  {m === 'login' ? 'SIGN IN' : 'REGISTER'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form */}
          <Card glow="purple" style={styles.formCard}>
            {mode === 'register' && (
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>GAMERTAG</Text>
                <TextInput
                  style={styles.input}
                  placeholder="GhostRider_X"
                  placeholderTextColor={colors.textMuted}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="player@nexforge.io"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[styles.input, { paddingRight: 52 }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPw(s => !s)}
                >
                  <Text style={{ fontSize: 16 }}>{showPw ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {mode === 'login' && (
              <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: spacing.md }}>
                <Text style={{ color: colors.neonPurple, fontSize: 12 }}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <Button onPress={handleSubmit} size="lg" style={{ marginTop: 4 }}>
              {mode === 'login' ? '⚡  SIGN IN' : '🚀  CREATE ACCOUNT'}
            </Button>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>or continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              {['🎮 Discord', '🐦 Twitter', '🎯 Steam'].map(s => (
                <TouchableOpacity key={s} style={styles.socialBtn} onPress={handleSubmit}>
                  <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '600' }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <TouchableOpacity style={{ alignSelf: 'center', marginTop: spacing.lg }} onPress={() => setMode(m => m === 'login' ? 'register' : 'login')}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={{ color: colors.neonPurple }}>
                {mode === 'login' ? 'Register' : 'Sign in'}
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgVoid },
  scroll: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  logoArea: { alignItems: 'center', marginBottom: spacing.xl },
  logoIcon: {
    width: 72, height: 72,
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    borderWidth: 2, borderColor: colors.neonPurple,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 20, elevation: 12,
  },
  logoText: {
    fontSize: 28, fontWeight: '900', letterSpacing: 4,
    color: colors.textPrimary, textTransform: 'uppercase',
  },
  logoSub: { color: colors.textMuted, fontSize: 12, marginTop: 4, letterSpacing: 1 },
  tabRow: {
    flexDirection: 'row', backgroundColor: colors.bgDeep,
    borderRadius: radius.md, padding: 4, marginBottom: spacing.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.neonPurple },
  tabText: { color: colors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  tabTextActive: { color: '#fff' },
  formCard: { padding: spacing.lg },
  fieldWrap: { marginBottom: spacing.md },
  label: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' },
  input: {
    backgroundColor: colors.bgDeep,
    borderWidth: 1, borderColor: colors.borderBright,
    borderRadius: radius.md, padding: 13,
    color: colors.textPrimary, fontSize: 15,
  },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md, gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: { color: colors.textMuted, fontSize: 11 },
  socialRow: { flexDirection: 'row', gap: 8 },
  socialBtn: {
    flex: 1, paddingVertical: 9, alignItems: 'center',
    borderWidth: 1, borderColor: colors.borderBright,
    borderRadius: radius.md, backgroundColor: 'transparent',
  },
})
