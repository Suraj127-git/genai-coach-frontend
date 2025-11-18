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
      <Box style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32 }}>
          <Image source={require('../../assets/app-img-2.png')} style={{ width: '100%', height: 170, marginTop: 12, marginBottom: 20 }} resizeMode='contain' />
          <Box style={{ borderRadius: 16, padding: 16, backgroundColor: '#FFFFFF' }}>
            <Text style={{ marginBottom: 12, fontSize: 18, fontWeight: '600' }}>Create an account</Text>
            <Input style={{ marginBottom: 8, borderRadius: 12 }}>
              <InputField placeholder='Name' value={name} onChangeText={setName} />
            </Input>
            <Input style={{ marginBottom: 8, borderRadius: 12 }}>
              <InputField placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
            </Input>
            <Input style={{ marginBottom: 12, borderRadius: 12 }}>
              <InputField placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry />
            </Input>
            <Button style={{ borderRadius: 24 }} disabled={status === 'loading'} onPress={onSubmit}><ButtonText>{status === 'loading' ? 'Loading...' : 'Sign up'}</ButtonText></Button>
          </Box>
        </ScrollView>
      </Box>
  )
}