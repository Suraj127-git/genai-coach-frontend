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
      <Box style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32 }}>
          <Image source={require('../../assets/app-img-1.png')} style={{ width: '100%', height: 220, marginTop: 12, marginBottom: 20, borderRadius: 16 }} resizeMode='cover' />
          <Box style={{ borderRadius: 16, padding: 16, backgroundColor: '#FFFFFF' }}>
            <Text style={{ marginBottom: 12, fontSize: 18, fontWeight: '600' }}>Login</Text>
            <Input style={{ marginBottom: 8, borderRadius: 12 }}>
              <InputField placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
            </Input>
            <Input style={{ marginBottom: 12, borderRadius: 12 }}>
              <InputField placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry />
            </Input>
            <Button style={{ borderRadius: 24 }} disabled={status === 'loading'} onPress={onSubmit}><ButtonText>{status === 'loading' ? 'Loading...' : 'Login'}</ButtonText></Button>
          </Box>
        </ScrollView>
      </Box>
  )
}