import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View, Dimensions, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function OnboardingOne() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const win = Dimensions.get('window')
  const imgH = Math.max(180, Math.min(240, Math.round(win.height * 0.28)))
  return (
      <Box style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: Math.max(32, insets.top + 8), paddingBottom: Math.max(32, insets.bottom + 8), alignItems: 'center' }}>
          <Image source={require('../../assets/app-img-1.png')} style={{ width: '100%', height: imgH, marginTop: 8 }} resizeMode='contain' />
          <View style={{ marginTop: 16 }}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700' }}>Practice Interviews Smarter</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text style={{ textAlign: 'center', color: '#6B7280' }}>Get tailored questions and guidance to improve your interview performance.</Text>
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', right: 24, bottom: Math.max(24, insets.bottom + 12) }}>
          <Button style={{ width: 56, height: 56, borderRadius: 28 }} onPress={() => router.push('/onboarding/two')}>
            <ButtonText>→</ButtonText>
          </Button>
        </View>
      </Box>
  )
}