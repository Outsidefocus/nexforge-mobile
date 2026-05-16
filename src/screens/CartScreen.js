import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../theme'
import { Card, Button, Badge } from '../components/UI'
import { useStore } from '../store'

const STEPS = ['Cart', 'Shipping', 'Payment']

function CartItem({ item, onRemove }) {
  return (
    <View style={styles.cartItem}>
      <View style={styles.cartImg}>
        <Text style={{ fontSize: 22 }}>{item.img}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cartName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cartSeller}>{item.seller}</Text>
        <View style={styles.cartQtyRow}>
          <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>−</Text></TouchableOpacity>
          <Text style={styles.qtyNum}>{item.qty}</Text>
          <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
        </View>
      </View>
      <View style={styles.cartRight}>
        <Text style={styles.cartPrice}>${item.price}</Text>
        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn}>
          <Text style={{ color: colors.neonPink, fontSize: 14 }}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function FieldGroup({ fields }) {
  return (
    <View style={styles.fieldGroup}>
      {fields.map(f => (
        <View key={f.label} style={[styles.fieldWrap, f.full && { width: '100%' }]}>
          <Text style={styles.fieldLabel}>{f.label}</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder={f.placeholder || f.label}
            placeholderTextColor={colors.textMuted}
            keyboardType={f.keyboard || 'default'}
            secureTextEntry={f.secure}
            autoCapitalize="none"
          />
        </View>
      ))}
    </View>
  )
}

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart } = useStore()
  const [step, setStep] = useState(1)
  const [ordered, setOrdered] = useState(false)

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + shipping

  if (ordered) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.successScreen}>
        <Text style={{ fontSize: 64, marginBottom: 20 }}>🎉</Text>
        <Text style={styles.successTitle}>ORDER CONFIRMED!</Text>
        <Text style={styles.successSub}>
          Order <Text style={{ color: colors.neonCyan }}>NXG-{Math.floor(Math.random() * 9000) + 1000}</Text>
        </Text>
        <Text style={styles.successEta}>Estimated delivery: 3–5 business days</Text>
        <Button variant="cyan" style={{ marginTop: spacing.xl }} onPress={() => navigation.navigate('Orders')}>
          TRACK ORDER
        </Button>
        <Button variant="ghost" style={{ marginTop: spacing.sm }} onPress={() => { setOrdered(false); setStep(1) }}>
          CONTINUE SHOPPING
        </Button>
      </View>
    </SafeAreaView>
  )

  if (cart.length === 0) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.emptyScreen}>
        <Text style={{ fontSize: 60, marginBottom: 16 }}>🛒</Text>
        <Text style={styles.emptyTitle}>YOUR CART IS EMPTY</Text>
        <Button style={{ marginTop: spacing.lg }} onPress={() => navigation.navigate('Marketplace')}>
          BROWSE MARKETPLACE
        </Button>
      </View>
    </SafeAreaView>
  )

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>CART 🛒</Text>
        <Badge label={`${cart.length} items`} variant="cyan" />
      </View>

      {/* Step tabs */}
      <View style={styles.stepRow}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <TouchableOpacity
              style={[styles.stepTab, step === i + 1 && styles.stepTabActive, step > i + 1 && styles.stepTabDone]}
              onPress={() => step > i + 1 && setStep(i + 1)}
            >
              <Text style={[styles.stepTabText, step >= i + 1 && { color: '#fff' }]}>
                {step > i + 1 ? '✓' : `${i + 1}`}. {s}
              </Text>
            </TouchableOpacity>
            {i < 2 && <View style={[styles.stepLine, step > i + 1 && { backgroundColor: colors.neonPurple }]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* STEP 1: Cart */}
        {step === 1 && (
          <Card style={{ marginBottom: spacing.md }}>
            {cart.map((item, i) => (
              <View key={item.id}>
                <CartItem item={item} onRemove={removeFromCart} />
                {i < cart.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card>
        )}

        {/* STEP 2: Shipping */}
        {step === 2 && (
          <Card glow="cyan" style={{ marginBottom: spacing.md }}>
            <Text style={styles.formTitle}>SHIPPING DETAILS</Text>
            <FieldGroup fields={[
              { label: 'FIRST NAME', placeholder: 'John', full: false },
              { label: 'LAST NAME', placeholder: 'Doe', full: false },
              { label: 'ADDRESS', placeholder: '123 Main St', full: true },
              { label: 'CITY', placeholder: 'New York', full: false },
              { label: 'POSTAL CODE', placeholder: '10001', keyboard: 'numeric', full: false },
              { label: 'COUNTRY', placeholder: 'United States', full: true },
              { label: 'PHONE', placeholder: '+1 555 0100', keyboard: 'phone-pad', full: true },
            ]} />
          </Card>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && (
          <Card glow="purple" style={{ marginBottom: spacing.md }}>
            <Text style={styles.formTitle}>PAYMENT METHOD</Text>
            <View style={styles.paymentTabs}>
              {['💳 Card', '₿ Crypto', '⚡ Credits'].map(p => (
                <TouchableOpacity key={p} style={styles.payTab}>
                  <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '600' }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <FieldGroup fields={[
              { label: 'CARD NUMBER', placeholder: '1234 5678 9012 3456', keyboard: 'numeric', full: true },
              { label: 'EXPIRY', placeholder: 'MM / YY', keyboard: 'numeric', full: false },
              { label: 'CVV', placeholder: '•••', keyboard: 'numeric', secure: true, full: false },
              { label: 'CARDHOLDER NAME', placeholder: 'John Doe', full: true },
            ]} />
          </Card>
        )}

        {/* Order summary */}
        <Card glow="cyan" style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryItem} numberOfLines={1}>{item.img} {item.name}</Text>
              <Text style={styles.summaryItemPrice}>${item.price}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={[styles.summaryVal, shipping === 0 && { color: colors.neonGreen }]}>
              {shipping === 0 ? 'FREE' : `$${shipping}`}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textPrimary, fontWeight: '800' }]}>Total</Text>
            <Text style={[styles.summaryVal, { color: colors.neonCyan, fontSize: 18, fontWeight: '900' }]}>${total.toFixed(2)}</Text>
          </View>
          {subtotal < 100 && (
            <View style={styles.freeShipBanner}>
              <Text style={{ color: colors.neonGreen, fontSize: 11 }}>
                ✓ Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
              </Text>
            </View>
          )}
        </Card>

        {/* Nav buttons */}
        <View style={styles.navBtns}>
          {step > 1 && (
            <Button variant="ghost" onPress={() => setStep(s => s - 1)} style={{ flex: 1 }}>← BACK</Button>
          )}
          {step < 3 ? (
            <Button onPress={() => setStep(s => s + 1)} style={{ flex: 2 }}>CONTINUE →</Button>
          ) : (
            <Button size="lg" onPress={() => setOrdered(true)} style={{ flex: 2 }}>
              🚀 PLACE ORDER — ${total.toFixed(2)}
            </Button>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgVoid },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  pageTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', letterSpacing: 1.5 },
  stepRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  stepTab: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border },
  stepTabActive: { backgroundColor: 'rgba(168,85,247,0.2)', borderColor: colors.neonPurple },
  stepTabDone: { backgroundColor: 'rgba(0,255,136,0.1)', borderColor: colors.neonGreen },
  stepTabText: { color: colors.textMuted, fontSize: 9, fontWeight: '800' },
  stepLine: { flex: 1, height: 1, backgroundColor: colors.border },
  scroll: { flex: 1, paddingHorizontal: spacing.lg },
  cartItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  cartImg: { width: 56, height: 56, backgroundColor: colors.bgDeep, borderRadius: 10, borderWidth: 1, borderColor: colors.borderBright, alignItems: 'center', justifyContent: 'center' },
  cartName: { color: colors.textPrimary, fontSize: 13, fontWeight: '600', flex: 1 },
  cartSeller: { color: colors.textMuted, fontSize: 11, marginTop: 2, marginBottom: 8 },
  cartQtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 24, height: 24, borderRadius: 6, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.borderBright, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' },
  qtyNum: { color: colors.textPrimary, fontWeight: '700', minWidth: 16, textAlign: 'center' },
  cartRight: { alignItems: 'flex-end', gap: 8 },
  cartPrice: { color: colors.neonCyan, fontSize: 15, fontWeight: '900' },
  removeBtn: { padding: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  formTitle: { color: colors.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: spacing.md, textTransform: 'uppercase' },
  fieldGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  fieldWrap: { width: '47%' },
  fieldLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 5, textTransform: 'uppercase' },
  fieldInput: { backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.borderBright, borderRadius: radius.md, padding: 11, color: colors.textPrimary, fontSize: 13 },
  paymentTabs: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  payTab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.borderBright, alignItems: 'center', backgroundColor: colors.bgDeep },
  summaryCard: {},
  summaryTitle: { color: colors.neonCyan, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  summaryItem: { color: colors.textSecondary, fontSize: 12, flex: 1, marginRight: 8 },
  summaryItemPrice: { color: colors.textSecondary, fontSize: 12 },
  summaryLabel: { color: colors.textMuted, fontSize: 13 },
  summaryVal: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  freeShipBanner: { marginTop: spacing.sm, padding: 10, backgroundColor: 'rgba(0,255,136,0.08)', borderRadius: radius.sm, borderWidth: 1, borderColor: 'rgba(0,255,136,0.2)' },
  navBtns: { flexDirection: 'row', gap: 10, marginTop: spacing.md },
  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  successTitle: { color: colors.neonGreen, fontSize: 22, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  successSub: { color: colors.textSecondary, fontSize: 14, marginBottom: 6 },
  successEta: { color: colors.textMuted, fontSize: 13 },
  emptyScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { color: colors.textSecondary, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
})
