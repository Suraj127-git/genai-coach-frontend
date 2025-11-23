import NetInfo from '@react-native-community/netinfo'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearPendingUploads } from '../store/slices/sessionSlice'
import * as FileSystem from 'expo-file-system'
import { api } from '../utils/api'

export default function useNetworkSync() {
  const pending = useAppSelector(s => s.sessions.pendingUploads)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const sub = NetInfo.addEventListener(async state => {
      if (state.isConnected && pending.length > 0) {
        try {
          for (const it of pending) {
            const presign = await api.post('/upload/s3-presign', { content_type: 'audio/m4a', extension: 'm4a' })
            const url = presign.data.url as string
            await FileSystem.uploadAsync(url, it.uri, ({ httpMethod: 'PUT', headers: { 'Content-Type': 'audio/m4a' }, uploadType: 'binaryContent' } as any))
          }
          dispatch(clearPendingUploads())
        } catch {}
      }
    })
    return () => sub()
  }, [pending.length])
}
