import NetInfo from '@react-native-community/netinfo'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearPendingUploads } from '../store/slices/sessionSlice'

export default function useNetworkSync() {
  const pending = useAppSelector(s => s.sessions.pendingUploads)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const sub = NetInfo.addEventListener(state => {
      if (state.isConnected && pending.length > 0) {
        dispatch(clearPendingUploads())
      }
    })
    return () => sub()
  }, [pending.length])
}