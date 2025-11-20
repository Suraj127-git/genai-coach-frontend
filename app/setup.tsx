import { useState } from 'react'
import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { Image, ScrollView, View } from 'react-native'
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
      <Box className='flex-1 bg-background'>
        <ScrollView contentContainerStyle={{}} className='px-4 pt-6'>
          <Image source={require('../assets/split_ai_scene_4.png')} resizeMode='contain' className='w-full h-48' />
          <Text className='text-center mt-3 text-2xl font-bold'>Setup Your Interview</Text>
          <Text className='text-center mt-1 text-muted'>Choose your interview type and difficulty level</Text>

          <Box className='mt-4 rounded-xl bg-surface p-3'>
            <Text className='font-semibold'>Interview Configuration</Text>
            <Text className='mt-1 text-muted'>Choose type and difficulty in a later step.</Text>
            <View className='mt-4'>
              <Button disabled={navigating} className='rounded-2xl' onPress={onStartAudio}><ButtonText>Start Audio Interview</ButtonText></Button>
              <Button disabled={navigating} className='rounded-2xl mt-2' onPress={onStartVideo}><ButtonText>Start Video Interview</ButtonText></Button>
            </View>
          </Box>
        </ScrollView>
      </Box>
  )
}