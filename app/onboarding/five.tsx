import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View, Dimensions, Image } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function OnboardingFive() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const win = Dimensions.get('window')
  const imgH = Math.max(250, Math.min(200, Math.round(Math.min(win.width, win.height) * 0.45)))
  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 bg-background'>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} className='px-6 pt-8 pb-8'>
          <View style={{ width: imgH, height: imgH, borderRadius: imgH/2, overflow: 'hidden' }} className='bg-surface items-center justify-center shadow'>
            <Image source={require('../../assets/split_ai_scene_3.png')} resizeMode='cover' style={{ width: '80%', height: '80%' }} />
          </View>
          <View className='mt-5 px-3'>
            <Text className='text-center text-2xl font-bold'>You're Ready To Begin</Text>
            <Text className='text-center mt-2 text-muted text-base'>Sign in to start your first practice session and unlock AI coaching.</Text>
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
