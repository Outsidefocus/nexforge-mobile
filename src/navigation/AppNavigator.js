import React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import { colors, radius } from '../theme'
import { useStore } from '../store'

import AuthScreen from '../screens/AuthScreen'
import DashboardScreen from '../screens/DashboardScreen'
import MarketplaceScreen from '../screens/MarketplaceScreen'
import RepairScreen from '../screens/RepairScreen'
import CustomizerScreen from '../screens/CustomizerScreen'
import CartScreen from '../screens/CartScreen'
import OrdersScreen from '../screens/OrdersScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const TAB_CONFIG = [
  { name: 'Home',        screen: DashboardScreen,   icon: '⚡', activeIcon: '⚡', color: colors.neonPurple },
  { name: 'Marketplace', screen: MarketplaceScreen,  icon: '🛍',  activeIcon: '🛍', color: colors.neonCyan   },
  { name: 'Repair',      screen: RepairScreen,       icon: '🔧', activeIcon: '🔧', color: colors.neonPink   },
  { name: 'Customizer',  screen: CustomizerScreen,   icon: '🎨', activeIcon: '🎨', color: colors.neonGreen  },
  { name: 'Profile',     screen: ProfileScreen,      icon: '👤', activeIcon: '👤', color: colors.neonGold   },
]

function TabIcon({ icon, focused, color, name }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      <Text style={{
        fontSize: 20,
        opacity: focused ? 1 : 0.45,
        transform: [{ scale: focused ? 1.1 : 1 }],
      }}>
        {icon}
      </Text>
      {focused && (
        <View style={{
          width: 4, height: 4, borderRadius: 2,
          backgroundColor: color,
          marginTop: 3,
          shadowColor: color,
          shadowOpacity: 1, shadowRadius: 4,
        }} />
      )}
    </View>
  )
}

function MainTabs() {
  const cart = useStore(s => s.cart)
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgPanel,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      {TAB_CONFIG.map(({ name, screen, icon, color }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={screen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icon} focused={focused} color={color} name={name} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  )
}

function AppStack() {
  const user = useStore(s => s.user)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user.isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Orders" component={OrdersScreen} options={{ presentation: 'card' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ presentation: 'card' }} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  )
}
