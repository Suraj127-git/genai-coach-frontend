import { Stack, useRouter } from 'expo-router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../store'
import NetInfo from '@react-native-community/netinfo'
import Constants from 'expo-constants'
import { NativeModulesProxy } from 'expo-modules-core'
import { useEffect, useState } from 'react'
import Animated, { FadeIn } from 'react-native-reanimated'
import { ApplicationProvider, Layout as KLayout, Text, Button, Spinner } from '@ui-kitten/components'
import * as eva from '@eva-design/eva'
import { IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Layout() {
  const [online, setOnline] = useState(true)
  const [permReady, setPermReady] = useState<boolean | null>(null)
  const [requesting, setRequesting] = useState(false)
  const [permMsg, setPermMsg] = useState<string | null>(null)
  const [allowContinue, setAllowContinue] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const sub = NetInfo.addEventListener(state => {
      setOnline(!!state.isConnected)
    })
    return () => sub()
  }, [])

  useEffect(() => {
    const requestAll = async () => {
      try {
        const hasLoc = !!(NativeModulesProxy as any).ExpoLocation
        const hasMed = !!(NativeModulesProxy as any).ExpoMediaLibrary
        if (!hasLoc || !hasMed) {
          setPermReady(false)
          setPermMsg('Native permission modules are missing. Rebuild the dev client or use Expo Go.')
          return
        }
        const Location = await import('expo-location')
        const MediaLibrary = await import('expo-media-library')
        const { status: loc } = await Location.requestForegroundPermissionsAsync()
        const { status: med } = await MediaLibrary.requestPermissionsAsync()
        const ok = loc === 'granted' && med === 'granted'
        setPermReady(ok)
        setPermMsg(ok ? null : 'Permissions not granted. Please allow access or open settings.')
      } catch {
        setPermReady(false)
        setPermMsg('Permission request failed. Try again or rebuild the client.')
      }
    }
    requestAll()
  }, [])

  useEffect(() => {
    const checkSkip = async () => {
      try {
        const skipped = await AsyncStorage.getItem('perm_skipped')
        if (skipped === 'true') setAllowContinue(true)
      } catch {}
    }
    checkSkip()
  }, [])


  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{
        ...eva.light,
        'color-primary-100': '#DCEEFB',
        'color-primary-200': '#B6E0FE',
        'color-primary-300': '#84C5F4',
        'color-primary-400': '#62B0E8',
        'color-primary-500': '#1D4ED8',
        'color-primary-600': '#1E40AF',
        'color-primary-700': '#1E3A8A',
        'color-primary-800': '#1F2A56',
        'color-primary-900': '#1A2352',
        'background-basic-color-1': '#FFFFFF',
        'background-basic-color-2': '#F1F5F9',
        'text-basic-color': '#0F172A'
      }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {!online ? (
              <Animated.View style={{ flex: 1 }} entering={FadeIn}>
                <KLayout style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                  <Text category='h6'>No Internet Connection</Text>
                  <Text appearance='hint'>Please connect to the internet to use the app.</Text>
                  <Button style={{ marginTop: 12 }} onPress={() => NetInfo.fetch().then(s => setOnline(!!s.isConnected))}>Retry</Button>
                </KLayout>
              </Animated.View>
            ) : permReady === null ? (
              <KLayout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Spinner size='large' />
              </KLayout>
            ) : !permReady && !allowContinue ? (
              <Animated.View style={{ flex: 1 }} entering={FadeIn}>
                <KLayout style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                  <Text category='h6'>Permissions Required</Text>
                  <Text appearance='hint'>Location and media library access are required.</Text>
                  {Constants.appOwnership === 'expo' ? null : (
                    <Text appearance='hint'>If permissions fail, rebuild the development client to include native modules.</Text>
                  )}
                  {permMsg ? (<Text status='danger'>{permMsg}</Text>) : null}
                  <Button disabled={requesting} style={{ marginTop: 12 }} onPress={async () => {
                    try {
                      setRequesting(true)
                      const hasLoc = !!(NativeModulesProxy as any).ExpoLocation
                      const hasMed = !!(NativeModulesProxy as any).ExpoMediaLibrary
                      if (!hasLoc || !hasMed) { setPermReady(false); setPermMsg('Native modules missing. Rebuild dev client or use Expo Go.'); setRequesting(false); return }
                      const Location = await import('expo-location')
                      const MediaLibrary = await import('expo-media-library')
                      const { status: loc } = await Location.requestForegroundPermissionsAsync()
                      const { status: med } = await MediaLibrary.requestPermissionsAsync()
                      const ok = loc === 'granted' && med === 'granted'
                      setPermReady(ok)
                      setPermMsg(ok ? null : 'Permissions not granted. You can open system settings to allow access.')
                    } catch {}
                    finally { setRequesting(false) }
                  }}>{requesting ? 'Requesting…' : 'Grant Permissions'}</Button>
                  <Button appearance='outline' style={{ marginTop: 8 }} onPress={() => Linking.openSettings()}>Open Settings</Button>
                  <Button appearance='ghost' style={{ marginTop: 8 }} onPress={async () => { await AsyncStorage.setItem('perm_skipped', 'true'); setAllowContinue(true); router.replace('/onboarding/one') }}>Skip for now</Button>
                </KLayout>
              </Animated.View>
            ) : (
              <Stack screenOptions={{
                headerTintColor: '#0F172A',
                headerTitleStyle: { color: '#0F172A' },
                headerBackground: () => {
                  const hasGrad = !!(NativeModulesProxy as any).ExpoLinearGradient
                  if (!hasGrad) return <Animated.View style={{ flex: 1, backgroundColor: '#E0F2FE' }} />
                  const { LinearGradient } = require('expo-linear-gradient')
                  return <LinearGradient colors={['#E0F2FE', '#FFFFFF']} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                },
              }}>
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="(auth)/login" options={{ title: 'Login', headerBackTitle: 'Back' }} />
                <Stack.Screen name="(auth)/register" options={{ title: 'Register', headerBackTitle: 'Back' }} />
                <Stack.Screen name="profile" options={{ title: 'Profile' }} />
                <Stack.Screen name="session/index" options={{ title: 'Session' }} />
                <Stack.Screen name="feedback" options={{ title: 'Feedback' }} />
                <Stack.Screen name="onboarding/one" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/two" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/three" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/four" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/five" options={{ headerShown: false }} />
              </Stack>
            )}
          </PersistGate>
        </Provider>
      </ApplicationProvider>
    </>
  )
}