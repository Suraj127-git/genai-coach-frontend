import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppSelector } from '../store/hooks'
import { Alert } from 'react-native'
import { Box, Text, Button, ButtonText, Spinner } from '@gluestack-ui/themed'
import { Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
 
import { Hero } from '../components/Hero'
import { FeatureCards } from '../components/FeatureCards'
import { enableDailyReminder } from '../utils/notifications'

export default function Home() {
  const user = useAppSelector(s => s.auth.user)
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const go = async () => {
      try {
        const seen = await AsyncStorage.getItem('onboarding_seen')
        if (seen === 'true') {
          router.replace('/onboarding/one')
          return
        }
      } finally {
        setChecking(false)
      }
    }
    go()
  }, [])

  useEffect(() => {
    if (!checking && !user) {
      try {
        router.replace('/(auth)/login')
      } catch {}
    }
  }, [checking, user])

  if (checking) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
        <Box className='flex-1 items-center justify-center bg-background'>
          <Spinner size='large' />
        </Box>
      </SafeAreaView>
    )
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
        <Box className='flex-1 items-center justify-center bg-background'>
          <Spinner size='large' />
        </Box>
      </SafeAreaView>
    )
  }

  const onEnableReminders = async () => {
    const ok = await enableDailyReminder()
    Alert.alert(ok ? 'Reminders enabled' : 'Permission denied')
  }

  

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
    <Box className='flex-1 bg-background'>
      <Box className='flex-1'>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <Hero
            title='AI Mock Interview Coach'
            subtitle='Master your interviews with AI-powered practice sessions'
            ctaLabel='Start Interview'
            height={220}
            overlayOffset={140}
            onCtaPress={() => { try { setTimeout(() => router.push('/(tabs)/interview'), 0) } catch {} }}
          />
          <View className='px-4 pt-6'>
            <FeatureCards />
          </View>

          <View className='items-center px-4 pt-2'>
            <Button variant='link' onPress={onEnableReminders}><ButtonText>Enable Reminders</ButtonText></Button>
            <Button variant='outline' className='mt-2 rounded-full' onPress={() => router.push('/(tabs)/profile')}><ButtonText>Profile</ButtonText></Button>
          </View>
        </ScrollView>
      </Box>
    </Box>
    </SafeAreaView>
  )
}
