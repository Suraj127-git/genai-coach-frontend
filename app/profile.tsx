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
      <Box className='flex-1 items-center justify-center bg-background'>
        <Text className='text-lg font-semibold'>{user?.name}</Text>
        <Text className='mt-1 text-muted'>{user?.email}</Text>
        <Button disabled={status === 'loading'} className='mt-3 rounded-2xl' onPress={async () => { const ok = await dispatch(logoutAsync()); if (ok) router.replace('/(auth)/login') }}>
          <ButtonText>{status === 'loading' ? 'Logging out...' : 'Logout'}</ButtonText>
        </Button>
      </Box>
  )
}