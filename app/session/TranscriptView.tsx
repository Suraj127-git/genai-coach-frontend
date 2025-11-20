import { Box, Text } from '@gluestack-ui/themed'
import { useAppSelector } from '../../store/hooks'

export default function TranscriptView() {
  const { transcript } = useAppSelector(s => s.sessions)
  return (
    <Box className='mt-2'>
      <Text className='font-semibold'>Transcript</Text>
      <Text className='text-muted'>{transcript || '—'}</Text>
    </Box>
  )
}