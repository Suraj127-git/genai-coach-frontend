import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { GradientHeader, GlassCard } from '../components/ui'

export default function HomeAuth() {
  const router = useRouter()
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
    <Box className='flex-1 bg-background'>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <GradientHeader height={220} />
        <View className='px-4' style={{ marginTop: -180 }}>
          <Text className='text-center text-2xl font-bold'>AI Mock Interview Coach</Text>
          <Text className='text-center mt-2 text-muted'>Master your interviews with AI-powered practice sessions</Text>
          <View className='items-center mt-4'>
            <Button className='rounded-full' onPress={() => router.push('/setup')}><ButtonText>Start Interview</ButtonText></Button>
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
      </ScrollView>
    </Box>
    </SafeAreaView>
  )
}