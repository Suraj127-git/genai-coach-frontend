import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed'
import { useAppSelector } from '../store/hooks'
import { Image, View } from 'react-native'

export default function Feedback() {
  const { transcript } = useAppSelector(s => s.sessions)
  return (
      <Box className='flex-1 px-4 pt-6 bg-background'>
        <Text className='text-center text-xl font-bold'>Interview Results</Text>
        <Text className='text-center mt-1 text-muted'>Here’s how you performed in your mock interview</Text>
        <Box className='mt-4 rounded-xl bg-surface p-3'>
          <View className='items-center'>
            <Image source={require('../assets/split_ai_scene_3.png')} className='w-full h-36' resizeMode='contain' />
            <Text className='text-lg font-semibold'>Overall Score</Text>
            <Text className='text-primary-600 text-base font-semibold'>85/100</Text>
            <Text className='text-muted'>Great performance!</Text>
          </View>
        </Box>
        <View className='flex-row justify-between mt-3'>
          <Box className='w-[48%] rounded-xl bg-surface p-3'>
            <View className='items-center'>
              <Image source={require('../assets/postive-feed.png')} className='w-14 h-14 mb-2' />
              <Text className='text-base font-semibold'>Strengths</Text>
              <Text className='mt-1 text-center text-muted'>Technical Knowledge, Communication</Text>
            </View>
          </Box>
          <Box className='w-[48%] rounded-xl bg-surface p-3'>
            <View className='items-center'>
              <Image source={require('../assets/negative-feed.png')} className='w-14 h-14 mb-2' />
              <Text className='text-base font-semibold'>Areas to Improve</Text>
              <Text className='mt-1 text-center text-muted'>Response Time, Detail Level</Text>
            </View>
          </Box>
        </View>
        <Box className='mt-3 rounded-xl bg-surface'>
          <Text className='p-3 text-base font-semibold'>Detailed Feedback</Text>
          <Text className='px-3 pb-3 text-muted'>{transcript || 'No transcript yet'}</Text>
        </Box>
        <View className='items-center mt-4'>
          <Button className='rounded-2xl' onPress={() => {}}>
            <ButtonText>Practice Again</ButtonText>
          </Button>
          <Button className='mt-2 bg-transparent' onPress={() => {}}>
            <ButtonText className='text-primary-600'>View Interview Tips</ButtonText>
          </Button>
          <Button className='mt-2 rounded-2xl bg-transparent border border-primary-600' onPress={() => {}}>
            <ButtonText className='text-primary-600'>History</ButtonText>
          </Button>
        </View>
      </Box>
  )
}