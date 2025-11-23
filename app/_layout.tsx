import '../global.css'
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
import { Linking, View } from 'react-native'
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
    const requestAll = async () => {
      try {
        let medStatus: string | undefined = undefined
        try {
          const MediaLibrary = await import('expo-media-library')
          const { status } = await MediaLibrary.requestPermissionsAsync()
          medStatus = status
          console.log('[Permissions] MediaLibrary requested', { mediaLibrary: status })
        } catch (e) {
          console.log('[Permissions] MediaLibrary not available', e)
        }
        const ok = medStatus === 'granted' || medStatus === undefined
        setPermReady(ok)
        setPermMsg(ok ? null : 'Media library permission not granted. You can still continue.')
      } catch (e) {
        console.log('[Permissions] Request failed', e)
        setPermReady(true)
        setPermMsg(null)
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
            <View className='flex-1'>
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
                <Text className='text-muted'>Media library access enables saving recordings to gallery.</Text>
                {Constants.appOwnership === 'expo' ? null : (
                  <Text className='text-muted mt-1'>If permissions fail, rebuild the development client to include native modules.</Text>
                )}
                {permMsg ? (<Text className='mt-2 text-muted'>{permMsg}</Text>) : null}
                <Button disabled={requesting} className='mt-3 rounded-2xl' onPress={async () => {
                  try {
                    setRequesting(true)
                    let medStatus: string | undefined = undefined
                    try {
                      const MediaLibrary = await import('expo-media-library')
                      const { status } = await MediaLibrary.requestPermissionsAsync()
                      medStatus = status
                      console.log('[Permissions] Retry MediaLibrary requested', { mediaLibrary: status })
                    } catch (e) {
                      console.log('[Permissions] Retry MediaLibrary not available', e)
                    }
                    const ok = medStatus === 'granted' || medStatus === undefined
                    setPermReady(ok)
                    setPermMsg(ok ? null : 'Permissions not granted. You can open system settings to allow access.')
                  } catch (e) { console.log('[Permissions] Retry failed', e) }
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
            </View>
            </PersistGate>
          </Provider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </>
  )
}
