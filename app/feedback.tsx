import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { useAppSelector } from '../store/hooks'
import { Image, View } from 'react-native'

export default function Feedback() {
  const { transcript } = useAppSelector(s => s.sessions)
  return (
      <Box style={{ flex: 1, padding: 16 }}>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700' }}>Interview Results</Text>
        <Text style={{ textAlign: 'center', marginTop: 4, color: '#6B7280' }}>Here’s how you performed in your mock interview</Text>
        <Box style={{ marginTop: 16, borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
          <View style={{ alignItems: 'center' }}>
            <Image source={require('../assets/split_ai_scene_3.png')} style={{ width: '100%', height: 140 }} resizeMode='contain' />
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Overall Score</Text>
            <Text style={{ color: '#2563EB', fontSize: 16, fontWeight: '600' }}>85/100</Text>
            <Text style={{ color: '#6B7280' }}>Great performance!</Text>
          </View>
        </Box>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <Box style={{ width: '48%', borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Image source={require('../assets/postive-feed.png')} style={{ width: 56, height: 56, marginBottom: 8 }} />
              <Text style={{ fontSize: 16, fontWeight: '600' }}>Strengths</Text>
              <Text style={{ marginTop: 6, textAlign: 'center', color: '#6B7280' }}>Technical Knowledge, Communication</Text>
            </View>
          </Box>
          <Box style={{ width: '48%', borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Image source={require('../assets/negative-feed.png')} style={{ width: 56, height: 56, marginBottom: 8 }} />
              <Text style={{ fontSize: 16, fontWeight: '600' }}>Areas to Improve</Text>
              <Text style={{ marginTop: 6, textAlign: 'center', color: '#6B7280' }}>Response Time, Detail Level</Text>
            </View>
          </Box>
        </View>
        <Box style={{ marginTop: 12, borderRadius: 16, backgroundColor: '#FFFFFF' }}>
          <Text style={{ padding: 12, fontSize: 16, fontWeight: '600' }}>Detailed Feedback</Text>
          <Text style={{ paddingHorizontal: 12, paddingBottom: 12, color: '#6B7280' }}>{transcript || 'No transcript yet'}</Text>
        </Box>
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Button style={{ borderRadius: 24 }} onPress={() => {}}>
            <ButtonText>Practice Again</ButtonText>
          </Button>
          <Button style={{ marginTop: 8, backgroundColor: 'transparent' }} onPress={() => {}}>
            <ButtonText style={{ color: '#2563EB' }}>View Interview Tips</ButtonText>
          </Button>
          <Button style={{ marginTop: 8, borderRadius: 24, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2563EB' }} onPress={() => {}}>
            <ButtonText style={{ color: '#2563EB' }}>History</ButtonText>
          </Button>
        </View>
      </Box>
  )
}