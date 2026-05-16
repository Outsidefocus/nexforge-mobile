import { create } from 'zustand'

export const useStore = create((set, get) => ({
  user: {
    id: 1,
    name: 'GhostRider_X',
    avatar: '🎮',
    level: 42,
    rep: 4.9,
    credits: 2450,
    isLoggedIn: false,
  },

  notifications: [
    { id: 1, text: 'Your PS5 repair is ready for pickup!', time: '2m ago', read: false, type: 'repair' },
    { id: 2, text: 'New offer on your listing: $180', time: '1h ago', read: false, type: 'sale' },
    { id: 3, text: 'Design "NeonDragon" saved!', time: '3h ago', read: true, type: 'design' },
  ],

  cart: [
    { id: 1, name: 'PS5 DualSense — Arctic Frost', price: 89, qty: 1, img: '🎮', seller: 'FrostModz' },
    { id: 2, name: 'Xbox Elite — Obsidian', price: 145, qty: 1, img: '🕹️', seller: 'GearHaven' },
  ],

  orders: [
    { id: 'NXG-7291', status: 'shipped', item: 'Custom PS5 Controller', date: 'Apr 20', eta: 'Apr 28' },
    { id: 'NXG-6814', status: 'repair-complete', item: 'Xbox Series X — Fan Repair', date: 'Apr 22', eta: 'Ready' },
    { id: 'NXG-5502', status: 'processing', item: 'Switch OLED Skin Pack', date: 'Apr 25', eta: 'May 2' },
  ],

  products: [
    { id: 1, name: 'PS5 DualSense — Arctic Edition', price: 89, original: 120, seller: 'FrostModz', rating: 4.8, reviews: 24, category: 'controllers', condition: 'mint', img: '🎮', badge: 'HOT', color: '#00d4ff' },
    { id: 2, name: 'Xbox Series X Console', price: 420, original: 499, seller: 'GearHaven', rating: 4.6, reviews: 11, category: 'consoles', condition: 'good', img: '🕹️', badge: 'DEAL', color: '#00ff88' },
    { id: 3, name: 'Switch OLED — Neon Skins', price: 28, original: 40, seller: 'PixelWrap', rating: 4.9, reviews: 67, category: 'accessories', condition: 'new', img: '📱', badge: 'NEW', color: '#a855f7' },
    { id: 4, name: 'PS4 Elite Controller', price: 65, original: 80, seller: 'CyberMod', rating: 4.4, reviews: 8, category: 'controllers', condition: 'good', img: '🎮', badge: null, color: '#ff2d55' },
    { id: 5, name: 'HyperX Cloud Headset', price: 75, original: 99, seller: 'AudioFreak', rating: 4.7, reviews: 33, category: 'accessories', condition: 'mint', img: '🎧', badge: null, color: '#ffd700' },
    { id: 6, name: 'Nintendo Switch V2 Bundle', price: 195, original: 259, seller: 'RetroVault', rating: 4.5, reviews: 19, category: 'consoles', condition: 'good', img: '🎮', badge: 'RARE', color: '#ff2d55' },
  ],

  savedDesigns: [
    { id: 1, name: 'NeonDragon', device: 'PS5 Controller', colors: ['#ff2d55', '#0a0a1a'], date: 'Apr 24' },
    { id: 2, name: 'IceStorm', device: 'Xbox Controller', colors: ['#00d4ff', '#1a1a2e'], date: 'Apr 18' },
  ],

  customizer: {
    device: 'ps5',
    baseColor: '#1a0a2e',
    accentColor: '#ff2d55',
    buttonColor: '#00d4ff',
    ledColor: '#a855f7',
    ledEnabled: true,
    skin: 'carbon',
  },

  repairRequests: [
    { id: 'REP-441', device: 'PS4 Pro', issue: 'HDMI Port', status: 'in-progress', submitted: 'Apr 21' },
  ],

  login: (creds) => set(s => ({ user: { ...s.user, isLoggedIn: true, name: creds.username || 'Player_One' } })),
  logout: () => set(s => ({ user: { ...s.user, isLoggedIn: false } })),
  setCustomizer: (updates) => set(s => ({ customizer: { ...s.customizer, ...updates } })),
  addToCart: (item) => set(s => ({ cart: [...s.cart, { ...item, id: Date.now(), qty: 1 }] })),
  removeFromCart: (id) => set(s => ({ cart: s.cart.filter(i => i.id !== id) })),
  markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
}))
