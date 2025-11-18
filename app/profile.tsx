import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutAsync } from '../store/slices/authSlice'
import { useRouter } from 'expo-router'

export default function Profile() {
  const user = useAppSelector(s => s.auth.user)
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.auth.status)
  const router = useRouter()
  return (
      <Box style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{user?.name}</Text>
        <Text style={{ marginTop: 4, color: '#6B7280' }}>{user?.email}</Text>
        <Button disabled={status === 'loading'} style={{ marginTop: 12, borderRadius: 24 }} onPress={async () => { const ok = await dispatch(logoutAsync()); if (ok) router.replace('/(auth)/login') }}>
          <ButtonText>{status === 'loading' ? 'Logging out...' : 'Logout'}</ButtonText>
        </Button>
      </Box>
  )
}