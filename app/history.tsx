import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View, Image } from 'react-native'

export default function History() {
  const items = [
    { title: 'Technical Interview - Medium', date: '1/15/2025', duration: '45 min', score: 85 },
    { title: 'Behavioral Interview - Medium', date: '1/10/2025', duration: '30 min', score: 78 },
    { title: 'Mixed Interview - Hard', date: '1/5/2025', duration: '60 min', score: 92 },
  ]

  return (
      <Box style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
          <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700' }}>Interview History</Text>
          <Text style={{ textAlign: 'center', marginTop: 4, color: '#6B7280' }}>Review your past interviews and track your progress</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Box style={{ width: '32%', borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>3</Text>
                <Text style={{ color: '#6B7280' }}>Total</Text>
              </View>
            </Box>
            <Box style={{ width: '32%', borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#2563EB', fontSize: 18, fontWeight: '600' }}>85%</Text>
                <Text style={{ color: '#6B7280' }}>Average</Text>
              </View>
            </Box>
            <Box style={{ width: '32%', borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#16A34A', fontSize: 18, fontWeight: '600' }}>+12%</Text>
                <Text style={{ color: '#6B7280' }}>Improvement</Text>
              </View>
            </Box>
          </View>

          {items.map((it, idx) => (
            <Box key={idx} style={{ marginTop: 12, borderRadius: 16, backgroundColor: '#FFFFFF', padding: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../assets/split_icon_3.png')} style={{ width: 40, height: 40, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600' }}>{it.title}</Text>
                  <Text style={{ color: '#6B7280' }}>{it.date} • {it.duration}</Text>
                  <Button variant='link' style={{ marginTop: 6 }} onPress={() => {}}><ButtonText>View Details</ButtonText></Button>
                </View>
                <View style={{ alignItems: 'center', width: 64 }}>
                  <Text style={{ color: '#2563EB', fontSize: 18, fontWeight: '600' }}>{it.score}</Text>
                  <Text style={{ color: '#6B7280' }}>Score</Text>
                </View>
              </View>
            </Box>
          ))}
        </ScrollView>
      </Box>
  )
}