import Animated, { FadeInUp } from 'react-native-reanimated'
import { Layout, Text, Button } from '@ui-kitten/components'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutAsync } from '../store/slices/authSlice'
import { useRouter } from 'expo-router'

export default function Profile() {
  const user = useAppSelector(s => s.auth.user)
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.auth.status)
  const router = useRouter()
  return (
    <Animated.View style={{ flex: 1 }} entering={FadeInUp}>
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text category='h6'>{user?.name}</Text>
        <Text appearance='hint' style={{ marginTop: 4 }}>{user?.email}</Text>
        <Button disabled={status === 'loading'} style={{ marginTop: 12, borderRadius: 24 }} onPress={async () => { const ok = await dispatch(logoutAsync()); if (ok) router.replace('/(auth)/login') }}>
          {status === 'loading' ? 'Logging out...' : 'Logout'}
        </Button>
      </Layout>
    </Animated.View>
  )
}