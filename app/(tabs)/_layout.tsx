import { Tabs } from 'expo-router'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function MyTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets()
  const { width } = Dimensions.get('window')
  const iconSize = Math.max(22, Math.min(28, Math.round(width / 16)))
  return (
    <View
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: Math.max(8, insets.bottom + 8),
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 28,
        height: 64,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name)
        }
        const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key })
        const color = focused ? '#2563EB' : '#6B7280'
        const iconName = (() => {
          switch (route.name) {
            case 'index': return focused ? 'home' : 'home-outline'
            case 'interview': return focused ? 'mic' : 'mic-outline'
            case 'history': return focused ? 'time' : 'time-outline'
            case 'profile': return focused ? 'person-circle' : 'person-circle-outline'
            default: return focused ? 'ellipse' : 'ellipse-outline'
          }
        })()
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={{ backgroundColor: focused ? '#E0F2FE' : 'transparent', borderRadius: 16, padding: 8 }}>
              <Ionicons name={iconName as any} size={iconSize} color={color} />
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <MyTabBar {...props} /> }>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="interview"
        options={{ title: 'Interview' }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'History' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  )
}
