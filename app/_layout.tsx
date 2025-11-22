import '../global.css'  // First import
import { Stack, useRouter } from 'expo-router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../store'
import NetInfo from '@react-native-community/netinfo'
import Constants from 'expo-constants'
import { NativeModulesProxy } from 'expo-modules-core'
import { useEffect, useState } from 'react'
import { GluestackUIProvider, Box, Text, Button, ButtonText, Spinner } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { Linking, LogBox } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import '../nativewind-interop'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
    LogBox.ignoreLogs([
      'Require cycle:',
      'Non-serializable values were found in the navigation state',
      'VirtualizedLists should never be nested',
    ])
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
      <SafeAreaProvider>
        <GluestackUIProvider config={config}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            {!online ? (
              <Box className='flex-1 items-center justify-center p-4 bg-background'>
                <Text className='text-lg font-semibold'>No Internet Connection</Text>
                <Text className='text-muted mt-1'>Please connect to the internet to use the app.</Text>
                <Button className='mt-3 rounded-2xl' onPress={() => NetInfo.fetch().then(s => setOnline(!!s.isConnected))}><ButtonText>Retry</ButtonText></Button>
              </Box>
            ) : permReady === null ? (
              <Box className='flex-1 items-center justify-center bg-background'>
                <Spinner size='large' />
              </Box>
            ) : !permReady && !allowContinue ? (
              <Box className='flex-1 items-center justify-center p-4 bg-background'>
                <Text className='text-lg font-semibold'>Permissions Required</Text>
                <Text className='text-muted'>Location and media library access are required.</Text>
                {Constants.appOwnership === 'expo' ? null : (
                  <Text className='text-muted mt-1'>If permissions fail, rebuild the development client to include native modules.</Text>
                )}
                {permMsg ? (<Text className='mt-2 text-muted'>{permMsg}</Text>) : null}
                <Button disabled={requesting} className='mt-3 rounded-2xl' onPress={async () => {
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
                }}><ButtonText>{requesting ? 'Requesting…' : 'Grant Permissions'}</ButtonText></Button>
                <Button className='mt-2 rounded-2xl' variant='outline' onPress={() => Linking.openSettings()}><ButtonText>Open Settings</ButtonText></Button>
                <Button style={{ marginTop: 8 }} variant='link' onPress={async () => { await AsyncStorage.setItem('perm_skipped', 'true'); setAllowContinue(true); router.replace('/onboarding/one') }}><ButtonText>Skip for now</ButtonText></Button>
              </Box>
            ) : (
              <Stack screenOptions={{
                headerShown: false,
                headerTintColor: '#0F172A',
                headerTitleStyle: { color: '#0F172A' },
                headerStyle: { backgroundColor: '#E0F2FE' },
              }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="index" />
                <Stack.Screen name="setup" />
                <Stack.Screen name="(auth)/login" />
                <Stack.Screen name="(auth)/register" />
                <Stack.Screen name="session" />
                <Stack.Screen name="session/feedback" />
                <Stack.Screen name="session/video" />
                <Stack.Screen name="tips" />
                <Stack.Screen name="onboarding/one" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/two" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/three" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/four" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/five" options={{ headerShown: false }} />
              </Stack>
            )}
            </PersistGate>
          </Provider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </>
  )
}
