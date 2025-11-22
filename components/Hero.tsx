import { View } from 'react-native'
import { Text, Button, ButtonText } from '@gluestack-ui/themed'
import { GradientHeader } from './ui'

export function Hero({ title, subtitle, ctaLabel, onCtaPress, height = 220, overlayOffset = 120 }: { title: string, subtitle: string, ctaLabel: string, onCtaPress: () => void, height?: number, overlayOffset?: number }) {
  return (
    <View>
      <GradientHeader height={height} />
      <View className='px-4 justify-center' style={{ marginTop: -(height - overlayOffset) }}>
        <Text className='text-center text-2xl font-bold'>{title}</Text>
        <Text className='text-center mt-2 text-muted'>{subtitle}</Text>
        <View className='items-center mt-4'>
          <Button className='rounded-full' onPress={onCtaPress}><ButtonText>{ctaLabel}</ButtonText></Button>
        </View>
      </View>
    </View>
  )
}

