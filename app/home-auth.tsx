import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
 
import { FeatureCards } from '../components/FeatureCards'
import { Hero } from '../components/Hero'

export default function HomeAuth() {
  const router = useRouter()
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
    <Box className='flex-1 bg-background'>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Hero
          title='AI Mock Interview Coach'
          subtitle='Master your interviews with AI-powered practice sessions'
          ctaLabel='Start Interview'
          height={220}
          onCtaPress={() => router.push('/(tabs)/interview')}
        />

        <View className='px-4 pt-6'>
          <FeatureCards />
        </View>
      </ScrollView>
    </Box>
    </SafeAreaView>
  )
}
