import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { View, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientHeader, GlassCard } from '../components/ui'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutAsync } from '../store/slices/authSlice'
import { useRouter } from 'expo-router'

export default function Profile() {
  const user = useAppSelector(s => s.auth.user)
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.auth.status)
  const router = useRouter()
  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 bg-background'>
        <ScrollView>
          <GradientHeader height={160} />
          <View className='px-4' style={{ marginTop: -120 }}>
            <GlassCard>
              <View className='flex-row items-center'>
                <Image source={require('../assets/icon-foreground.png')} className='w-12 h-12 mr-3' />
                <View className='flex-1'>
                  <Text className='text-lg font-semibold'>{user?.name || 'Guest'}</Text>
                  <Text className='text-muted'>{user?.email || 'Not signed in'}</Text>
                </View>
              </View>
              <Button disabled={status === 'loading'} className='mt-3 rounded-full' onPress={async () => { const ok = await dispatch(logoutAsync()); if (ok) router.replace('/(auth)/login') }}>
                <ButtonText>{status === 'loading' ? 'Logging out...' : 'Logout'}</ButtonText>
              </Button>
            </GlassCard>
          </View>
        </ScrollView>
      </Box>
      </SafeAreaView>
  )
}