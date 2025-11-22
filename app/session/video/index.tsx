import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { View, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useEffect, useState } from 'react'
import { requestMicPermission, startRecording, stopRecording } from '../../../utils/audio'
import { useAppDispatch } from '../../../store/hooks'
import { addPendingUpload, setAudioUri, setElapsed } from '../../../store/slices/sessionSlice'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Video() {
  const [camPermStatus, requestCamPermission] = useCameraPermissions()
  const [micPerm, setMicPerm] = useState<boolean | null>(null)
  const [type, setType] = useState<'front' | 'back'>('front')
  const [micEnabled, setMicEnabled] = useState(true)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const init = async () => {
      if (!camPermStatus?.granted) await requestCamPermission()
      const m = await requestMicPermission()
      setMicPerm(m)
      if (m) await startRecording()
    }
    init()
    return () => { void stopRecording() }
  }, [])

  const onToggleMic = async () => {
    if (micEnabled) {
      const { uri, durationMillis } = await stopRecording()
      if (uri) { dispatch(setAudioUri(uri)); dispatch(setElapsed(Math.round(durationMillis / 1000))); dispatch(addPendingUpload({ uri, time: Date.now() })) }
    } else {
      await startRecording()
    }
    setMicEnabled(!micEnabled)
  }

  const onToggleCamera = () => {
    setType(prev => prev === 'front' ? 'back' : 'front')
  }

  const onEnd = async () => {
    const { uri } = await stopRecording()
    if (uri) { dispatch(setAudioUri(uri)); dispatch(addPendingUpload({ uri, time: Date.now() })) }
    router.replace('/(tabs)')
  }

  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 px-4 pt-6 bg-background'>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/interview')}
          style={{ position: 'absolute', left: 12, top: Math.max(8, insets.top + 8), zIndex: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 6 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text className='text-center text-xl font-bold'>Interview Call</Text>
        <View className='flex-row justify-between mt-3'>
          <Box className='w-[48%] h-52 rounded-xl items-center justify-center bg-surface'>
            <Image source={require('../../../assets/icon.png')} className='w-16 h-16' />
            <Text className='mt-2 text-muted'>AI Interviewer</Text>
          </Box>
          <Box className='w-[48%] h-52 rounded-xl overflow-hidden bg-surface'>
            {camPermStatus?.granted ? (
              <CameraView style={{ flex: 1 }} facing={type} />
            ) : (
              <View className='flex-1 items-center justify-center'>
                <Text className='text-muted'>Camera permission required</Text>
              </View>
            )}
          </Box>
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24 }} className='flex-row justify-center'>
          <Button className='rounded-2xl mx-2' onPress={onToggleMic}><ButtonText>{micEnabled ? 'Mute' : 'Unmute'}</ButtonText></Button>
          <Button className='rounded-2xl mx-2 bg-primary-600' onPress={onToggleCamera}><ButtonText>Camera</ButtonText></Button>
          <Button className='rounded-2xl mx-2 bg-red-600' onPress={onEnd}><ButtonText>End</ButtonText></Button>
        </View>
      </Box>
      </SafeAreaView>
  )
}

