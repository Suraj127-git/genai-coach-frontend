import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Box, Text, Button, ButtonText, Input, InputField } from '@gluestack-ui/themed'
import { Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientHeader, GlassCard } from '../../components/ui'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { register, resetStatus } from '../../store/slices/authSlice'
import { useRouter } from 'expo-router'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.auth.status)
  const error = useAppSelector(s => s.auth.error)
  const router = useRouter()
  useEffect(() => { dispatch(resetStatus()) }, [])

  const onSubmit = async () => {
    const emailOk = /.+@.+\..+/.test(email)
    const passOk = password.length >= 6
    if (!emailOk) {
      Alert.alert('Invalid email')
      return
    }
    if (!passOk) {
      Alert.alert('Password must be at least 6 characters')
      return
    }
    console.log('[Register] Submitting registration with:', { email, name })
    const ok = await dispatch(register({ email, password, name }))
    console.log('[Register] Registration result:', ok)
    if (ok) {
      console.log('[Register] Success, navigating to home')
      router.replace('/(tabs)')
    } else {
      console.warn('[Register] Registration failed:', error)
      Alert.alert('Register failed', error || 'Unknown error')
    }
  }

  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 bg-background'>
        <ScrollView>
          <GradientHeader height={350} />
          <View className='px-4' style={{ marginTop: -160 }}>
            <Text className='text-center text-2xl font-bold'>Create an account</Text>
            <Text className='text-center mt-1 text-muted'>Join and start practicing</Text>
          </View>
          <View className='px-4 pt-6'>
            <GlassCard>
            <Text className='mb-3 text-lg font-semibold'>Create an account</Text>
            <Input className='mb-2 rounded-xl'>
              <InputField placeholder='Name' value={name} onChangeText={setName} />
            </Input>
            <Input className='mb-2 rounded-xl'>
              <InputField placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
            </Input>
            <Input className='mb-3 rounded-xl'>
              <InputField placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry />
            </Input>
            <Button className='rounded-full' disabled={status === 'loading'} onPress={onSubmit}><ButtonText>{status === 'loading' ? 'Loading...' : 'Sign up'}</ButtonText></Button>
            </GlassCard>
            <View className='items-center mt-3'>
              <Button variant='link' onPress={() => router.push('/(auth)/login')}>
                <ButtonText className='text-primary-600'>Already have an account? Login</ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      </Box>
      </SafeAreaView>
  )
}
