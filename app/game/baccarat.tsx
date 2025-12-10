import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Card, CardProps } from '@/components/game/Card';
import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useBlackjack } from '@/hooks/useBlackjack'; // Reusing deck logic from blackjack hook if possible, or just creating a new deck func

// Simplified Baccarat logic for MVP
// We can reuse the deck creation from Blackjack or implement a simple one here. 
// For simplicity, let's just use a simple local helper.

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

function draw(): CardProps {
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  return { suit, rank };
}

function getValue(hand: CardProps[]) {
  let total = 0;
  hand.forEach(c => {
    if (['10', 'J', 'Q', 'K'].includes(c.rank)) total += 0;
    else if (c.rank === 'A') total += 1;
    else total += parseInt(c.rank);
  });
  return total % 10;
}

export default function BaccaratScreen() {
  const router = useRouter();
  const { user, removeChips, addChips, addXp, updateStats } = useUser();
  const [betAmount, setBetAmount] = useState(100);
  const [betType, setBetType] = useState<'player' | 'banker' | 'tie' | null>(null);
  
  const [playerHand, setPlayerHand] = useState<CardProps[]>([]);
  const [bankerHand, setBankerHand] = useState<CardProps[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'result'>('betting');
  const [winner, setWinner] = useState<string>('');

  const deal = () => {
    if (!betType) {
      Alert.alert('Select Player, Banker or Tie');
      return;
    }
    if (user.chips < betAmount) {
      Alert.alert('Insufficient chips');
      return;
    }

    removeChips(betAmount);
    setGameState('result');
    updateStats({ gamesPlayed: 1 });

    const pHand = [draw(), draw()];
    const bHand = [draw(), draw()];
    
    // Simple logic (standard rules are complex, we'll do straight comparison for MVP)
    // In real baccarat, 3rd card rules apply. Here we'll stick to 2 cards for brevity, 
    // or add a simple 3rd card random chance for flair?
    // Let's implement basic 3rd card rule:
    let pScore = getValue(pHand);
    let bScore = getValue(bHand);

    // Player draws if 0-5
    if (pScore <= 5) {
      pHand.push(draw());
      pScore = getValue(pHand);
    }

    // Banker draws if 0-5 (very simplified version of actual complex banker rules)
    if (bScore <= 5) {
      bHand.push(draw());
      bScore = getValue(bHand);
    }

    setPlayerHand(pHand);
    setBankerHand(bHand);

    let res = '';
    let payout = 0;

    if (pScore > bScore) res = 'player';
    else if (bScore > pScore) res = 'banker';
    else res = 'tie';

    setWinner(res);

    if (betType === res) {
      if (res === 'tie') {
        payout = betAmount * 9; // 8:1 usually
        addChips(payout);
      } else {
        payout = betAmount * 2; // 1:1
        // Commission usually 5% on banker, ignoring for MVP
        addChips(payout);
      }
      addXp(100);
      updateStats({ gamesWon: 1, totalChipsWon: payout });
    } else {
      addXp(10);
    }
  };

  const reset = () => {
    setGameState('betting');
    setPlayerHand([]);
    setBankerHand([]);
    setBetType(null);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Chip amount={user.chips} />
      </View>

      <View style={styles.table}>
        <View style={styles.handSection}>
          <ThemedText variant="h3">Banker {gameState === 'result' && `(${getValue(bankerHand)})`}</ThemedText>
          <View style={styles.cards}>
             {bankerHand.map((c, i) => <Card key={i} {...c} />)}
             {bankerHand.length === 0 && <View style={styles.placeholder} />}
          </View>
        </View>

        <View style={styles.center}>
          {gameState === 'result' && (
             <ThemedText variant="h1" weight="bold" color={winner === betType ? Colors.success : Colors.error}>
               {winner.toUpperCase()} WINS
             </ThemedText>
          )}
        </View>

        <View style={styles.handSection}>
          <ThemedText variant="h3">Player {gameState === 'result' && `(${getValue(playerHand)})`}</ThemedText>
          <View style={styles.cards}>
             {playerHand.map((c, i) => <Card key={i} {...c} />)}
             {playerHand.length === 0 && <View style={styles.placeholder} />}
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        {gameState === 'betting' ? (
          <View style={styles.betOptions}>
            <Button 
              title="PLAYER (1:1)" 
              variant={betType === 'player' ? 'primary' : 'outline'} 
              onPress={() => setBetType('player')} 
              style={{ flex: 1 }}
            />
            <Button 
              title="TIE (8:1)" 
              variant={betType === 'tie' ? 'primary' : 'outline'} 
              onPress={() => setBetType('tie')} 
              style={{ flex: 1 }}
            />
            <Button 
              title="BANKER (1:1)" 
              variant={betType === 'banker' ? 'primary' : 'outline'} 
              onPress={() => setBetType('banker')} 
              style={{ flex: 1 }}
            />
          </View>
        ) : (
          <Button title="New Game" onPress={reset} />
        )}
        
        {gameState === 'betting' && (
           <Button title="Deal" onPress={deal} style={{ marginTop: 16 }} />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: { padding: 8 },
  table: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
  handSection: {
    alignItems: 'center',
    gap: 12,
  },
  cards: {
    flexDirection: 'row',
    gap: -30,
  },
  placeholder: {
    width: 70, height: 98,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6, borderStyle: 'dashed'
  },
  center: {
    alignItems: 'center',
    height: 50,
  },
  controls: {
    padding: 20,
  },
  betOptions: {
    flexDirection: 'row',
    gap: 8,
  },
});
