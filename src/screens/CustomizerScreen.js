import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path, Circle, Rect, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg'
import { colors, spacing, radius } from '../theme'
import { Card, Button, Toggle, Badge } from '../components/UI'
import { useStore } from '../store'

const DEVICES = [
  { id: 'ps5', label: 'PS5', icon: '🎮' },
  { id: 'xbox', label: 'Xbox', icon: '🕹️' },
  { id: 'switch', label: 'Switch', icon: '📱' },
]

const SKINS = ['None', 'Carbon', 'Metal', 'Matte', 'Glossy']
const GRIPS = ['Standard', 'Rubberized', 'Textured', 'Ergonomic']

const PRESET_COLORS = [
  '#ff2d55', '#ff6b35', '#ffd700',
  '#00ff88', '#00d4ff', '#a855f7',
  '#1a0a2e', '#0a1a2e', '#0a2e1a',
  '#ffffff', '#888888', '#000000',
]

function ControllerSVG({ cfg }) {
  return (
    <Svg width="280" height="180" viewBox="0 0 320 210">
      <Defs>
        <RadialGradient id="bodyG" cx="50%" cy="40%" r="60%">
          <Stop offset="0%" stopColor={cfg.baseColor} stopOpacity="1" />
          <Stop offset="100%" stopColor={cfg.baseColor} stopOpacity="0.65" />
        </RadialGradient>
      </Defs>
      {/* Body */}
      <Path d="M 70 80 Q 60 40 100 35 L 220 35 Q 260 40 250 80 L 260 140 Q 265 175 230 185 L 200 185 Q 185 185 175 170 L 160 160 L 145 170 Q 135 185 120 185 L 90 185 Q 55 175 60 140 Z"
        fill="url(#bodyG)" stroke={cfg.accentColor} strokeWidth="1.5" opacity="0.95" />
      {/* Grips */}
      <Ellipse cx="88" cy="168" rx="28" ry="18" fill={cfg.baseColor} opacity="0.8" stroke={cfg.accentColor} strokeWidth="1" />
      <Ellipse cx="232" cy="168" rx="28" ry="18" fill={cfg.baseColor} opacity="0.8" stroke={cfg.accentColor} strokeWidth="1" />
      {/* Left stick */}
      <Circle cx="110" cy="120" r="18" fill={cfg.buttonColor} opacity="0.85" />
      <Circle cx="110" cy="120" r="10" fill={cfg.buttonColor} opacity="0.5" />
      <Circle cx="110" cy="120" r="4" fill="rgba(0,0,0,0.4)" />
      {/* Right stick */}
      <Circle cx="185" cy="135" r="16" fill={cfg.buttonColor} opacity="0.85" />
      <Circle cx="185" cy="135" r="9" fill={cfg.buttonColor} opacity="0.5" />
      <Circle cx="185" cy="135" r="4" fill="rgba(0,0,0,0.4)" />
      {/* D-pad */}
      <Rect x="130" y="132" width="8" height="24" rx="3" fill={cfg.buttonColor} opacity="0.85" />
      <Rect x="122" y="140" width="24" height="8" rx="3" fill={cfg.buttonColor} opacity="0.85" />
      {/* ABXY buttons */}
      <Circle cx="218" cy="90" r="9" fill="#00d4ff" opacity="0.9" />
      <Circle cx="229" cy="101" r="9" fill="#ff2d55" opacity="0.9" />
      <Circle cx="218" cy="112" r="9" fill="#ffd700" opacity="0.9" />
      <Circle cx="207" cy="101" r="9" fill="#00ff88" opacity="0.9" />
      {/* Bumpers */}
      <Rect x="74" y="43" width="52" height="14" rx="7" fill={cfg.accentColor} opacity="0.75" />
      <Rect x="194" y="43" width="52" height="14" rx="7" fill={cfg.accentColor} opacity="0.75" />
      {/* Center */}
      <Rect x="149" y="76" width="24" height="16" rx="5" fill={cfg.accentColor} opacity="0.65" />
      <Circle cx="162" cy="62" r="7" fill={cfg.accentColor} opacity="0.5" />
      {/* LED */}
      {cfg.ledEnabled && (
        <Rect x="132" y="196" width="56" height="5" rx="2.5" fill={cfg.ledColor} opacity="0.95" />
      )}
    </Svg>
  )
}

