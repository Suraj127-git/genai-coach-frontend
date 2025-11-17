import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppSelector } from '../store/hooks'
import { Alert } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Layout, Text, Button, Card, Spinner } from '@ui-kitten/components'
import { Image, ScrollView } from 'react-native'
import { enableDailyReminder } from '../utils/notifications'

export default function Home() {
  const user = useAppSelector(s => s.auth.user)
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const go = async () => {
      try {
        const seen = await AsyncStorage.getItem('onboarding_seen')
        if (seen !== 'true') {
          router.replace('/onboarding/one')
          return
        }
      } finally {
        setChecking(false)
      }
    }
    go()
  }, [])

  if (checking) {
    return (
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size='large' />
      </Layout>
    )
  }

  if (!user) {
    return (
      <Animated.View style={{ flex: 1 }} entering={FadeIn}>
        <Layout style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32, alignItems: 'center' }}>
            <Image source={require('../assets/app-img-1.png')} style={{ width: '100%', height: 240, marginTop: 12, marginBottom: 20, borderRadius: 16 }} resizeMode='cover' />
            <Card style={{ width: '100%', borderRadius: 16 }}>
              <Text category='h5' style={{ marginBottom: 12, textAlign: 'center' }}>AI Mock Interview Coach</Text>
              <Link href="/(auth)/login" asChild>
                <Button style={{ borderRadius: 24 }}>Login</Button>
              </Link>
              <Link href="/(auth)/register" asChild>
                <Button appearance='outline' style={{ marginTop: 8, borderRadius: 24 }}>Register</Button>
              </Link>
            </Card>
          </ScrollView>
        </Layout>
      </Animated.View>
    )
  }

  const onEnableReminders = async () => {
    const ok = await enableDailyReminder()
    Alert.alert(ok ? 'Reminders enabled' : 'Permission denied')
  }

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn}>
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text category='h6' style={{ marginBottom: 12 }}>Welcome {user.email}</Text>
        <Button onPress={() => router.push('/session')}>Start Practice</Button>
        <Button appearance='outline' style={{ marginTop: 8 }} onPress={() => router.push('/profile')}>Profile</Button>
        <Button appearance='ghost' style={{ marginTop: 8 }} onPress={onEnableReminders}>Enable Reminders</Button>
      </Layout>
    </Animated.View>
  )
}