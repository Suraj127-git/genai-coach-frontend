import Animated, { FadeIn } from 'react-native-reanimated'
import { Layout, Text } from '@ui-kitten/components'
import { useAppSelector } from '../../store/hooks'

export default function TranscriptView() {
  const { transcript } = useAppSelector(s => s.sessions)
  return (
    <Animated.View entering={FadeIn}>
      <Layout style={{ marginTop: 8 }}>
        <Text category='label'>Transcript</Text>
        <Text appearance='hint'>{transcript || '—'}</Text>
      </Layout>
    </Animated.View>
  )
}