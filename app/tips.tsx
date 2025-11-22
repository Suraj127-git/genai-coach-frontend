import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { ScrollView, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'

export default function Tips() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <Box className='flex-1 bg-background'>
        <ScrollView className='px-4 pt-6'>
          <Text className='text-center text-xl font-bold'>Interview Tips & Resources</Text>
          <Text className='text-center mt-1 text-muted'>Expert advice to help you excel in your next interview</Text>

          <Image source={require('../assets/split_ai_scene_2.png')} className='w-full h-36 mt-3' resizeMode='contain' />

          <View className='flex-row justify-between mt-3'>
            {['Technical', 'Behavioral', 'Preparation', 'General'].map((label, idx) => (
              <Button key={label} onPress={() => setSelectedIndex(idx)} className={`flex-1 mx-1 rounded-2xl ${selectedIndex === idx ? 'bg-primary-600' : 'bg-surface'} ${selectedIndex === idx ? '' : ''}`}>
                <ButtonText className={`${selectedIndex === idx ? 'text-white' : ''} text-xs`}>{label}</ButtonText>
              </Button>
            ))}
          </View>

          {selectedIndex === 0 && (
            <Box className='rounded-xl mt-3 bg-surface p-3'>
              <Text className='text-base font-semibold'>Technical Interview Tips</Text>
              <Text className='mt-1 text-muted'>Practice data structures and algorithms. Think aloud during problem solving. Start with a brute-force approach, then optimize. Test edge cases and clarify requirements.</Text>
            </Box>
          )}
          {selectedIndex === 1 && (
            <Box className='rounded-xl mt-3 bg-surface p-3'>
              <Text className='text-base font-semibold'>Behavioral Interview Tips</Text>
              <Text className='mt-1 text-muted'>Use the STAR method. Provide concrete examples. Show teamwork, leadership, and problem solving with measurable outcomes.</Text>
            </Box>
          )}
          {selectedIndex === 2 && (
            <Box className='rounded-xl mt-3 bg-surface p-3'>
              <Text className='text-base font-semibold'>Preparation</Text>
              <Text className='mt-1 text-muted'>Review fundamentals, research the company, prepare questions, and do mock sessions to reduce anxiety.</Text>
            </Box>
          )}
          {selectedIndex === 3 && (
            <Box className='rounded-xl mt-3 bg-surface p-3'>
              <Text className='text-base font-semibold'>General Advice</Text>
              <Text className='mt-1 text-muted'>Be punctual, communicate clearly, maintain eye contact, and follow up with a thank-you note.</Text>
            </Box>
          )}
        </ScrollView>
      </Box>
      </SafeAreaView>
  )
}