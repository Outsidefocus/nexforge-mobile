import React from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../theme'
import { Card, Badge, Button, StatCard, DisplayText } from '../components/UI'
import { useStore } from '../store'

const STATUS_CFG = {
  shipped:          { label: 'Shipped',    variant: 'cyan'   },
  'repair-complete':{ label: 'Ready',      variant: 'green'  },
  processing:       { label: 'Processing', variant: 'purple' },
  delivered:        { label: 'Delivered',  variant: 'green'  },
}

function OrderRow({ order }) {
  const cfg = STATUS_CFG[order.status] || STATUS_CFG.processing
  return (
    <View style={styles.orderRow}>
      <View style={styles.orderIcon}>
        <Text style={{ fontSize: 18 }}>📦</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.orderName} numberOfLines={1}>{order.item}</Text>
        <Text style={styles.orderId}>#{order.id}</Text>
      </View>
      <Badge label={cfg.label} variant={cfg.variant} />
      <Text style={styles.orderEta}>{order.eta}</Text>
    </View>
  )
}

function DesignPill({ design }) {
  return (
    <View style={styles.designPill}>
      <View style={[styles.designSwatch, { backgroundColor: design.colors[0] }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.designName}>{design.name}</Text>
        <Text style={styles.designDevice}>{design.device}</Text>
      </View>
    </View>
  )
}

export default function DashboardScreen({ navigation }) {
  const { user, orders, savedDesigns, notifications } = useStore()
  const unread = notifications.filter(n => !n.read).length

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{user.name}</Text>
          </View>
          <TouchableOpacity style={styles.avatarWrap} onPress={() => navigation.navigate('Notifications')}>
            <Text style={{ fontSize: 22 }}>{user.avatar}</Text>
            {unread > 0 && (
              <View style={styles.unreadDot}>
                <Text style={{ color: '#fff', fontSize: 8, fontWeight: '800' }}>{unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hero card */}
        <Card glow="purple" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>YOUR ACCOUNT</Text>
              <View style={styles.pillRow}>
                <Badge label={`LVL ${user.level}`} variant="gold" />
                <Badge label={`⭐ ${user.rep} REP`} variant="purple" />
                <Badge label={`⚡ ${user.credits} CR`} variant="cyan" />
              </View>
            </View>
            <Text style={{ fontSize: 40, opacity: 0.3 }}>🎮</Text>
          </View>
          <View style={styles.heroActions}>
            <Button size="sm" onPress={() => navigation.navigate('Customizer')} style={{ flex: 1 }}>🎨 Design</Button>
            <Button size="sm" variant="cyan" onPress={() => navigation.navigate('Marketplace')} style={{ flex: 1 }}>🛒 Market</Button>
            <Button size="sm" variant="ghost" onPress={() => navigation.navigate('Repair')} style={{ flex: 1 }}>🔧 Repair</Button>
          </View>
        </Card>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard label="Orders" value={orders.length} color={colors.neonCyan} />
          <View style={{ width: spacing.sm }} />
          <StatCard label="Designs" value={savedDesigns.length} color={colors.neonPurple} />
          <View style={{ width: spacing.sm }} />
          <StatCard label="Credits" value={user.credits} color={colors.neonGreen} />
        </View>

        {/* Recent orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.neonCyan }]}>RECENT ORDERS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={{ color: colors.neonPurple, fontSize: 12 }}>View all →</Text>
            </TouchableOpacity>
          </View>
          <Card>
            {orders.map((o, i) => (
              <View key={o.id}>
                <OrderRow order={o} />
                {i < orders.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Saved designs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.neonPurple }]}>SAVED DESIGNS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Customizer')}>
              <Text style={{ color: colors.neonPurple, fontSize: 12 }}>New →</Text>
            </TouchableOpacity>
          </View>
          {savedDesigns.map(d => <DesignPill key={d.id} design={d} />)}
        </View>

        {/* Quick actions */}
        <View style={[styles.section, { marginBottom: spacing.xxl }]}>
          <Text style={[styles.sectionTitle, { marginBottom: spacing.md }]}>QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            {[
              { icon: '🔧', label: 'Track Repair', sub: 'REP-441', color: colors.neonPink, screen: 'Repair' },
              { icon: '💰', label: 'List Item', sub: 'Sell gear', color: colors.neonCyan, screen: 'Marketplace' },
              { icon: '🎮', label: 'Customize', sub: '3D Editor', color: colors.neonPurple, screen: 'Customizer' },
              { icon: '📦', label: 'My Orders', sub: '3 active', color: colors.neonGold, screen: 'Orders' },
            ].map((a) => (
              <TouchableOpacity
                key={a.label}
                style={styles.actionCard}
                onPress={() => navigation.navigate(a.screen)}
                activeOpacity={0.75}
              >
                <Text style={{ fontSize: 24, marginBottom: 6 }}>{a.icon}</Text>
                <Text style={{ color: a.color, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' }}>{a.label}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 2 }}>{a.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgVoid },
  scroll: { flex: 1, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { color: colors.textMuted, fontSize: 13 },
  username: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  avatarWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.bgCard,
    borderWidth: 2, borderColor: colors.neonPurple,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute', top: -2, right: -2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.neonPink,
    alignItems: 'center', justifyContent: 'center',
  },
  heroCard: { marginBottom: spacing.md },
  heroTitle: { color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  heroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  pillRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  heroActions: { flexDirection: 'row', gap: 8 },
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { color: colors.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.borderBright,
    alignItems: 'center', justifyContent: 'center',
  },
  orderName: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  orderId: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  orderEta: { color: colors.textSecondary, fontSize: 11 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  designPill: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, marginBottom: 8,
  },
  designSwatch: { width: 40, height: 40, borderRadius: 8 },
  designName: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  designDevice: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: {
    width: '47%',
    backgroundColor: colors.bgCard,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: spacing.md,
  },
})
