import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../theme'
import { Card, Badge, Button } from '../components/UI'
import { useStore } from '../store'

const DEVICES = [
  { id: 'ps5', label: 'PlayStation 5', icon: '🎮' },
  { id: 'ps4', label: 'PlayStation 4', icon: '🎮' },
  { id: 'xbox-sx', label: 'Xbox Series X', icon: '🕹️' },
  { id: 'xbox-one', label: 'Xbox One', icon: '🕹️' },
  { id: 'switch', label: 'Nintendo Switch', icon: '📱' },
  { id: 'controller', label: 'Controller Only', icon: '🎮' },
]

const ISSUES = [
  { id: 'hdmi', label: 'HDMI Port', icon: '📺', price: 45, time: '2-3 days' },
  { id: 'fan', label: 'Fan / Overheating', icon: '🌡️', price: 55, time: '1-2 days' },
  { id: 'disc', label: 'Disc Drive', icon: '💿', price: 80, time: '3-5 days' },
  { id: 'drift', label: 'Stick Drift', icon: '🕹️', price: 30, time: '1-2 days' },
  { id: 'button', label: 'Button Repair', icon: '🔘', price: 25, time: '1 day' },
  { id: 'power', label: 'Power Issue', icon: '⚡', price: 65, time: '2-4 days' },
  { id: 'battery', label: 'Battery Replace', icon: '🔋', price: 35, time: '1-2 days' },
  { id: 'other', label: 'Diagnostic Only', icon: '🔍', price: 20, time: '1 day' },
]

const TRACKER_STEPS = ['Received', 'Diagnosed', 'In Repair', 'Complete']

