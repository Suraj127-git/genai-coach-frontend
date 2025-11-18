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
    <Box style={{ flex: 1, padding: 16 }}>
        <Box style={{ borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
          <Text style={{ fontWeight: '600' }}>Interview Session</Text>
          <Text style={{ color: '#6B7280' }}>Technical Interview - Medium</Text>
        </Box>
        <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '600' }}>{currentQuestion}</Text>
        <Image source={require('../../assets/mock-int.png')} style={{ width: '100%', height: 140, marginTop: 8 }} resizeMode='contain' />
        <Timer running={recordingStatus === 'recording'} />
        {recordingStatus !== 'recording' && (
          <Button style={{ marginTop: 8, borderRadius: 24 }} onPress={onStart}><ButtonText>Start Recording</ButtonText></Button>
        )}
        {recordingStatus === 'recording' && (
          <Button style={{ marginTop: 8, borderRadius: 24, backgroundColor: '#DC2626' }} onPress={onStop}><ButtonText>Stop Recording</ButtonText></Button>
        )}
        {audioUri && <Text style={{ marginTop: 4, color: '#6B7280' }}>Saved: {audioUri}</Text>}
        {elapsed > 0 && <Text style={{ color: '#6B7280' }}>Duration: {elapsed}s</Text>}
        <TranscriptView />
        <Button style={{ marginTop: 8, borderRadius: 24 }} onPress={() => router.replace('/')}><ButtonText>Back to Home</ButtonText></Button>
        <Button variant='outline' style={{ marginTop: 8, borderRadius: 24 }} onPress={onReset}><ButtonText>Reset</ButtonText></Button>
        <Button variant='link' style={{ marginTop: 8, borderRadius: 24 }} onPress={() => router.push('/feedback')}><ButtonText>View Feedback</ButtonText></Button>
      </Box>
  )
}