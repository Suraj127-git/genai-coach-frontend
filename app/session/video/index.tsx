import { Box, Text, Button, ButtonText, Input, InputField } from '@gluestack-ui/themed'
import { View, Image, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useEffect, useState } from 'react'
import { requestMicPermission, startRecording, stopRecording } from '../../../utils/audio'
import { useAppDispatch } from '../../../store/hooks'
import { addPendingUpload, setAudioUri, setElapsed } from '../../../store/slices/sessionSlice'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as FileSystem from 'expo-file-system'

export default function Video() {
  const [camPermStatus, requestCamPermission] = useCameraPermissions()
  const [micPerm, setMicPerm] = useState<boolean | null>(null)
  const [type, setType] = useState<'front' | 'back'>('front')
  const [cameraActive, setCameraActive] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [codeText, setCodeText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const init = async () => {
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

  const onToggleCamera = async () => {
    if (!cameraActive) {
      const resp = await requestCamPermission()
      if (resp?.granted) setCameraActive(true)
    } else {
      setType(prev => prev === 'front' ? 'back' : 'front')
    }
  }

  const onEnd = async () => {
    const { uri } = await stopRecording()
    if (uri) { dispatch(setAudioUri(uri)); dispatch(addPendingUpload({ uri, time: Date.now() })) }
    router.replace('/(tabs)')
  }

  const onUploadFile = async () => {
    let picker: any
    try {
      picker = await import('expo-document-picker')
    } catch (e) {
      Alert.alert('Upload unavailable', 'Please install expo-document-picker')
      return
    }
    const res = await (picker.DocumentPicker?.getDocumentAsync ? picker.DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true }) : picker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true }))
    const asset = res?.assets?.[0]
    const uri = asset?.uri || res?.uri
    const name = asset?.name || res?.name
    if (uri) {
      try {
        const content = await FileSystem.readAsStringAsync(uri)
        setCodeText(content)
        setFileName(name || null)
      } catch (e) {
        Alert.alert('Failed to read file')
      }
    }
  }

  const onSubmitCode = () => {
    if (!codeText.trim()) { Alert.alert('Please enter code'); return }
    Alert.alert('Submitted', fileName ? `File: ${fileName}` : 'Code submitted')
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
            {cameraActive && camPermStatus?.granted ? (
              <CameraView style={{ flex: 1 }} facing={type} />
            ) : (
              <TouchableOpacity style={{ flex: 1 }} onPress={onToggleCamera}>
                <View className='flex-1 items-center justify-center'>
                  <Text className='text-muted'>Tap to open camera</Text>
                </View>
              </TouchableOpacity>
            )}
          </Box>
        </View>
        <Box className='rounded-xl bg-surface p-3 mt-3'>
          <Text className='text-base font-semibold'>Code Editor</Text>
          <Input className='mt-2'>
            <InputField
              value={codeText}
              onChangeText={setCodeText}
              placeholder='Write your code here...'
              multiline
              numberOfLines={8}
              style={{ textAlignVertical: 'top' }}
            />
          </Input>
          {fileName ? (<Text className='mt-2 text-muted'>Loaded: {fileName}</Text>) : null}
          <View className='flex-row justify-end mt-3'>
            <Button className='rounded-2xl mx-1 bg-surface' onPress={onUploadFile}><ButtonText>Upload File</ButtonText></Button>
            <Button className='rounded-2xl mx-1 bg-primary-600' onPress={onSubmitCode}><ButtonText>Submit Code</ButtonText></Button>
          </View>
        </Box>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24 }} className='flex-row justify-center'>
          <Button className='rounded-2xl mx-2' onPress={onToggleMic}><ButtonText>{micEnabled ? 'Mute' : 'Unmute'}</ButtonText></Button>
          <Button className='rounded-2xl mx-2 bg-primary-600' onPress={onToggleCamera}><ButtonText>Camera</ButtonText></Button>
          <Button className='rounded-2xl mx-2 bg-red-600' onPress={onEnd}><ButtonText>End</ButtonText></Button>
        </View>
      </Box>
      </SafeAreaView>
  )
}
