import { useState } from 'react'
import { Alert } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Layout, Input, Button, Text, Card } from '@ui-kitten/components'
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
    <Animated.View style={{ flex: 1 }} entering={FadeInUp}>
      <Layout style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32 }}>
          <Image source={require('../../assets/app-img-2.png')} style={{ width: '100%', height: 170, marginTop: 12, marginBottom: 20 }} resizeMode='contain' />
          <Card style={{ borderRadius: 16 }}>
            <Text category='h5' style={{ marginBottom: 12 }}>Create an account</Text>
            <Input placeholder='Name' value={name} onChangeText={setName} style={{ marginBottom: 8, borderRadius: 12 }} />
            <Input placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' style={{ marginBottom: 8, borderRadius: 12 }} />
            <Input placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 12, borderRadius: 12 }} />
            <Button style={{ borderRadius: 24 }} disabled={status === 'loading'} onPress={onSubmit}>{status === 'loading' ? 'Loading...' : 'Sign up'}</Button>
          </Card>
        </ScrollView>
      </Layout>
    </Animated.View>
  )
}