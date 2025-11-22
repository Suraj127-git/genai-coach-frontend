import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientHeader, GlassCard } from '../components/ui'

export default function History() {
  const items = [
    { title: 'Technical Interview - Medium', date: '1/15/2025', duration: '45 min', score: 85 },
    { title: 'Behavioral Interview - Medium', date: '1/10/2025', duration: '30 min', score: 78 },
    { title: 'Mixed Interview - Hard', date: '1/5/2025', duration: '60 min', score: 92 },
  ]

  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 bg-background'>
        <ScrollView>
          <GradientHeader height={160} />
          <View className='px-4' style={{ marginTop: -130 }}>
            <Text className='text-center text-xl font-bold'>Interview History</Text>
            <Text className='text-center mt-1 text-muted'>Review your past interviews and track your progress</Text>
          </View>

          <View className='flex-row justify-between px-4 mt-4'>
            <GlassCard style={{ width: '32%' }}>
              <View className='items-center'>
                <Text className='text-lg font-semibold'>3</Text>
                <Text className='text-muted'>Total</Text>
              </View>
            </GlassCard>
            <GlassCard style={{ width: '32%' }}>
              <View className='items-center'>
                <Text className='text-primary-600 text-lg font-semibold'>85%</Text>
                <Text className='text-muted'>Average</Text>
              </View>
            </GlassCard>
            <GlassCard style={{ width: '32%' }}>
              <View className='items-center'>
                <Text className='text-green-600 text-lg font-semibold'>+12%</Text>
                <Text className='text-muted'>Improvement</Text>
              </View>
            </GlassCard>
          </View>

          <View className='px-4'>
          {items.map((it, idx) => (
            <GlassCard key={idx} style={{ marginTop: 12 }}>
              <View className='flex-row items-center'>
                <Image source={require('../assets/split_icon_3.png')} className='w-10 h-10 mr-3' />
                <View className='flex-1'>
                  <Text className='font-semibold'>{it.title}</Text>
                  <Text className='text-muted'>{it.date} • {it.duration}</Text>
                  <Button variant='link' onPress={() => {}} className='mt-1'><ButtonText>View Details</ButtonText></Button>
                </View>
                <View className='items-center w-16'>
                  <Text className='text-primary-600 text-lg font-semibold'>{it.score}</Text>
                  <Text className='text-muted'>Score</Text>
                </View>
              </View>
            </GlassCard>
          ))}
          </View>
        </ScrollView>
      </Box>
      </SafeAreaView>
  )
}