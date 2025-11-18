import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View, Image } from 'react-native'
import { useState } from 'react'

export default function Tips() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
      <Box style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
          <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700' }}>Interview Tips & Resources</Text>
          <Text style={{ textAlign: 'center', marginTop: 4, color: '#6B7280' }}>Expert advice to help you excel in your next interview</Text>

          <Image source={require('../assets/split_ai_scene_2.png')} style={{ width: '100%', height: 140, marginTop: 12 }} resizeMode='contain' />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            {['Technical', 'Behavioral', 'Preparation', 'General'].map((label, idx) => (
              <Button key={label} onPress={() => setSelectedIndex(idx)} style={{ flex: 1, marginHorizontal: 4, borderRadius: 24, backgroundColor: selectedIndex === idx ? '#2563EB' : '#FFFFFF', borderWidth: selectedIndex === idx ? 0 : 1, borderColor: '#E5E7EB' }}>
                <ButtonText style={{ color: selectedIndex === idx ? '#FFFFFF' : '#111827', fontSize: 12 }}>{label}</ButtonText>
              </Button>
            ))}
          </View>

          {selectedIndex === 0 && (
            <Box style={{ borderRadius: 16, marginTop: 12, backgroundColor: '#FFFFFF', padding: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>Technical Interview Tips</Text>
              <Text style={{ marginTop: 6, color: '#6B7280' }}>Practice data structures and algorithms. Think aloud during problem solving. Start with a brute-force approach, then optimize. Test edge cases and clarify requirements.</Text>
            </Box>
          )}
          {selectedIndex === 1 && (
            <Box style={{ borderRadius: 16, marginTop: 12, backgroundColor: '#FFFFFF', padding: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>Behavioral Interview Tips</Text>
              <Text style={{ marginTop: 6, color: '#6B7280' }}>Use the STAR method. Provide concrete examples. Show teamwork, leadership, and problem solving with measurable outcomes.</Text>
            </Box>
          )}
          {selectedIndex === 2 && (
            <Box style={{ borderRadius: 16, marginTop: 12, backgroundColor: '#FFFFFF', padding: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>Preparation</Text>
              <Text style={{ marginTop: 6, color: '#6B7280' }}>Review fundamentals, research the company, prepare questions, and do mock sessions to reduce anxiety.</Text>
            </Box>
          )}
          {selectedIndex === 3 && (
            <Box style={{ borderRadius: 16, marginTop: 12, backgroundColor: '#FFFFFF', padding: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>General Advice</Text>
              <Text style={{ marginTop: 6, color: '#6B7280' }}>Be punctual, communicate clearly, maintain eye contact, and follow up with a thank-you note.</Text>
            </Box>
          )}
        </ScrollView>
      </Box>
  )
}