import { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { GradientHeader, GlassCard } from '../../components/ui'
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
    <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
    <Box style={{ flex: 1 }}>
      <GradientHeader height={160} />
      <View style={{ marginTop: -130, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center' }}>Voice Interview</Text>
        <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 6 }}>Audio Mock Interview - Medium Level</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#2563EB' }}>Questions: 1</Text>
          <View style={{ marginLeft: 8 }}><Timer running={recordingStatus === 'recording'} /></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <GlassCard>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Conversation</Text>
          <View style={{ marginTop: 8 }}>
            <View style={{ backgroundColor: '#E0F2FE', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontWeight: '600', color: '#2563EB' }}>AI Interviewer</Text>
              <Text style={{ marginTop: 6, color: '#0F172A' }}>Hello! I am your AI interviewer. When you're ready, turn on your microphone and start speaking. {currentQuestion}</Text>
              {elapsed > 0 && <Text style={{ marginTop: 8, color: '#6B7280' }}>Recorded: {elapsed}s</Text>}
            </View>
          </View>
        </GlassCard>

        <View style={{ marginTop: 12 }}>
          <TranscriptView />
          {audioUri && <Text style={{ marginTop: 8, color: '#6B7280' }}>Saved: {audioUri}</Text>}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' }}>
        {recordingStatus !== 'recording' ? (
          <Button onPress={onStart} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#2563EB', justifyContent: 'center' }}>
            <ButtonText>Mic</ButtonText>
          </Button>
        ) : (
          <Button onPress={onStop} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#DC2626', justifyContent: 'center' }}>
            <ButtonText>Stop</ButtonText>
          </Button>
        )}
        <Text style={{ marginTop: 8, color: '#6B7280' }}>Tap the microphone to enable and start recording</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <Button variant='outline' style={{ borderRadius: 24, marginRight: 8 }} onPress={onReset}><ButtonText>Reset</ButtonText></Button>
          <Button variant='link' style={{ borderRadius: 24 }} onPress={() => router.push('/feedback')}><ButtonText>Feedback</ButtonText></Button>
        </View>
      </View>
    </Box>
    </SafeAreaView>
  )
}