import Animated, { FadeIn } from 'react-native-reanimated'
import { Layout, Text } from '@ui-kitten/components'
import { useAppSelector } from '../store/hooks'

export default function Feedback() {
  const { transcript } = useAppSelector(s => s.sessions)
  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn}>
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text category='h6'>Feedback</Text>
        <Text appearance='hint' style={{ marginTop: 8 }}>{transcript || 'No transcript yet'}</Text>
      </Layout>
    </Animated.View>
  )
}