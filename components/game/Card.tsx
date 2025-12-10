import { View, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import Colors from '@/constants/colors';
import { Heart, Diamond, Club, Spade } from 'lucide-react-native';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardProps {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
  width?: number;
}

export function Card({ suit, rank, hidden = false, width = 70 }: CardProps) {
  const height = width * 1.4;
  
  if (hidden) {
    return (
      <View style={[styles.card, styles.hidden, { width, height }]}>
        <View style={styles.pattern} />
        <View style={styles.centerLogo}>
          <ThemedText variant="h2" style={{ fontSize: width/3 }}>👑</ThemedText>
        </View>
      </View>
    );
  }

  const isRed = suit === 'hearts' || suit === 'diamonds';
  const color = isRed ? Colors.red : Colors.black;
  
  const renderSuit = (s: number) => {
    switch (suit) {
      case 'hearts': return <Heart size={s} color={color} fill={color} />;
      case 'diamonds': return <Diamond size={s} color={color} fill={color} />;
      case 'clubs': return <Club size={s} color={color} fill={color} />;
      case 'spades': return <Spade size={s} color={color} fill={color} />;
    }
  };

  return (
    <View style={[styles.card, { width, height }]}>
      <View style={styles.topLeft}>
        <ThemedText weight="bold" style={{ color, fontSize: width/3.5, lineHeight: width/3.5 }}>{rank}</ThemedText>
        {renderSuit(width/5)}
      </View>
      
      <View style={styles.centerSuit}>
        {renderSuit(width/2)}
      </View>

      <View style={styles.bottomRight}>
        <ThemedText weight="bold" style={{ color, fontSize: width/3.5, lineHeight: width/3.5 }}>{rank}</ThemedText>
        {renderSuit(width/5)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 4,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  hidden: {
    backgroundColor: '#1E2D4A', // Navy Blue back
    borderColor: '#D4AF37',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    backgroundColor: '#000', // Texture simulation
  },
  centerLogo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeft: {
    alignItems: 'center',
  },
  bottomRight: {
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  centerSuit: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.2, // Watermark style
  },
});