function ColorRow({ label, value, onChange }) {
  return (
    <View style={styles.colorRow}>
      <Text style={styles.colorLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {PRESET_COLORS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.swatch, { backgroundColor: c }, value === c && styles.swatchActive]}
            onPress={() => onChange(c)}
          />
        ))}
        {/* Custom hex input */}
        <View style={[styles.swatchInput, { borderColor: value && !PRESET_COLORS.includes(value) ? value : colors.borderBright }]}>
          <TextInput
            style={{ color: colors.textPrimary, fontSize: 9, width: 52, textAlign: 'center' }}
            value={value}
            onChangeText={onChange}
            maxLength={7}
            autoCapitalize="none"
            placeholder="#hex"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default function CustomizerScreen() {
  const { customizer, setCustomizer, savedDesigns } = useStore()
  const [saveName, setSaveName] = useState('')
  const [saved, setSaved] = useState(false)
  const cfg = customizer

  const handleSave = () => {
    if (!saveName.trim()) { Alert.alert('Name required', 'Please enter a name for your design'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setSaveName('')
  }

  const handleReset = () => setCustomizer({
    device: 'ps5', baseColor: '#1a0a2e', accentColor: '#ff2d55',
    buttonColor: '#00d4ff', ledColor: '#a855f7', ledEnabled: true, skin: 'carbon',
  })

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>CUSTOMIZER 🎨</Text>
        <Text style={styles.pageSub}>Design your dream controller in real-time</Text>

        {/* Device selector */}
        <View style={styles.deviceRow}>
          {DEVICES.map(d => (
            <TouchableOpacity
              key={d.id}
              style={[styles.deviceBtn, cfg.device === d.id && styles.deviceBtnActive]}
              onPress={() => setCustomizer({ device: d.id })}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 20, marginBottom: 2 }}>{d.icon}</Text>
              <Text style={[styles.deviceLabel, cfg.device === d.id && { color: colors.neonGreen }]}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live preview */}
        <Card glow="purple" style={styles.previewCard}>
          {/* Glow bg */}
          <View style={[styles.previewGlow, { backgroundColor: cfg.baseColor }]} />
          <View style={{ alignItems: 'center' }}>
            <ControllerSVG cfg={cfg} />
          </View>
          {/* Color dots */}
          <View style={styles.colorDots}>
            {[
              { label: 'Base', val: cfg.baseColor },
              { label: 'Accent', val: cfg.accentColor },
              { label: 'Buttons', val: cfg.buttonColor },
              ...(cfg.ledEnabled ? [{ label: 'LED', val: cfg.ledColor }] : []),
            ].map(c => (
              <View key={c.label} style={styles.colorDot}>
                <View style={[styles.dotCircle, { backgroundColor: c.val }]} />
                <Text style={styles.dotLabel}>{c.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Color controls */}
        <Card style={[styles.section, styles.colorSection]}>
          <Text style={[styles.sectionTitle, { color: colors.neonPurple }]}>🎨 COLORS</Text>
          <ColorRow label="Base Body" value={cfg.baseColor} onChange={v => setCustomizer({ baseColor: v })} />
          <View style={styles.divider} />
          <ColorRow label="Accent / Trim" value={cfg.accentColor} onChange={v => setCustomizer({ accentColor: v })} />
          <View style={styles.divider} />
          <ColorRow label="Buttons" value={cfg.buttonColor} onChange={v => setCustomizer({ buttonColor: v })} />
        </Card>

        {/* LED */}
        <Card style={styles.section}>
          <View style={styles.ledHeader}>
            <Text style={[styles.sectionTitle, { color: colors.neonCyan }]}>💡 LED STRIP</Text>
            <Toggle value={cfg.ledEnabled} onChange={v => setCustomizer({ ledEnabled: v })} color={colors.neonPurple} />
          </View>
          {cfg.ledEnabled && (
            <ColorRow label="LED Color" value={cfg.ledColor} onChange={v => setCustomizer({ ledColor: v })} />
          )}
        </Card>

        {/* Skin */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neonPink }]}>✨ SKIN TEXTURE</Text>
          <View style={styles.chipRow}>
            {SKINS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, cfg.skin === s.toLowerCase() && styles.chipActive]}
                onPress={() => setCustomizer({ skin: s.toLowerCase() })}
              >
                <Text style={[styles.chipText, cfg.skin === s.toLowerCase() && { color: '#fff' }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Grip */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neonGold }]}>✋ GRIP TYPE</Text>
          <View style={styles.chipRow}>
            {GRIPS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, styles.chipCyan, cfg.grip === g.toLowerCase() && styles.chipActiveCyan]}
                onPress={() => setCustomizer({ grip: g.toLowerCase() })}
              >
                <Text style={[styles.chipText, cfg.grip === g.toLowerCase() && { color: '#000' }]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Saved designs */}
        {savedDesigns.length > 0 && (
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.neonGreen }]}>💾 MY DESIGNS</Text>
            {savedDesigns.map(d => (
              <TouchableOpacity key={d.id} style={styles.savedDesign}
                onPress={() => setCustomizer({ baseColor: d.colors[0], accentColor: d.colors[1] })}>
                <View style={[styles.savedSwatch, { backgroundColor: d.colors[0] }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.savedName}>{d.name}</Text>
                  <Text style={styles.savedDevice}>{d.device} · {d.date}</Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>Load →</Text>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Save & actions */}
        <Card glow="purple" style={[styles.section, { marginBottom: 100 }]}>
          <Text style={[styles.sectionTitle, { color: colors.neonPurple }]}>💾 SAVE DESIGN</Text>
          <TextInput
            style={styles.saveInput}
            placeholder="Design name..."
            placeholderTextColor={colors.textMuted}
            value={saveName}
            onChangeText={setSaveName}
          />
          <View style={styles.actionBtns}>
            <Button variant="purple" onPress={handleSave} style={{ flex: 1 }}>
              {saved ? '✓ SAVED!' : '💾 SAVE'}
            </Button>
            <Button variant="ghost" onPress={handleReset} style={{ paddingHorizontal: 14 }}>↺</Button>
            <Button variant="ghost" style={{ paddingHorizontal: 14 }}>↑</Button>
          </View>
          <Button variant="primary" size="lg" style={{ marginTop: spacing.md }}>
            🛒 ORDER THIS — FROM $89
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgVoid },
  scroll: { flex: 1, padding: spacing.lg },
  pageTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
  pageSub: { color: colors.textMuted, fontSize: 12, marginBottom: spacing.lg },
  deviceRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.md },
  deviceBtn: { flex: 1, padding: 10, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center' },
  deviceBtnActive: { backgroundColor: 'rgba(0,255,136,0.1)', borderColor: colors.neonGreen },
  deviceLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '700' },
  previewCard: { marginBottom: spacing.md, overflow: 'hidden', alignItems: 'center' },
  previewGlow: { position: 'absolute', width: 200, height: 150, borderRadius: 100, opacity: 0.1, top: 20, alignSelf: 'center', transform: [{ scaleX: 1.5 }] },
  colorDots: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 8 },
  colorDot: { alignItems: 'center', gap: 4 },
  dotCircle: { width: 12, height: 12, borderRadius: 6 },
  dotLabel: { color: colors.textMuted, fontSize: 9 },
  section: { marginBottom: spacing.md },
  colorSection: {},
  sectionTitle: { color: colors.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: spacing.sm },
  colorRow: { marginBottom: 4 },
  colorLabel: { color: colors.textMuted, fontSize: 11, marginBottom: 7 },
  swatch: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: '#fff', transform: [{ scale: 1.15 }] },
  swatchInput: { width: 68, height: 28, borderRadius: 14, borderWidth: 1, justifyContent: 'center', backgroundColor: colors.bgDeep },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  ledHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.borderBright, backgroundColor: colors.bgDeep },
  chipActive: { backgroundColor: colors.neonPink, borderColor: colors.neonPink },
  chipCyan: {},
  chipActiveCyan: { backgroundColor: colors.neonCyan, borderColor: colors.neonCyan },
  chipText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  savedDesign: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: colors.bgDeep, borderRadius: radius.md, marginBottom: 8 },
  savedSwatch: { width: 36, height: 36, borderRadius: 8 },
  savedName: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  savedDevice: { color: colors.textMuted, fontSize: 11 },
  saveInput: { backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.borderBright, borderRadius: radius.md, padding: 12, color: colors.textPrimary, fontSize: 14, marginBottom: spacing.sm },
  actionBtns: { flexDirection: 'row', gap: 8 },
})
