import { useEffect, useRef, useState } from 'react'
import { Text } from 'react-native'

export default function Timer({ running }: { running: boolean }) {
  const [sec, setSec] = useState(0)
  const ref = useRef<number | null>(null)
  useEffect(() => {
    if (running && !ref.current) ref.current = setInterval(() => setSec(s => s + 1), 1000) as unknown as number
    if (!running && ref.current) { clearInterval(ref.current as any); ref.current = null }
    return () => { if (ref.current) clearInterval(ref.current as any) }
  }, [running])
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return <Text style={{ fontSize: 16 }}>{m}:{s}</Text>
}