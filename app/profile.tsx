import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { View, Image, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientHeader, GlassCard } from '../components/ui'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutAsync, updateProfile } from '../store/slices/authSlice'
import { useRouter } from 'expo-router'
import { Input, InputField } from '@gluestack-ui/themed'
import { useState } from 'react'

export default function Profile() {
  const user = useAppSelector(s => s.auth.user)
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.auth.status)
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false as boolean)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 bg-background'>
        <ScrollView>
          <GradientHeader height={160} />
          <View className='px-4' style={{ marginTop: -120 }}>
            <GlassCard>
              <View className='flex-row items-center'>
                <Image source={require('../assets/icon-foreground.png')} className='w-12 h-12 mr-3' />
                <View className='flex-1'>
                  <Text className='text-lg font-semibold'>{user?.name || 'Guest'}</Text>
                  <Text className='text-muted'>{user?.email || 'Not signed in'}</Text>
                </View>
              </View>
              <Button className='mt-3 rounded-full' variant='outline' onPress={() => { setName(user?.name || ''); setEmail(user?.email || ''); setShowEdit(true) }}>
                <ButtonText>Edit Profile</ButtonText>
              </Button>
              <Button disabled={status === 'loading'} className='mt-3 rounded-full' onPress={async () => { const ok = await dispatch(logoutAsync()); if (ok) router.replace('/(auth)/login') }}>
                <ButtonText>{status === 'loading' ? 'Logging out...' : 'Logout'}</ButtonText>
              </Button>
            </GlassCard>
          </View>
        </ScrollView>
        {showEdit && (
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.35)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
            <View style={{ width: '100%' }}>
              <GlassCard>
                <Text className='text-lg font-semibold'>Update Account</Text>
                <Input className='mt-3 rounded-xl'>
                  <InputField placeholder='Name' value={name} onChangeText={setName} />
                </Input>
                <Input className='mt-2 rounded-xl'>
                  <InputField placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
                </Input>
                <Input className='mt-2 rounded-xl'>
                  <InputField placeholder='Current Password' value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
                </Input>
                <Input className='mt-2 rounded-xl'>
                  <InputField placeholder='New Password' value={newPassword} onChangeText={setNewPassword} secureTextEntry />
                </Input>
                <View className='flex-row mt-3 justify-between'>
                  <Button variant='outline' className='rounded-full flex-1 mr-2' onPress={() => setShowEdit(false)}>
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button disabled={status === 'loading'} className='rounded-full flex-1 ml-2' onPress={async () => {
                    const ok = await dispatch(updateProfile({ name, email, currentPassword, newPassword }))
                    if (ok) { setShowEdit(false) } else { Alert.alert('Update failed') }
                  }}>
                    <ButtonText>{status === 'loading' ? 'Saving...' : 'Save'}</ButtonText>
                  </Button>
                </View>
              </GlassCard>
            </View>
          </View>
        )}
      </Box>
      </SafeAreaView>
  )
}
