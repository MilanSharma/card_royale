import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import Colors from '@/constants/colors';
import { CircleDollarSign } from 'lucide-react-native';

interface ChipProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Chip({ amount, size = 'md' }: ChipProps) {
  const getSize = () => {
    switch(size) {
      case 'sm': return { icon: 14, text: 'caption' as const, gap: 4 };
      case 'lg': return { icon: 24, text: 'h3' as const, gap: 8 };
      default: return { icon: 18, text: 'body' as const, gap: 6 };
    }
  };

  const { icon, text, gap } = getSize();
  
  const formattedAmount = amount.toLocaleString();

  return (
    <View style={[styles.container, { gap }]}>
      <CircleDollarSign size={icon} color={Colors.primary} fill={Colors.background} />
      <ThemedText variant={text} weight="bold" color={Colors.primary}>
        {formattedAmount}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)', // gold with opacity
  },
});
