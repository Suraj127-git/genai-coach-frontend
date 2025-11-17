import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withTiming, withSpring, withRepeat, Easing } from 'react-native-reanimated'
import { Layout, Text, Button } from '@ui-kitten/components'
import { ScrollView, View, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function OnboardingFive() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const win = Dimensions.get('window')
  const imgH = Math.max(180, Math.min(240, Math.round(win.height * 0.28)))
  const imgScale = useSharedValue(0.9)
  const imgOpacity = useSharedValue(0)
  const titleOpacity = useSharedValue(0)
  const titleTranslateY = useSharedValue(12)
  const hintOpacity = useSharedValue(0)
  const hintTranslateY = useSharedValue(12)
  const btnScale = useSharedValue(0.9)
  const btnOpacity = useSharedValue(0)
  const pulse = useSharedValue(1)

  const imgStyle = useAnimatedStyle(() => ({ transform: [{ scale: imgScale.value }], opacity: imgOpacity.value }))
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value, transform: [{ translateY: titleTranslateY.value }] }))
  const hintStyle = useAnimatedStyle(() => ({ opacity: hintOpacity.value, transform: [{ translateY: hintTranslateY.value }] }))
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value * pulse.value }], opacity: btnOpacity.value }))

  useEffect(() => {
    imgScale.value = withSpring(1, { damping: 14 })
    imgOpacity.value = withTiming(1, { duration: 350 })
    titleOpacity.value = withTiming(1, { duration: 500 })
    titleTranslateY.value = withTiming(0, { duration: 500 })
    hintOpacity.value = withTiming(1, { duration: 650 })
    hintTranslateY.value = withTiming(0, { duration: 650 })
    btnScale.value = withSpring(1, { damping: 12 })
    btnOpacity.value = withTiming(1, { duration: 700 })
    pulse.value = withRepeat(withTiming(1.06, { duration: 800, easing: Easing.inOut(Easing.quad) }), -1, true)
  }, [])
  return (
    <Animated.View style={{ flex: 1 }} entering={FadeInUp}>
      <Layout style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: Math.max(32, insets.top + 8), paddingBottom: Math.max(32, insets.bottom + 8), alignItems: 'center' }}>
          <Animated.Image source={require('../../assets/split_ai_scene_3.png')} style={[{ width: '100%', height: imgH, marginTop: 8 }, imgStyle]} resizeMode='contain' />
          <Animated.View style={[{ marginTop: 16 }, titleStyle]}>
            <Text category='h4' style={{ textAlign: 'center' }}>Ready to Begin</Text>
          </Animated.View>
          <Animated.View style={[{ marginTop: 8 }, hintStyle]}>
            <Text appearance='hint' style={{ textAlign: 'center' }}>Start practicing interviews with AI guidance now.</Text>
          </Animated.View>
        </ScrollView>
        <View style={{ position: 'absolute', right: 24, bottom: Math.max(24, insets.bottom + 12) }}>
          <Animated.View style={btnStyle}>
            <Button style={{ width: 56, height: 56, borderRadius: 28 }} onPress={async () => { await AsyncStorage.setItem('onboarding_seen', 'true'); await AsyncStorage.removeItem('perm_skipped'); router.replace('/') }}>→</Button>
          </Animated.View>
        </View>
      </Layout>
    </Animated.View>
  )
}