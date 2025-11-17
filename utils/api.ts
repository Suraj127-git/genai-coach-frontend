import axios from 'axios'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

function deriveLanUrl(): string | null {
  const hostUri = (Constants as any)?.expoConfig?.hostUri || (Constants as any)?.manifest?.debuggerHost || ''
  const host = typeof hostUri === 'string' ? hostUri.split(':')[0] : ''
  if (host) return `http://${host}:8000`
  return null
}

function getBaseURL(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL
  if (envUrl && envUrl.length > 0) return envUrl
  const lan = deriveLanUrl()
  if (lan) return lan
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000'
  return 'http://localhost:8000'
}

export const api = axios.create({ baseURL: getBaseURL(), timeout: 15000 })

export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

export function setupAxiosInterceptors({ getRefreshToken, onTokens }: { getRefreshToken: () => string | null, onTokens: (access: string, refresh?: string | null) => void }) {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const refresh = getRefreshToken()
        if (refresh) {
          try {
            const r = await api.post('/auth/refresh', { refresh_token: refresh })
            const { access_token, refresh_token } = r.data
            setAuthToken(access_token)
            onTokens(access_token, refresh_token)
            originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${access_token}` }
            return api(originalRequest)
          } catch (e) {
            // fallthrough
          }
        }
      }
      return Promise.reject(error)
    }
  )
}