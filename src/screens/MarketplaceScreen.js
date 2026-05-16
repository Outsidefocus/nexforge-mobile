import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../theme'
import { Card, Badge, Button, StarRating } from '../components/UI'
import { useStore } from '../store'

const CATEGORIES = ['All', 'Consoles', 'Controllers', 'Accessories']

function ProductCard({ product, onAddToCart }) {
  const [liked, setLiked] = useState(false)
  const discount = Math.round((1 - product.price / product.original) * 100)

  return (
    <Card style={styles.productCard}>
      {/* Badge */}
      {product.badge && (
        <View style={styles.productBadgeWrap}>
          <View style={[styles.productBadge, { backgroundColor: product.color + '25', borderColor: product.color + '60' }]}>
            <Text style={[styles.productBadgeText, { color: product.color }]}>{product.badge}</Text>
          </View>
        </View>
      )}

      {/* Like */}
      <TouchableOpacity style={styles.likeBtn} onPress={() => setLiked(l => !l)}>
        <Text style={{ fontSize: 16 }}>{liked ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>

      {/* Image area */}
      <View style={[styles.imgArea, { backgroundColor: product.color + '15' }]}>
        <Text style={{ fontSize: 44 }}>{product.img}</Text>
      </View>

      {/* Info */}
      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.sellerName}>by <Text style={{ color: product.color }}>{product.seller}</Text></Text>

      <View style={styles.ratingRow}>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <Badge label={product.condition} variant="green" />
      </View>

      {/* Price row */}
      <View style={styles.priceRow}>
        <View>
          <Text style={[styles.price, { color: product.color }]}>${product.price}</Text>
          <Text style={styles.originalPrice}>${product.original}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={[styles.discountBadge]}>
            <Text style={{ color: colors.neonGreen, fontSize: 9, fontWeight: '700' }}>-{discount}%</Text>
          </View>
          <TouchableOpacity
            style={[styles.cartBtn, { backgroundColor: product.color + '20', borderColor: product.color + '50' }]}
            onPress={() => onAddToCart(product)}
          >
            <Text style={{ fontSize: 16 }}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  )
}

export default function MarketplaceScreen({ navigation }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('price')
  const { products, addToCart } = useStore()

  const filtered = products.filter(p => {
    const matchQ = p.name.toLowerCase().includes(query.toLowerCase()) || p.seller.toLowerCase().includes(query.toLowerCase())
    const matchC = activeCategory === 'All' || p.category === activeCategory.toLowerCase()
    return matchQ && matchC
  }).sort((a, b) => sortBy === 'price' ? a.price - b.price : b.rating - a.rating)

  const handleAddToCart = (product) => {
    addToCart(product)
    navigation.navigate('Cart')
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.title}>MARKETPLACE</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={{ fontSize: 22 }}>🛒</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search gear, sellers..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={{ color: colors.textMuted, fontSize: 16, marginRight: 4 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.catPill, activeCategory === c && styles.catPillActive]}
            onPress={() => setActiveCategory(c)}
          >
            <Text style={[styles.catText, activeCategory === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.catPill, sortBy === 'rating' && styles.catPillCyan]}
          onPress={() => setSortBy(s => s === 'price' ? 'rating' : 'price')}
        >
          <Text style={[styles.catText, { color: colors.neonCyan }]}>
            {sortBy === 'price' ? '↑ Price' : '↓ Rating'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results count */}
      <Text style={styles.resultCount}>{filtered.length} items found</Text>

      {/* Product list */}
      <FlatList
        data={filtered}
        keyExtractor={i => String(i.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 100, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProductCard product={item} onAddToCart={handleAddToCart} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
            <Text style={{ color: colors.textMuted, fontWeight: '700', letterSpacing: 1 }}>NO ITEMS FOUND</Text>
          </View>
        }
        ListFooterComponent={
          <Card style={styles.sellCta}>
            <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>💰</Text>
            <Text style={styles.sellTitle}>Got gear to sell?</Text>
            <Text style={styles.sellSub}>List your gaming equipment and reach thousands of buyers</Text>
            <Button variant="cyan" size="sm" style={{ marginTop: 12, alignSelf: 'center' }}>LIST YOUR ITEM</Button>
          </Card>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgVoid },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.borderBright,
    borderRadius: radius.md, marginHorizontal: spacing.lg, paddingHorizontal: 12,
    marginBottom: spacing.md,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14, paddingVertical: 11 },
  catScroll: { marginBottom: 6 },
  catPill: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.borderBright,
    backgroundColor: colors.bgCard,
  },
  catPillActive: { backgroundColor: 'rgba(168,85,247,0.15)', borderColor: colors.neonPurple },
  catPillCyan: { borderColor: colors.neonCyan, backgroundColor: 'rgba(0,212,255,0.1)' },
  catText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  catTextActive: { color: colors.neonPurple },
  resultCount: { color: colors.textMuted, fontSize: 11, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  productCard: { flex: 1, padding: 12, position: 'relative' },
  productBadgeWrap: { position: 'absolute', top: 10, left: 10, zIndex: 2 },
  productBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  productBadgeText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  likeBtn: { position: 'absolute', top: 10, right: 10, zIndex: 2 },
  imgArea: { height: 90, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  productName: { color: colors.textPrimary, fontSize: 12, fontWeight: '700', marginBottom: 3, lineHeight: 16 },
  sellerName: { color: colors.textMuted, fontSize: 11, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '900' },
  originalPrice: { color: colors.textMuted, fontSize: 10, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: 'rgba(0,255,136,0.1)', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  cartBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', padding: spacing.xxl },
  sellCta: { alignItems: 'center', marginTop: spacing.lg },
  sellTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  sellSub: { color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
})