function RepairTracker({ request }) {
  const stepIdx = request.status === 'in-progress' ? 2 : request.status === 'complete' ? 3 : 1
  return (
    <Card glow="pink" style={{ marginBottom: spacing.md }}>
      <View style={styles.trackerHeader}>
        <View>
          <Text style={styles.trackerId}>#{request.id}</Text>
          <Text style={styles.trackerDevice}>{request.device} — {request.issue}</Text>
          <Text style={styles.trackerDate}>Submitted: {request.submitted}</Text>
        </View>
        <Badge label="IN PROGRESS" variant="pink" />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((stepIdx) / 3) * 100}%` }]} />
      </View>

      {/* Step dots */}
      <View style={styles.stepsRow}>
        {TRACKER_STEPS.map((step, i) => {
          const done = i <= stepIdx
          const active = i === stepIdx
          return (
            <View key={step} style={styles.stepItem}>
              <View style={[
                styles.stepDot,
                done && styles.stepDotDone,
                active && styles.stepDotActive,
              ]}>
                <Text style={{ fontSize: active ? 10 : 8 }}>{done ? '✓' : (i + 1)}</Text>
              </View>
              <Text style={[styles.stepLabel, done && { color: colors.neonCyan }]}>{step}</Text>
            </View>
          )
        })}
      </View>
    </Card>
  )
}

export default function RepairScreen() {
  const { repairRequests } = useStore()
  const [step, setStep] = useState(1)
  const [device, setDevice] = useState(null)
  const [issue, setIssue] = useState(null)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const selectedIssue = ISSUES.find(i => i.id === issue)
  const selectedDevice = DEVICES.find(d => d.id === device)

  const handleSubmit = () => {
    if (!device || !issue) return
    setSubmitted(true)
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>REPAIR SERVICE 🔧</Text>
        <Text style={styles.pageSub}>Professional repairs with 90-day warranty</Text>

        {/* Active repairs */}
        {repairRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVE REPAIRS</Text>
            {repairRequests.map(r => <RepairTracker key={r.id} request={r} />)}
          </View>
        )}

        {/* New request wizard */}
        <Text style={styles.sectionTitle}>NEW REPAIR REQUEST</Text>

        {/* Step indicators */}
        <View style={styles.wizardSteps}>
          {['Device', 'Issue', 'Submit'].map((s, i) => (
            <React.Fragment key={s}>
              <TouchableOpacity onPress={() => step > i + 1 && setStep(i + 1)}>
                <View style={[styles.wizardStep, step === i + 1 && styles.wizardStepActive, step > i + 1 && styles.wizardStepDone]}>
                  <Text style={[styles.wizardStepText, step >= i + 1 && { color: '#fff' }]}>
                    {step > i + 1 ? '✓' : `${i + 1}. ${s}`}
                  </Text>
                </View>
              </TouchableOpacity>
              {i < 2 && <View style={[styles.wizardLine, step > i + 1 && { backgroundColor: colors.neonPink }]} />}
            </React.Fragment>
          ))}
        </View>

        {submitted ? (
          <Card style={styles.successCard}>
            <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>✅</Text>
            <Text style={styles.successTitle}>REQUEST SUBMITTED!</Text>
            <Text style={styles.successId}>Repair ID: <Text style={{ color: colors.neonCyan }}>REP-{Math.floor(Math.random() * 900) + 100}</Text></Text>
            <Text style={styles.successEta}>Est. time: <Text style={{ color: colors.textPrimary }}>{selectedIssue?.time}</Text></Text>
            <Text style={styles.successEta}>Est. cost: <Text style={{ color: colors.neonCyan }}>from ${selectedIssue?.price}</Text></Text>
            <Button variant="ghost" style={{ marginTop: spacing.lg }}
              onPress={() => { setSubmitted(false); setStep(1); setDevice(null); setIssue(null); setNotes('') }}>
              Submit Another
            </Button>
          </Card>
        ) : step === 1 ? (
          <Card glow="pink" style={{ marginBottom: spacing.md }}>
            <Text style={styles.stepQuestion}>WHAT DEVICE NEEDS REPAIR?</Text>
            <View style={styles.deviceGrid}>
              {DEVICES.map(d => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.deviceBtn, device === d.id && styles.deviceBtnActive]}
                  onPress={() => setDevice(d.id)}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{d.icon}</Text>
                  <Text style={[styles.deviceLabel, device === d.id && { color: colors.neonPink }]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button onPress={() => setStep(2)} disabled={!device} style={{ marginTop: spacing.md }}>
              NEXT →
            </Button>
          </Card>
        ) : step === 2 ? (
          <Card glow="pink" style={{ marginBottom: spacing.md }}>
            <Text style={styles.stepQuestion}>WHAT'S THE ISSUE?</Text>
            {ISSUES.map(iss => (
              <TouchableOpacity
                key={iss.id}
                style={[styles.issueRow, issue === iss.id && styles.issueRowActive]}
                onPress={() => setIssue(iss.id)}
                activeOpacity={0.75}
              >
                <Text style={{ fontSize: 22, width: 32 }}>{iss.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.issueName, issue === iss.id && { color: colors.neonPink }]}>{iss.label}</Text>
                  <Text style={styles.issueDetail}>from ${iss.price} · {iss.time}</Text>
                </View>
                {issue === iss.id && <Text style={{ color: colors.neonPink }}>✓</Text>}
              </TouchableOpacity>
            ))}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <Button variant="ghost" onPress={() => setStep(1)} style={{ flex: 1 }}>← BACK</Button>
              <Button onPress={() => setStep(3)} disabled={!issue} style={{ flex: 2 }}>NEXT →</Button>
            </View>
          </Card>
        ) : (
          <Card glow="pink" style={{ marginBottom: spacing.md }}>
            <Text style={styles.stepQuestion}>ADDITIONAL DETAILS</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Describe the issue in detail... (optional)"
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Summary */}
            <Card style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Device</Text>
                <Text style={styles.summaryVal}>{selectedDevice?.label}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Issue</Text>
                <Text style={styles.summaryVal}>{selectedIssue?.label}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Est. Cost</Text>
                <Text style={[styles.summaryVal, { color: colors.neonCyan }]}>from ${selectedIssue?.price}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Turnaround</Text>
                <Text style={[styles.summaryVal, { color: colors.neonGreen }]}>{selectedIssue?.time}</Text>
              </View>
            </Card>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <Button variant="ghost" onPress={() => setStep(2)} style={{ flex: 1 }}>← BACK</Button>
              <Button onPress={handleSubmit} style={{ flex: 2 }}>SUBMIT REQUEST</Button>
            </View>
          </Card>
        )}

        {/* Why us */}
        <Card style={[styles.whyCard, { marginBottom: 100 }]}>
          <Text style={[styles.sectionTitle, { color: colors.neonPurple, marginBottom: spacing.md }]}>WHY NEXFORGE REPAIRS</Text>
          {['90-day repair warranty', 'Certified technicians', 'OEM parts only', 'Real-time status updates', 'Free return shipping'].map((item, i, arr) => (
            <View key={item} style={[styles.whyRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={{ color: colors.neonGreen }}>✓</Text>
              <Text style={styles.whyText}>{item}</Text>
            </View>
          ))}
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
  section: { marginBottom: spacing.lg },
  sectionTitle: { color: colors.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.sm },
  trackerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  trackerId: { color: colors.neonCyan, fontSize: 11, fontWeight: '700', marginBottom: 2 },
  trackerDevice: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  trackerDate: { color: colors.textMuted, fontSize: 11 },
  progressTrack: { height: 3, backgroundColor: colors.border, borderRadius: 2, marginBottom: 12 },
  progressFill: { height: 3, backgroundColor: colors.neonCyan, borderRadius: 2, shadowColor: colors.neonCyan, shadowOpacity: 0.6, shadowRadius: 4 },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepDotDone: { backgroundColor: 'rgba(0,212,255,0.15)', borderColor: colors.neonCyan },
  stepDotActive: { backgroundColor: colors.neonCyan, borderColor: colors.neonCyan },
  stepLabel: { color: colors.textMuted, fontSize: 9, textAlign: 'center', fontWeight: '600' },
  wizardSteps: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  wizardStep: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border },
  wizardStepActive: { backgroundColor: 'rgba(255,45,85,0.15)', borderColor: colors.neonPink },
  wizardStepDone: { backgroundColor: 'rgba(0,255,136,0.1)', borderColor: colors.neonGreen },
  wizardStepText: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  wizardLine: { flex: 1, height: 1, backgroundColor: colors.border },
  stepQuestion: { color: colors.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: spacing.md, textTransform: 'uppercase' },
  deviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  deviceBtn: { width: '30%', padding: 12, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center' },
  deviceBtnActive: { backgroundColor: 'rgba(255,45,85,0.1)', borderColor: colors.neonPink },
  deviceLabel: { color: colors.textSecondary, fontSize: 9, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  issueRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, marginBottom: 8 },
  issueRowActive: { backgroundColor: 'rgba(255,45,85,0.08)', borderColor: colors.neonPink },
  issueName: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  issueDetail: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  notesInput: { backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.borderBright, borderRadius: radius.md, padding: 12, color: colors.textPrimary, fontSize: 14, minHeight: 100, marginBottom: spacing.md },
  summary: { backgroundColor: colors.bgDeep },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryKey: { color: colors.textMuted, fontSize: 12 },
  summaryVal: { color: colors.textPrimary, fontSize: 12, fontWeight: '600' },
  successCard: { alignItems: 'center', padding: spacing.xl },
  successTitle: { color: colors.neonGreen, fontSize: 18, fontWeight: '900', letterSpacing: 1, marginBottom: 12 },
  successId: { color: colors.textSecondary, fontSize: 13, marginBottom: 8 },
  successEta: { color: colors.textSecondary, fontSize: 13, marginBottom: 4 },
  whyCard: {},
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  whyText: { color: colors.textSecondary, fontSize: 13 },
})
