export function connectTranscriptionWS(token?: string) {
  const url = process.env.EXPO_PUBLIC_API_WS || 'ws://localhost:8000/ws/transcribe'
  const ws = new WebSocket(url)
  if (token) ws.onopen = () => ws.send(JSON.stringify({ type: 'auth', token }))
  return ws
}