import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { View, Image, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientHeader, GlassCard } from '../../components/ui'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logoutAsync, updateProfile } from '../../store/slices/authSlice'
import { useRouter } from 'expo-router'
import { Input, InputField } from '@gluestack-ui/themed'
import { useState } from 'react'

export default function Profile() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector(s => s.auth.user)
  const status = useAppSelector(s => s.auth.status)
  const [showEdit, setShowEdit] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
    <Box className='flex-1 bg-background'>
      <ScrollView>
        <GradientHeader height={180} />
        <View className='px-4' style={{ marginTop: -150 }}>
          <Text className='text-center text-2xl font-bold'>Your Profile</Text>
          <Text className='text-center mt-1 text-muted'>Manage your account settings and preferences</Text>
        </View>

        <View className='px-4 pt-6'>
          <GlassCard>
            <View className='items-center'>
              <Image source={require('../../assets/icon.png')} className='w-16 h-16' />
              <Text className='mt-2 font-semibold'>{user?.name || 'User'}</Text>
              <Text className='text-muted'>{user?.email || ''}</Text>
              <Button className='mt-3 rounded-full' onPress={() => setShowEdit(!showEdit)}><ButtonText>{showEdit ? 'Cancel' : 'Edit Profile'}</ButtonText></Button>
              <Button disabled={status === 'loading'} className='mt-3 rounded-full' onPress={async () => { const ok = await dispatch(logoutAsync()); if (ok) router.replace('/(auth)/login') }}>
                <ButtonText>{status === 'loading' ? 'Loading...' : 'Logout'}</ButtonText>
              </Button>
            </View>
          </GlassCard>
        </View>

        {showEdit && (
          <View className='px-4 pt-4'>
            <GlassCard>
              <Text className='mb-3 text-lg font-semibold'>Edit Profile</Text>
              <Input className='mb-2 rounded-xl'>
                <InputField placeholder='Name' value={name} onChangeText={setName} />
              </Input>
              <Input className='mb-2 rounded-xl'>
                <InputField placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
              </Input>
              <Input className='mb-2 rounded-xl'>
                <InputField placeholder='Current Password' value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
              </Input>
              <Input className='mb-4 rounded-xl'>
                <InputField placeholder='New Password' value={newPassword} onChangeText={setNewPassword} secureTextEntry />
              </Input>
              <View className='items-center'>
                <Button className='rounded-full' disabled={status === 'loading'} onPress={async () => {
                  const ok = await dispatch(updateProfile({ name, email, currentPassword, newPassword }))
                  if (ok) { setShowEdit(false) } else { Alert.alert('Update failed') }
                }}>
                  <ButtonText>{status === 'loading' ? 'Saving...' : 'Save'}</ButtonText>
                </Button>
              </View>
            </GlassCard>
          </View>
        )}
      </ScrollView>
      </Box>
      </SafeAreaView>
  )
}
