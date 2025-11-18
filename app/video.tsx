import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { View, Image } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useEffect, useRef, useState } from 'react'
import { requestMicPermission, startRecording, stopRecording } from '../utils/audio'
import { useAppDispatch } from '../store/hooks'
import { addPendingUpload, setAudioUri, setElapsed } from '../store/slices/sessionSlice'
import { useRouter } from 'expo-router'

export default function Video() {
  const [camPermStatus, requestCamPermission] = useCameraPermissions()
  const [micPerm, setMicPerm] = useState<boolean | null>(null)
  const [type, setType] = useState<'front' | 'back'>('front')
  const [micEnabled, setMicEnabled] = useState(true)
  const cameraRef = useRef<any>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

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
    router.replace('/')
  }

  return (
      <Box style={{ flex: 1, padding: 16 }}>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700' }}>Interview Call</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <Box style={{ width: '48%', height: 200, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
            <Image source={require('../assets/icon.png')} style={{ width: 64, height: 64 }} />
            <Text style={{ marginTop: 8, color: '#6B7280' }}>AI Interviewer</Text>
          </Box>
          <Box style={{ width: '48%', height: 200, borderRadius: 16, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
            {camPermStatus?.granted ? (
              <CameraView ref={(r) => { cameraRef.current = r }} style={{ flex: 1 }} facing={type} />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#6B7280' }}>Camera permission required</Text>
              </View>
            )}
          </Box>
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24, flexDirection: 'row', justifyContent: 'center' }}>
          <Button style={{ borderRadius: 24, marginHorizontal: 8 }} onPress={onToggleMic}><ButtonText>{micEnabled ? 'Mute' : 'Unmute'}</ButtonText></Button>
          <Button style={{ borderRadius: 24, marginHorizontal: 8, backgroundColor: '#2563EB' }} onPress={onToggleCamera}><ButtonText>Camera</ButtonText></Button>
          <Button style={{ borderRadius: 24, marginHorizontal: 8, backgroundColor: '#DC2626' }} onPress={onEnd}><ButtonText>End</ButtonText></Button>
        </View>
      </Box>
  )
}