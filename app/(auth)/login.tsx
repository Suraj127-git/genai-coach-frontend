import { useState } from 'react'
import { Alert } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Layout, Input, Button, Text, Card } from '@ui-kitten/components'
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
    <Animated.View style={{ flex: 1 }} entering={FadeInUp}>
      <Layout style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32 }}>
          <Image source={require('../../assets/app-img-1.png')} style={{ width: '100%', height: 220, marginTop: 12, marginBottom: 20, borderRadius: 16 }} resizeMode='cover' />
          <Card style={{ borderRadius: 16 }}>
            <Text category='h5' style={{ marginBottom: 12 }}>Login</Text>
            <Input placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' style={{ marginBottom: 8, borderRadius: 12 }} />
            <Input placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 12, borderRadius: 12 }} />
            <Button style={{ borderRadius: 24 }} disabled={status === 'loading'} onPress={onSubmit}>{status === 'loading' ? 'Loading...' : 'Login'}</Button>
          </Card>
        </ScrollView>
      </Layout>
    </Animated.View>
  )
}