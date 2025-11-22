import { createSlice } from '@reduxjs/toolkit'
import { api, setAuthToken } from '../../utils/api'

type User = { id: string; email: string; name?: string }

type State = {
  user: User | null
  token: string | null
  refreshToken: string | null
  status: 'idle' | 'loading' | 'error'
  error: string | null
}

const initialState: State = { user: null, token: null, refreshToken: null, status: 'idle', error: null }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: s => { s.status = 'loading'; s.error = null },
    loginSuccess: (s, a) => { s.status = 'idle'; s.user = a.payload.user; s.token = a.payload.token; s.refreshToken = a.payload.refreshToken ?? s.refreshToken },
    loginFailure: (s, a) => { s.status = 'error'; s.error = a.payload },
    registerStart: s => { s.status = 'loading'; s.error = null },
    registerSuccess: (s, a) => { s.status = 'idle'; s.user = a.payload.user; s.token = a.payload.token; s.refreshToken = a.payload.refreshToken ?? s.refreshToken },
    registerFailure: (s, a) => { s.status = 'error'; s.error = a.payload },
    logoutStart: s => { s.status = 'loading'; s.error = null },
    logout: s => { s.user = null; s.token = null; s.refreshToken = null; s.status = 'idle' }
    ,resetStatus: s => { s.status = 'idle'; s.error = null }
  }
})

export const { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, logoutStart, logout, resetStatus } = slice.actions

export default function reducer(state: State | undefined, action: any): State {
  return slice.reducer(state, action)
}

export const login = (payload: { email: string; password: string }) => async (dispatch: any) => {
  try {
    dispatch(loginStart())
    const res = await api.post('/auth/login', payload)
    const { user, token, refresh_token } = res.data
    setAuthToken(token)
    dispatch(loginSuccess({ user, token, refreshToken: refresh_token }))
    return true
  } catch (e: any) {
    const det = e?.response?.data?.detail
    const msg = Array.isArray(det) ? det.map((d: any) => d?.msg).join('\n') : (det || e?.message || 'Login error')
    dispatch(loginFailure(msg))
    return false
  }
}

export const register = (payload: { email: string; password: string; name?: string }) => async (dispatch: any) => {
  try {
    dispatch(registerStart())
    console.log('[register] sending request', payload)
    const res = await api.post('/auth/register', payload)
    const { user, token, refresh_token } = res.data
    console.log('[register] success', { user, token })
    setAuthToken(token)
    dispatch(registerSuccess({ user, token, refreshToken: refresh_token }))
    return true
  } catch (e: any) {
    const det = e?.response?.data?.detail
    const msg = Array.isArray(det) ? det.map((d: any) => d?.msg).join('\n') : (det || e?.message || 'Register error')
    console.error('[register] error', msg)
    dispatch(registerFailure(msg))
    return false
  }
}

export const logoutAsync = () => async (dispatch: any) => {
  try {
    dispatch(logoutStart())
    await api.post('/auth/logout')
  } catch {}
  setAuthToken(null)
  dispatch(logout())
  return true
}