import { createSlice } from '@reduxjs/toolkit'

type State = {
  currentQuestion: string | null
  recordingStatus: 'idle' | 'recording' | 'stopped'
  elapsed: number
  audioUri: string | null
  transcript: string | null
  pendingUploads: { uri: string; time: number }[]
}

const initialState: State = {
  currentQuestion: null,
  recordingStatus: 'idle',
  elapsed: 0,
  audioUri: null,
  transcript: null,
  pendingUploads: []
}

const slice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setQuestion: (s, a) => { s.currentQuestion = a.payload },
    setRecordingStatus: (s, a) => { s.recordingStatus = a.payload },
    setElapsed: (s, a) => { s.elapsed = a.payload },
    setAudioUri: (s, a) => { s.audioUri = a.payload },
    setTranscript: (s, a) => { s.transcript = a.payload },
    addPendingUpload: (s, a) => { s.pendingUploads.push(a.payload) },
    clearPendingUploads: s => { s.pendingUploads = [] },
    resetSession: s => { s.currentQuestion = null; s.recordingStatus = 'idle'; s.elapsed = 0; s.audioUri = null; s.transcript = null }
  }
})

export const { setQuestion, setRecordingStatus, setElapsed, setAudioUri, setTranscript, addPendingUpload, clearPendingUploads, resetSession } = slice.actions
export default function reducer(state: State | undefined, action: any): State { return slice.reducer(state, action) }