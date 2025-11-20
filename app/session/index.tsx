import { useEffect, useState } from 'react'
import { Alert, Image } from 'react-native'
import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import Timer from './Timer'
import { requestMicPermission, startRecording, stopRecording } from '../../utils/audio'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setQuestion, setRecordingStatus, setElapsed, setAudioUri, setTranscript, addPendingUpload, resetSession } from '../../store/slices/sessionSlice'
import { useRouter } from 'expo-router'
import useTranscriptionWS from '../../hooks/useTranscriptionWS'
import useNetworkSync from '../../hooks/useNetworkSync'
import TranscriptView from './TranscriptView'

export default function Session() {
  const dispatch = useAppDispatch()
  const { currentQuestion, recordingStatus, audioUri, elapsed } = useAppSelector(s => s.sessions)
  const { token } = useAppSelector(s => s.auth)
  const [permChecked, setPermChecked] = useState(false)
  const router = useRouter()
  const ws = useTranscriptionWS(token || undefined, (msg) => {
    if (msg?.type === 'transcript') dispatch(setTranscript(msg.text))
  })
  useNetworkSync()

  useEffect(() => {
    if (!currentQuestion) dispatch(setQuestion('Tell me about yourself.'))
  }, [currentQuestion])

  const ensureMic = async () => {
    const ok = await requestMicPermission()
    setPermChecked(true)
    if (!ok) Alert.alert('Microphone permission required')
    return ok
  }

  const onStart = async () => {
    const ok = permChecked ? true : await ensureMic()
    if (!ok) return
    const started = await startRecording()
    if (started) {
      dispatch(setRecordingStatus('recording'))
      ws.send({ type: 'session_start', question: currentQuestion })
    }
  }

  const onStop = async () => {
    const { uri, durationMillis } = await stopRecording()
    dispatch(setRecordingStatus('stopped'))
    dispatch(setAudioUri(uri))
    dispatch(setElapsed(Math.round(durationMillis / 1000)))
    if (uri) {
      ws.send({ type: 'audio_uri', uri })
      dispatch(addPendingUpload({ uri, time: Date.now() }))
      dispatch(setTranscript('Transcription pending...'))
    }
  }

  const onReset = () => {
    dispatch(resetSession())
  }

  return (
    <Box className='flex-1 px-4 pt-6 bg-background'>
        <Box className='rounded-xl bg-surface p-3'>
          <Text className='font-semibold'>Interview Session</Text>
          <Text className='text-muted'>Technical Interview - Medium</Text>
        </Box>
        <Text className='mt-3 text-base font-semibold'>{currentQuestion}</Text>
        <Image source={require('../../assets/mock-int.png')} resizeMode='contain' className='w-full h-36 mt-2' />
        <Timer running={recordingStatus === 'recording'} />
        {recordingStatus !== 'recording' && (
          <Button className='mt-2 rounded-2xl' onPress={onStart}><ButtonText>Start Recording</ButtonText></Button>
        )}
        {recordingStatus === 'recording' && (
          <Button className='mt-2 rounded-2xl bg-red-600' onPress={onStop}><ButtonText>Stop Recording</ButtonText></Button>
        )}
        {audioUri && <Text className='mt-1 text-muted'>Saved: {audioUri}</Text>}
        {elapsed > 0 && <Text className='text-muted'>Duration: {elapsed}s</Text>}
        <TranscriptView />
        <Button className='mt-2 rounded-2xl' onPress={() => router.replace('/')}><ButtonText>Back to Home</ButtonText></Button>
        <Button variant='outline' className='mt-2 rounded-2xl' onPress={onReset}><ButtonText>Reset</ButtonText></Button>
        <Button variant='link' className='mt-2 rounded-2xl' onPress={() => router.push('/feedback')}><ButtonText>View Feedback</ButtonText></Button>
      </Box>
  )
}