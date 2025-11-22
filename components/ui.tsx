import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg'
import { Button, ButtonText } from '@gluestack-ui/themed'

export function GradientHeader({ height = 220 }: { height?: number }) {
  return (
    <View style={{ height }}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#EFF6FF" />
            <Stop offset="50%" stopColor="#DBEAFE" />
            <Stop offset="100%" stopColor="#BFDBFE" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#g)" />
      </Svg>
    </View>
  )
}

export function GlassCard({ children, style }: { children: React.ReactNode, style?: any }) {
  return (
    <View style={[{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, shadowColor: '#000000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }, style]}>
      {children}
    </View>
  )
}

export function PillButton({ title, onPress, variant = 'primary' }: { title: string, onPress: () => void, variant?: 'primary' | 'outline' | 'link' }) {
  const baseStyle = { borderRadius: 9999 }
  return (
    <Button onPress={onPress} variant={variant as any} style={baseStyle}>
      <ButtonText>{title}</ButtonText>
    </Button>
  )
}