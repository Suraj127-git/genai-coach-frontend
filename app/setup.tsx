import { useState } from 'react'
import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientHeader, GlassCard } from '../components/ui'
import { useRouter } from 'expo-router'
import { } from 'react-native'

export default function Setup() {
  const router = useRouter()
  const [navigating, setNavigating] = useState(false)

  const onStartAudio = () => {
    if (navigating) return
    setNavigating(true)
    setTimeout(() => { router.replace('/session'); setNavigating(false) }, 0)
  }

  const onStartVideo = () => {
    if (navigating) return
    setNavigating(true)
    setTimeout(() => { router.replace('/video'); setNavigating(false) }, 0)
  }

  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 bg-background'>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <GradientHeader height={180} />
          <View className='px-4' style={{ marginTop: -150 }}>
            <Text className='text-center text-2xl font-bold'>Setup Your Interview</Text>
            <Text className='text-center mt-1 text-muted'>Choose your interview type and difficulty level</Text>
          </View>

          <View className='px-4 pt-4'>
            <GlassCard>
              <Text className='font-semibold'>Interview Configuration</Text>
              <Text className='mt-1 text-muted'>Choose type and difficulty in a later step.</Text>
              <View className='mt-4'>
                <Button disabled={navigating} className='rounded-full' onPress={onStartAudio}><ButtonText>Start Audio Interview</ButtonText></Button>
                <Button disabled={navigating} className='rounded-full mt-2' onPress={onStartVideo}><ButtonText>Start Video Interview</ButtonText></Button>
              </View>
            </GlassCard>
          </View>
        </ScrollView>
      </Box>
      </SafeAreaView>
  )
}