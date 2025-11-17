import { Audio } from 'expo-av'

export async function requestMicPermission() {
  const p = await Audio.requestPermissionsAsync()
  return p.status === 'granted'
}

let recording: Audio.Recording | null = null

export async function startRecording() {
  await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true })
  const rec = new Audio.Recording()
  await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
  await rec.startAsync()
  recording = rec
  return true
}

export async function stopRecording() {
  if (!recording) return { uri: null, durationMillis: 0 }
  await recording.stopAndUnloadAsync()
  const uri = recording.getURI() || null
  const status = await recording.getStatusAsync()
  recording = null
  return { uri, durationMillis: status.durationMillis || 0 }
}