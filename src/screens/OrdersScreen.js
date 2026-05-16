import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../theme'
import { Card, Badge, StatCard } from '../components/UI'
import { useStore } from '../store'

const STATUS = {
  processing:        { label: 'Processing', variant: 'purple', step: 1, color: colors.neonPurple },
  shipped:           { label: 'Shipped',    variant: 'cyan',   step: 2, color: colors.neonCyan   },
  'repair-complete': { label: 'Ready',      variant: 'green',  step: 3, color: colors.neonGreen  },
  delivered:         { label: 'Delivered',  variant: 'green',  step: 4, color: colors.neonGreen  },
}

const TRACK_STEPS = ['Ordered', 'Processing', 'Shipped', 'Delivered']
const TRACK_ICONS = ['📝', '⚙️', '🚚', '✅']

function OrderCard({ order }) {
  const cfg = STATUS[order.status] || STATUS.processing
  return (
    <Card style={styles.orderCard}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderId}>#{order.id}</Text>
            <Badge label={cfg.label} variant={cfg.variant} />
          </View>
          <Text style={styles.orderItem} numberOfLines={2}>{order.item}</Text>
          <Text style={styles.orderDate}>Ordered: {order.date}</Text>
        </View>
        <View style={styles.etaBox}>
          <Text style={styles.etaLabel}>ETA</Text>
          <Text style={[styles.etaValue, { color: cfg.color }]}>{order.eta}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBg} />
        <View style={[styles.progressFill, {
          width: `${((cfg.step - 1) / 3) * 100}%`,
          backgroundColor: cfg.color,
        }]} />
      </View>

      <View style={styles.stepsRow}>
        {TRACK_STEPS.map((s, i) => {
          const done = i < cfg.step
          const active = i === cfg.step - 1
          return (
            <View key={s} style={styles.stepItem}>
              <View style={[
                styles.stepDot,
                done && { backgroundColor: cfg.color + '25', borderColor: cfg.color },
                active && { shadowColor: cfg.color, shadowOpacity: 0.7, shadowRadius: 6, elevation: 6 },
              ]}>
                <Text style={{ fontSize: 11 }}>{done ? TRACK_ICONS[i] : (i + 1)}</Text>
              </View>
              <Text style={[styles.stepLabel, done && { color: cfg.color }]}>{s}</Text>
            </View>
          )
        })}
      </View>

      {/* Rating prompt for delivered */}
      {order.status === 'delivered' && (
        <View style={styles.ratePrompt}>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>How was your order?</Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <TouchableOpacity key={s}>
                <Text style={{ fontSize: 18, color: colors.neonGold }}>☆</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </Card>
  )
}

export default function OrdersScreen() {
  const { orders } = useStore()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.pageTitle}>MY ORDERS 📦</Text>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Total" value={orders.length} color={colors.neonPurple} />
          <View style={{ width: 10 }} />
          <StatCard label="In Transit" value={orders.filter(o => o.status === 'shipped').length} color={colors.neonCyan} />
          <View style={{ width: 10 }} />
          <StatCard label="Ready" value={orders.filter(o => o.status === 'repair-complete').length} color={colors.neonGreen} />
        </View>

        {/* Orders */}
        {orders.map(order => <OrderCard key={order.id} order={order} />)}

        {orders.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📭</Text>
            <Text style={{ color: colors.textMuted, fontWeight: '700', letterSpacing: 1 }}>NO ORDERS YET</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgVoid },
  pageTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', letterSpacing: 1.5, padding: spacing.lg, paddingBottom: spacing.sm },
  scroll: { flex: 1, paddingHorizontal: spacing.lg },
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
  orderCard: { marginBottom: spacing.md },
  orderHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  orderId: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  orderItem: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  orderDate: { color: colors.textMuted, fontSize: 11 },
  etaBox: { alignItems: 'flex-end' },
  etaLabel: { color: colors.textMuted, fontSize: 10, marginBottom: 2 },
  etaValue: { fontSize: 14, fontWeight: '900' },
  progressWrap: { height: 3, backgroundColor: colors.border, borderRadius: 2, marginBottom: 14, position: 'relative', overflow: 'hidden' },
  progressBg: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.border },
  progressFill: { height: 3, borderRadius: 2 },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.bgDeep, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 5,
  },
  stepLabel: { color: colors.textMuted, fontSize: 8, textAlign: 'center', fontWeight: '700', letterSpacing: 0.3 },
  ratePrompt: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.md, padding: 12,
    backgroundColor: 'rgba(255,215,0,0.06)', borderRadius: radius.sm,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.15)',
  },
  empty: { alignItems: 'center', padding: spacing.xxl },
})
