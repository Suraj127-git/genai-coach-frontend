import { useState } from 'react'
import { Alert } from 'react-native'
import { Box, Text, Button, ButtonText, Input, InputField } from '@gluestack-ui/themed'
import { Image, ScrollView } from 'react-native'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { register } from '../../store/slices/authSlice'
import { useRouter } from 'expo-router'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.auth.status)
  const error = useAppSelector(s => s.auth.error)
  const router = useRouter()

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
      router.replace('/')
    } else {
      console.warn('[Register] Registration failed:', error)
      Alert.alert('Register failed', error || 'Unknown error')
    }
  }

  return (
      <Box className='flex-1 bg-background'>
        <ScrollView className='px-4 pt-8'>
          <Image source={require('../../assets/app-img-2.png')} resizeMode='contain' className='w-full h-44 mt-3 mb-5' />
          <Box className='rounded-xl p-4 bg-surface'>
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
            <Button className='rounded-2xl' disabled={status === 'loading'} onPress={onSubmit}><ButtonText>{status === 'loading' ? 'Loading...' : 'Sign up'}</ButtonText></Button>
          </Box>
        </ScrollView>
      </Box>
  )
}