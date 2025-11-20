import { useState } from 'react'
import { Alert } from 'react-native'
import { Box, Text, Button, ButtonText, Input, InputField } from '@gluestack-ui/themed'
import { Image, ScrollView } from 'react-native'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { login } from '../../store/slices/authSlice'
import { useRouter } from 'expo-router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.auth.status)
  const error = useAppSelector(s => s.auth.error)
  const router = useRouter()

  const onSubmit = async () => {
    const ok = await dispatch(login({ email, password }))
    if (ok) router.replace('/')
    else Alert.alert('Login failed', error || 'Unknown error')
  }

  return (
      <Box className='flex-1 bg-background'>
        <ScrollView className='px-4 pt-8'>
          <Image source={require('../../assets/app-img-1.png')} resizeMode='cover' className='w-full h-56 mt-3 mb-5 rounded-xl' />
          <Box className='rounded-xl p-4 bg-surface'>
            <Text className='mb-3 text-lg font-semibold'>Login</Text>
            <Input className='mb-2 rounded-xl'>
              <InputField placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
            </Input>
            <Input className='mb-3 rounded-xl'>
              <InputField placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry />
            </Input>
            <Button className='rounded-2xl' disabled={status === 'loading'} onPress={onSubmit}><ButtonText>{status === 'loading' ? 'Loading...' : 'Login'}</ButtonText></Button>
          </Box>
        </ScrollView>
      </Box>
  )
}