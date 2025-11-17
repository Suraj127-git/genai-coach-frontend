import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Layout, Text, Button } from '@ui-kitten/components'
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
    <Animated.View style={{ flex: 1 }} entering={FadeInUp}>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Text category='h6'>{currentQuestion}</Text>
        <Timer running={recordingStatus === 'recording'} />
        {recordingStatus !== 'recording' && (
          <Button style={{ marginTop: 8, borderRadius: 24 }} onPress={onStart}>Start Recording</Button>
        )}
        {recordingStatus === 'recording' && (
          <Button appearance='outline' style={{ marginTop: 8, borderRadius: 24 }} onPress={onStop}>Stop Recording</Button>
        )}
        {audioUri && <Text appearance='hint' style={{ marginTop: 4 }}>Saved: {audioUri}</Text>}
        {elapsed > 0 && <Text appearance='hint'>Duration: {elapsed}s</Text>}
        <TranscriptView />
        <Button style={{ marginTop: 8, borderRadius: 24 }} onPress={() => router.replace('/')}>Back to Home</Button>
        <Button appearance='outline' style={{ marginTop: 8, borderRadius: 24 }} onPress={onReset}>Reset</Button>
        <Button appearance='ghost' style={{ marginTop: 8, borderRadius: 24 }} onPress={() => router.push('/feedback')}>View Feedback</Button>
      </Layout>
    </Animated.View>
  )
}