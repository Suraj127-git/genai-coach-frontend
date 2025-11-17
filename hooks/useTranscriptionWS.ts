import { useEffect, useRef, useState } from 'react'
import { connectTranscriptionWS } from '../utils/wsClient'

export default function useTranscriptionWS(token?: string, onMessage?: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState<'closed' | 'open' | 'error'>('closed')

  useEffect(() => {
    const ws = connectTranscriptionWS(token)
    wsRef.current = ws
    ws.onopen = () => setStatus('open')
    ws.onerror = () => setStatus('error')
    ws.onclose = () => setStatus('closed')
    ws.onmessage = e => {
      try {
        const msg = JSON.parse(e.data)
        onMessage && onMessage(msg)
      } catch {}
    }
    return () => { ws.close() }
  }, [token, onMessage])

  const send = (data: any) => {
    const ws = wsRef.current
    if (ws && status === 'open') ws.send(JSON.stringify(data))
  }

  return { send, status }
}