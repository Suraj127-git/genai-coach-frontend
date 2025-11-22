import { Tabs } from 'expo-router'
import { Image } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2563EB',
      tabBarInactiveTintColor: '#6B7280',
      tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB', position: 'absolute', marginHorizontal: 12, marginBottom: 12, borderRadius: 24, height: 64 },
      tabBarLabelStyle: { paddingBottom: 8 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => (<Image source={require('../../assets/split_icon_1.png')} style={{ width: 22, height: 22, tintColor: color }} />) }} />
      <Tabs.Screen name="interview" options={{ title: 'Interview', tabBarIcon: ({ color }) => (<Image source={require('../../assets/split_icon_2.png')} style={{ width: 22, height: 22, tintColor: color }} />) }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: ({ color }) => (<Image source={require('../../assets/split_icon_3.png')} style={{ width: 22, height: 22, tintColor: color }} />) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => (<Image source={require('../../assets/icon-foreground.png')} style={{ width: 22, height: 22, tintColor: color }} />) }} />
    </Tabs>
  )
}