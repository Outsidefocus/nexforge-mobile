import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { colors, radius, spacing } from '../theme'

// ── NeonText ──────────────────────────────────────────────────────────────────
export function NeonText({ children, color = colors.neonPurple, size = 14, weight = '700', style, ...props }) {
  return (
    <Text style={[{ color, fontSize: size, fontWeight: weight, letterSpacing: 0.5 }, style]} {...props}>
      {children}
    </Text>
  )
}

// ── DisplayText ───────────────────────────────────────────────────────────────
export function DisplayText({ children, size = 22, color = colors.textPrimary, style, ...props }) {
  return (
    <Text style={[{ color, fontSize: size, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase' }, style]} {...props}>
      {children}
    </Text>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style, glow, ...props }) {
  const glowColors = {
    pink: { borderColor: colors.neonPink, shadowColor: colors.neonPink },
    cyan: { borderColor: colors.neonCyan, shadowColor: colors.neonCyan },
    purple: { borderColor: colors.neonPurple, shadowColor: colors.neonPurple },
  }
  const glowStyle = glow ? {
    ...glowColors[glow],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  } : {}

  return (
    <View style={[styles.card, glowStyle, style]} {...props}>
      {children}
    </View>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', onPress, style, textStyle, disabled, size = 'md' }) {
  const variantStyles = {
    primary: { bg: colors.neonPink, textColor: '#fff', shadowColor: colors.neonPink },
    cyan: { bg: colors.neonCyan, textColor: '#000', shadowColor: colors.neonCyan },
    purple: { bg: colors.neonPurple, textColor: '#fff', shadowColor: colors.neonPurple },
    ghost: { bg: 'transparent', textColor: colors.textSecondary, shadowColor: 'transparent', borderColor: colors.borderBright },
    dark: { bg: colors.bgCard, textColor: colors.textSecondary, shadowColor: 'transparent', borderColor: colors.border },
  }
  const sizeStyles = {
    sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 10 },
    md: { paddingVertical: 11, paddingHorizontal: 20, fontSize: 11 },
    lg: { paddingVertical: 15, paddingHorizontal: 28, fontSize: 13 },
  }
  const v = variantStyles[variant]
  const s = sizeStyles[size]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[{
        backgroundColor: v.bg,
        paddingVertical: s.paddingVertical,
        paddingHorizontal: s.paddingHorizontal,
        borderRadius: radius.md,
        borderWidth: v.borderColor ? 1 : 0,
        borderColor: v.borderColor || 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: v.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: disabled ? 0 : 0.35,
        shadowRadius: 10,
        elevation: disabled ? 0 : 6,
        opacity: disabled ? 0.5 : 1,
      }, style]}
    >
      <Text style={[{
        color: v.textColor,
        fontSize: s.fontSize,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
      }, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ label, variant = 'purple', style }) {
  const variants = {
    pink: { bg: 'rgba(255,45,85,0.15)', color: colors.neonPink, border: 'rgba(255,45,85,0.3)' },
    cyan: { bg: 'rgba(0,212,255,0.15)', color: colors.neonCyan, border: 'rgba(0,212,255,0.3)' },
    purple: { bg: 'rgba(168,85,247,0.15)', color: colors.neonPurple, border: 'rgba(168,85,247,0.3)' },
    green: { bg: 'rgba(0,255,136,0.15)', color: colors.neonGreen, border: 'rgba(0,255,136,0.3)' },
    gold: { bg: 'rgba(255,215,0,0.15)', color: colors.neonGold, border: 'rgba(255,215,0,0.3)' },
  }
  const v = variants[variant] || variants.purple
  return (
    <View style={[{ backgroundColor: v.bg, borderWidth: 1, borderColor: v.border, borderRadius: radius.sm, paddingHorizontal: 7, paddingVertical: 2 }, style]}>
      <Text style={{ color: v.color, fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</Text>
    </View>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ style }) {
  return <View style={[{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }, style]} />
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color }) {
  return (
    <Card style={{ flex: 1 }}>
      <Text style={{ fontSize: 10, color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</Text>
      <Text style={{ fontSize: 24, fontWeight: '900', color, marginBottom: 2 }}>{value}</Text>
      {sub ? <Text style={{ fontSize: 10, color: colors.textMuted }}>{sub}</Text> : null}
    </Card>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function Toggle({ value, onChange, color = colors.neonPurple }) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      activeOpacity={0.8}
      style={{
        width: 44, height: 24,
        backgroundColor: value ? color : colors.bgDeep,
        borderRadius: 12,
        borderWidth: 1, borderColor: value ? color : colors.borderBright,
        justifyContent: 'center',
        paddingHorizontal: 2,
      }}
    >
      <View style={{
        width: 18, height: 18,
        backgroundColor: '#fff',
        borderRadius: 9,
        transform: [{ translateX: value ? 20 : 0 }],
      }} />
    </TouchableOpacity>
  )
}

// ── StarRating ────────────────────────────────────────────────────────────────
export function StarRating({ rating, reviews }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Text style={{ color: colors.neonGold, fontSize: 11 }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</Text>
      <Text style={{ color: colors.neonGold, fontSize: 11, fontWeight: '700' }}>{rating}</Text>
      {reviews ? <Text style={{ color: colors.textMuted, fontSize: 10 }}>({reviews})</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
})
