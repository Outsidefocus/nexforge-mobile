import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../theme'
import { Button } from '../components/UI'
import { useStore } from '../store'

const TYPE_CFG = {
  repair: { icon: '🔧', color: colors.neonPink },
  sale:   { icon: '💰', color: colors.neonGreen },
  design: { icon: '🎨', color: colors.neonPurple },
  order:  { icon: '📦', color: colors.neonCyan },
}

export default function NotificationsScreen() {
  const { notifications, markAllRead } = useStore()
  const unread = notifications.filter(n => !n.read).length

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>NOTIFICATIONS</Text>
        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={{ color: colors.neonPurple, fontSize: 12, fontWeight: '600' }}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {unread > 0 && (
          <Text style={styles.sectionLabel}>{unread} UNREAD</Text>
        )}
        {notifications.map(n => {
          const cfg = TYPE_CFG[n.type] || TYPE_CFG.order
          return (
            <TouchableOpacity
              key={n.id}
              style={[styles.notifCard, !n.read && styles.notifCardUnread]}
              activeOpacity={0.8}
            >
              <View style={[styles.notifIcon, { backgroundColor: cfg.color + '20' }]}>
                <Text style={{ fontSize: 20 }}>{cfg.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifText}>{n.text}</Text>
                <Text style={styles.notifTime}>{n.time}</Text>
              </View>
              {!n.read && <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />}
            </TouchableOpacity>
          )
        })}

        {notifications.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔔</Text>
            <Text style={{ color: colors.textMuted, fontWeight: '700', letterSpacing: 1 }}>ALL CLEAR</Text>
          </View>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgVoid },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, paddingBottom: spacing.sm },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', letterSpacing: 1.5 },
  scroll: { flex: 1, paddingHorizontal: spacing.lg },
  sectionLabel: { color: colors.neonPurple, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: spacing.sm, marginTop: 4 },
  notifCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: radius.md,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    marginBottom: 10,
  },
  notifCardUnread: { backgroundColor: 'rgba(168,85,247,0.06)', borderColor: colors.borderBright },
  notifIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notifText: { color: colors.textPrimary, fontSize: 13, lineHeight: 18, marginBottom: 3 },
  notifTime: { color: colors.textMuted, fontSize: 11 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
})
