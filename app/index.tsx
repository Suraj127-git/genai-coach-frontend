import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppSelector } from '../store/hooks'
import { Alert } from 'react-native'
import { Box, Text, Button, ButtonText, Spinner } from '@gluestack-ui/themed'
import { Image, ScrollView, View, InteractionManager } from 'react-native'
import { enableDailyReminder } from '../utils/notifications'

export default function Home() {
  const user = useAppSelector(s => s.auth.user)
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [navigating, setNavigating] = useState(false)

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
      <Box style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size='large' />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32, alignItems: 'center' }}>
            <Image source={require('../assets/app-img-1.png')} style={{ width: '100%', height: 240, marginTop: 12, marginBottom: 20, borderRadius: 16 }} resizeMode='cover' />
            <Box style={{ width: '100%', borderRadius: 16, padding: 16, backgroundColor: '#FFFFFF' }}>
              <Text style={{ marginBottom: 12, textAlign: 'center', fontSize: 20, fontWeight: '600' }}>AI Mock Interview Coach</Text>
              <Link href="/(auth)/login" asChild>
                <Button style={{ borderRadius: 24 }}><ButtonText>Login</ButtonText></Button>
              </Link>
              <Link href="/(auth)/register" asChild>
                <Button style={{ marginTop: 8, borderRadius: 24 }} variant='outline'><ButtonText>Register</ButtonText></Button>
              </Link>
            </Box>
          </ScrollView>
        </Box>
    )
  }

  const onEnableReminders = async () => {
    const ok = await enableDailyReminder()
    Alert.alert(ok ? 'Reminders enabled' : 'Permission denied')
  }

  return (
    <Box style={{ flex: 1 }}>
      <Box style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={{ height: 220 }}>
            <View style={{ flex: 1, backgroundColor: '#1D4ED8', paddingHorizontal: 16, paddingTop: 24, justifyContent: 'center' }}>
              <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 24, fontWeight: '700' }}>AI Mock Interview Coach</Text>
              <Text style={{ color: '#E0F2FE', textAlign: 'center', marginTop: 8 }}>Master your interviews with AI-powered practice sessions</Text>
              <View style={{ alignItems: 'center', marginTop: 16 }}>
                <Button style={{ borderRadius: 24 }} onPress={() => {
                  try {
                    setTimeout(() => router.push('/setup'), 0)
                  } catch {}
                }}><ButtonText>Start Interview</ButtonText></Button>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
            <Text style={{ textAlign: 'center', marginBottom: 16, fontSize: 18, fontWeight: '600' }}>Why Practice With Us?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <Box style={{ width: '48%', marginBottom: 12, borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <Image source={require('../assets/split_icon_1.png')} style={{ width: 56, height: 56, marginBottom: 8 }} />
                  <Text style={{ textAlign: 'center', fontWeight: '600' }}>AI-Powered Feedback</Text>
                  <Text style={{ textAlign: 'center', marginTop: 6, color: '#6B7280' }}>Get instant, personalized feedback.</Text>
                </View>
              </Box>
              <Box style={{ width: '48%', marginBottom: 12, borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <Image source={require('../assets/split_icon_2.png')} style={{ width: 56, height: 56, marginBottom: 8 }} />
                  <Text style={{ textAlign: 'center', fontWeight: '600' }}>Realistic Scenarios</Text>
                  <Text style={{ textAlign: 'center', marginTop: 6, color: '#6B7280' }}>Practice with real questions.</Text>
                </View>
              </Box>
              <Box style={{ width: '48%', marginBottom: 12, borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <Image source={require('../assets/split_icon_3.png')} style={{ width: 56, height: 56, marginBottom: 8 }} />
                  <Text style={{ textAlign: 'center', fontWeight: '600' }}>Track Progress</Text>
                  <Text style={{ textAlign: 'center', marginTop: 6, color: '#6B7280' }}>Monitor improvements over time.</Text>
                </View>
              </Box>
              <Box style={{ width: '48%', marginBottom: 12, borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <Image source={require('../assets/split_icon_4.png')} style={{ width: 56, height: 56, marginBottom: 8 }} />
                  <Text style={{ textAlign: 'center', fontWeight: '600' }}>Interview Tips</Text>
                  <Text style={{ textAlign: 'center', marginTop: 6, color: '#6B7280' }}>Access expert strategies.</Text>
                </View>
              </Box>
            </View>
          </View>

          <View style={{ alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 }}>
            <Button variant='link' onPress={onEnableReminders}><ButtonText>Enable Reminders</ButtonText></Button>
            <Button variant='outline' style={{ marginTop: 8 }} onPress={() => router.push('/profile')}><ButtonText>Profile</ButtonText></Button>
          </View>
        </ScrollView>
      </Box>
    </Box>
  )
}