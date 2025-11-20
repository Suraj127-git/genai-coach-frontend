import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View, Dimensions, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function OnboardingThree() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const win = Dimensions.get('window')
  const imgH = Math.max(180, Math.min(240, Math.round(win.height * 0.28)))
  return (
      <Box className='flex-1 bg-background'>
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} className='px-6 pt-8 pb-8'>
          <Image source={require('../../assets/split_ai_scene_1.png')} resizeMode='contain' style={{ height: imgH }} className='w-full mt-2' />
          <View className='mt-4'>
            <Text className='text-center text-xl font-bold'>Start Your Journey</Text>
          </View>
          <View className='mt-2'>
            <Text className='text-center text-muted'>Build confidence with realistic practice sessions and continuous improvement.</Text>
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', right: 24, bottom: Math.max(24, insets.bottom + 12) }}>
          <Button className='w-14 h-14 rounded-full' onPress={() => router.push('/onboarding/four')}>
            <ButtonText>→</ButtonText>
          </Button>
        </View>
      </Box>
  )
}