import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View, Dimensions, Image } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function OnboardingFive() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const win = Dimensions.get('window')
  const imgH = Math.max(180, Math.min(240, Math.round(win.height * 0.28)))
  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 bg-background'>
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} className='px-6 pt-8 pb-8'>
          <Image source={require('../../assets/split_ai_scene_3.png')} resizeMode='contain' style={{ height: imgH }} className='w-full mt-2' />
          <View className='mt-4'>
            <Text className='text-center text-xl font-bold'>Ready to Begin</Text>
          </View>
          <View className='mt-2'>
            <Text className='text-center text-muted'>Start practicing interviews with AI guidance now.</Text>
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', right: 24, bottom: Math.max(24, insets.bottom + 12) }}>
          <Button className='w-14 h-14 rounded-full' onPress={async () => { await AsyncStorage.setItem('onboarding_seen', 'true'); await AsyncStorage.removeItem('perm_skipped'); router.replace('/(auth)/login') }}>
            <ButtonText>→</ButtonText>
          </Button>
        </View>
      </Box>
      </SafeAreaView>
  )
}