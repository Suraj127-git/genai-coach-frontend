import { Box, Text } from '@gluestack-ui/themed'
import { useAppSelector } from '../../store/hooks'

export default function TranscriptView() {
  const { transcript } = useAppSelector(s => s.sessions)
  return (
    <Box style={{ marginTop: 8 }}>
      <Text>Transcript</Text>
      <Text style={{ color: '#6B7280' }}>{transcript || '—'}</Text>
    </Box>
  )
}