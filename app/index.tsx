import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppSelector } from '../store/hooks'
import { Alert } from 'react-native'
import { Box, Text, Button, ButtonText, Spinner } from '@gluestack-ui/themed'
import { Image, ScrollView, View, InteractionManager } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientHeader, GlassCard, PillButton } from '../components/ui'
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
        if (seen == 'true') {
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
          <View>
            <GradientHeader height={220} />
            <View className='px-4 justify-center' style={{ marginTop: -180 }}>
              <Text className='text-center text-2xl font-bold'>AI Mock Interview Coach</Text>
              <Text className='text-center mt-2 text-muted'>Master your interviews with AI-powered practice sessions</Text>
              <View className='items-center mt-4'>
                <Button className='rounded-full' onPress={() => {
                  try {
                    setTimeout(() => router.push('/setup'), 0)
                  } catch {}
                }}><ButtonText>Start Interview</ButtonText></Button>
              </View>
            </View>
          </View>

          <View className='px-4 pt-6'>
            <Text className='text-center mb-4 text-lg font-semibold'>Why Practice With Us?</Text>
            <View className='flex-row flex-wrap justify-between'>
              <GlassCard style={{ width: '48%', marginBottom: 12 }}>
                <View className='items-center'>
                  <Image source={require('../assets/split_icon_1.png')} className='w-14 h-14 mb-2' />
                  <Text className='text-center font-semibold'>AI-Powered Feedback</Text>
                  <Text className='text-center mt-1 text-muted'>Get instant, personalized feedback.</Text>
                </View>
              </GlassCard>
              <GlassCard style={{ width: '48%', marginBottom: 12 }}>
                <View className='items-center'>
                  <Image source={require('../assets/split_icon_2.png')} className='w-14 h-14 mb-2' />
                  <Text className='text-center font-semibold'>Realistic Scenarios</Text>
                  <Text className='text-center mt-1 text-muted'>Practice with real questions.</Text>
                </View>
              </GlassCard>
              <GlassCard style={{ width: '48%', marginBottom: 12 }}>
                <View className='items-center'>
                  <Image source={require('../assets/split_icon_3.png')} className='w-14 h-14 mb-2' />
                  <Text className='text-center font-semibold'>Track Progress</Text>
                  <Text className='text-center mt-1 text-muted'>Monitor improvements over time.</Text>
                </View>
              </GlassCard>
              <GlassCard style={{ width: '48%', marginBottom: 12 }}>
                <View className='items-center'>
                  <Image source={require('../assets/split_icon_4.png')} className='w-14 h-14 mb-2' />
                  <Text className='text-center font-semibold'>Interview Tips</Text>
                  <Text className='text-center mt-1 text-muted'>Access expert strategies.</Text>
                </View>
              </GlassCard>
            </View>
          </View>

          <View className='items-center px-4 pt-2'>
            <Button variant='link' onPress={onEnableReminders}><ButtonText>Enable Reminders</ButtonText></Button>
            <Button variant='outline' className='mt-2 rounded-full' onPress={() => router.push('/profile')}><ButtonText>Profile</ButtonText></Button>
          </View>
        </ScrollView>
      </Box>
    </Box>
    </SafeAreaView>
  )
}
