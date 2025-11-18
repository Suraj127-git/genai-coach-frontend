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
      <Box style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
          <Image source={require('../assets/split_ai_scene_4.png')} style={{ width: '100%', height: 180 }} resizeMode='contain' />
          <Text style={{ textAlign: 'center', marginTop: 12, fontSize: 20, fontWeight: '700' }}>Setup Your Interview</Text>
          <Text style={{ textAlign: 'center', marginTop: 4, color: '#6B7280' }}>Choose your interview type and difficulty level</Text>

          <Box style={{ marginTop: 16, borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
            <Text style={{ fontWeight: '600' }}>Interview Configuration</Text>
            <Text style={{ marginTop: 6, color: '#6B7280' }}>Choose type and difficulty in a later step.</Text>
            <View style={{ marginTop: 16 }}>
              <Button disabled={navigating} style={{ borderRadius: 24 }} onPress={onStartAudio}><ButtonText>Start Audio Interview</ButtonText></Button>
              <Button disabled={navigating} style={{ borderRadius: 24, marginTop: 8 }} onPress={onStartVideo}><ButtonText>Start Video Interview</ButtonText></Button>
            </View>
          </Box>
        </ScrollView>
      </Box>
  )
}