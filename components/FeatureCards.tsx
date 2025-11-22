import { View, Image, Animated, Easing } from 'react-native'
import { Text } from '@gluestack-ui/themed'
import { useEffect, useRef } from 'react'
import { GlassCard } from './ui'

export function FeatureCards() {
  const v1 = useRef(new Animated.Value(0)).current
  const v2 = useRef(new Animated.Value(0)).current
  const v3 = useRef(new Animated.Value(0)).current
  const v4 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: true, delay }),
          Animated.timing(val, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      )
    loop(v1, 0).start()
    loop(v2, 200).start()
    loop(v3, 400).start()
    loop(v4, 600).start()
  }, [])

  return (
    <View>
      <Text className='text-center mb-4 text-lg font-semibold'>Why Practice With Us?</Text>
      <View className='flex-row flex-wrap justify-between'>
        <Animated.View style={{ width: '48%', marginBottom: 12, transform: [{ translateY: v1.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }] }}>
          <GlassCard>
            <View className='items-center'>
              <View className='w-14 h-14 mb-2 rounded-xl items-center justify-center bg-white'>
                <Image source={require('../assets/split_icon_1.png')} className='w-10 h-10' />
              </View>
              <Text className='text-center font-semibold'>AI-Powered Feedback</Text>
              <Text className='text-center mt-1 text-muted'>Get instant, personalized feedback.</Text>
            </View>
          </GlassCard>
        </Animated.View>
        <Animated.View style={{ width: '48%', marginBottom: 12, transform: [{ translateY: v2.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }] }}>
          <GlassCard>
            <View className='items-center'>
              <View className='w-14 h-14 mb-2 rounded-xl items-center justify-center bg-white'>
                <Image source={require('../assets/split_icon_2.png')} className='w-10 h-10' />
              </View>
              <Text className='text-center font-semibold'>Realistic Scenarios</Text>
              <Text className='text-center mt-1 text-muted'>Practice with real questions.</Text>
            </View>
          </GlassCard>
        </Animated.View>
        <Animated.View style={{ width: '48%', marginBottom: 12, transform: [{ translateY: v3.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }] }}>
          <GlassCard>
            <View className='items-center'>
              <View className='w-14 h-14 mb-2 rounded-xl items-center justify-center bg-white'>
                <Image source={require('../assets/split_icon_3.png')} className='w-10 h-10' />
              </View>
              <Text className='text-center font-semibold'>Track Progress</Text>
              <Text className='text-center mt-1 text-muted'>Monitor improvements over time.</Text>
            </View>
          </GlassCard>
        </Animated.View>
        <Animated.View style={{ width: '48%', marginBottom: 12, transform: [{ translateY: v4.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }] }}>
          <GlassCard>
            <View className='items-center'>
              <View className='w-14 h-14 mb-2 rounded-xl items-center justify-center bg-white'>
                <Image source={require('../assets/split_icon_4.png')} className='w-10 h-10' />
              </View>
              <Text className='text-center font-semibold'>Interview Tips</Text>
              <Text className='text-center mt-1 text-muted'>Access expert strategies.</Text>
            </View>
          </GlassCard>
        </Animated.View>
      </View>
    </View>
  )
}
