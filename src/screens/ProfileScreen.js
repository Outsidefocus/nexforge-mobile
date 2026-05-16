import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../theme'
import { Card, Badge, Button, Divider } from '../components/UI'
import { useStore } from '../store'

const MENU_ITEMS = [
  { icon: '📦', label: 'My Orders', screen: 'Orders', color: colors.neonCyan },
  { icon: '🎨', label: 'Saved Designs', screen: 'Customizer', color: colors.neonPurple },
  { icon: '🔧', label: 'Repair History', screen: 'Repair', color: colors.neonPink },
  { icon: '💰', label: 'My Listings', screen: 'Marketplace', color: colors.neonGreen },
  { icon: '🔔', label: 'Notifications', screen: 'Notifications', color: colors.neonGold },
]

const SETTINGS = [
  { icon: '🔒', label: 'Privacy & Security' },
  { icon: '💳', label: 'Payment Methods' },
  { icon: '📍', label: 'Saved Addresses' },
  { icon: '🌙', label: 'Appearance' },
  { icon: '❓', label: 'Help & Support' },
]

export default function ProfileScreen({ navigation }) {
  const { user, savedDesigns, orders, logout } = useStore()

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { logout(); navigation.replace('Auth') } },
    ])
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile hero */}
        <Card glow="purple" style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            <Text style={{ fontSize: 36 }}>{user.avatar}</Text>
          </View>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.email}>player@nexforge.io</Text>
          <View style={styles.badgeRow}>
            <Badge label={`LVL ${user.level}`} variant="gold" />
            <Badge label={`⭐ ${user.rep} REP`} variant="purple" />
            <Badge label={`⚡ ${user.credits} CR`} variant="cyan" />
          </View>
          <Button size="sm" variant="ghost" style={{ marginTop: spacing.md, alignSelf: 'center' }}>
            ✏️ EDIT PROFILE
          </Button>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { val: orders.length, label: 'Orders', color: colors.neonCyan },
            { val: savedDesigns.length, label: 'Designs', color: colors.neonPurple },
            { val: '4.9', label: 'Seller Rep', color: colors.neonGold },
            { val: '48', label: 'Reviews', color: colors.neonGreen },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Credits card */}
        <Card style={styles.creditsCard}>
          <View style={styles.creditsRow}>
            <View>
              <Text style={styles.creditsLabel}>NEXFORGE CREDITS</Text>
              <Text style={styles.creditsVal}>⚡ {user.credits} CR</Text>
              <Text style={styles.creditsSub}>+250 earned this week</Text>
            </View>
            <Button size="sm" variant="cyan">TOP UP</Button>
          </View>
        </Card>

        {/* Navigation menu */}
        <Card style={styles.menuCard}>
          <Text style={styles.sectionTitle}>MY ACCOUNT</Text>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, i < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={{ color: colors.textMuted }}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Settings */}
        <Card style={styles.menuCard}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          {SETTINGS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, i < SETTINGS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.bgDeep }]}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={{ color: colors.textMuted }}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Sign out */}
        <Button variant="ghost" onPress={handleLogout} style={[styles.signOutBtn, { borderColor: colors.neonPink }]}>
          <Text style={{ color: colors.neonPink, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>🚪 SIGN OUT</Text>
        </Button>

        <Text style={styles.version}>NEXFORGE v1.0.0 · © 2026</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgVoid },
  scroll: { flex: 1, padding: spacing.lg },
  heroCard: { alignItems: 'center', padding: spacing.xl, marginBottom: spacing.md },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.bgDeep,
    borderWidth: 3, borderColor: colors.neonPurple,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.neonPurple,
    shadowOpacity: 0.5, shadowRadius: 15, elevation: 10,
  },
  username: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  email: { color: colors.textMuted, fontSize: 12, marginBottom: spacing.md },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '900' },
  statLabel: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  creditsCard: { marginBottom: spacing.md },
  creditsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creditsLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  creditsVal: { color: colors.neonGold, fontSize: 22, fontWeight: '900' },
  creditsSub: { color: colors.neonGreen, fontSize: 11, marginTop: 2 },
  menuCard: { marginBottom: spacing.md },
  sectionTitle: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  signOutBtn: { marginBottom: spacing.md },
  version: { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginBottom: spacing.sm },
})
