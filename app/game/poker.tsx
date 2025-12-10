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
import { useState, useEffect } from 'react';
import { createDeck, evaluateHand } from '@/utils/poker';

export default function PokerScreen() {
  const router = useRouter();
  const { user, removeChips, addChips, addXp, updateStats } = useUser();
  
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [hand, setHand] = useState<CardProps[]>([]);
  const [heldCards, setHeldCards] = useState<boolean[]>([false, false, false, false, false]);
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'drawing' | 'gameOver'>('betting');
  const [bet, setBet] = useState(50);
  const [winHandName, setWinHandName] = useState('');

  const deal = () => {
    if (user.chips < bet) {
      Alert.alert('Insufficient chips');
      return;
    }
    removeChips(bet);
    updateStats({ gamesPlayed: 1 });

    const newDeck = createDeck();
    const newHand = newDeck.splice(0, 5);
    
    setDeck(newDeck);
    setHand(newHand);
    setHeldCards([false, false, false, false, false]);
    setGameState('drawing');
    setWinHandName('');
  };

  const toggleHold = (index: number) => {
    if (gameState !== 'drawing') return;
    const newHeld = [...heldCards];
    newHeld[index] = !newHeld[index];
    setHeldCards(newHeld);
  };

  const draw = () => {
    const newHand = [...hand];
    const newDeck = [...deck];
    
    // Replace unheld cards
    for (let i = 0; i < 5; i++) {
      if (!heldCards[i]) {
        newHand[i] = newDeck.pop()!;
      }
    }
    
    setHand(newHand);
    setGameState('gameOver');
    
    const result = evaluateHand(newHand);
    if (result) {
      const payout = bet * result.multi;
      setWinHandName(`${result.name}! (+${payout})`);
      addChips(payout);
      addXp(payout > 0 ? 50 : 10);
      
      if (payout > 0) {
         updateStats({ gamesWon: 1, totalChipsWon: payout });
      }
    } else {
      setWinHandName('No Win');
      addXp(5);
    }
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
        <View style={styles.handContainer}>
          {hand.length > 0 ? hand.map((card, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => toggleHold(i)} 
              activeOpacity={0.9}
              style={[styles.cardContainer, heldCards[i] && styles.heldCard]}
            >
              <Card {...card} />
              {heldCards[i] && (
                <View style={styles.holdBadge}>
                  <ThemedText variant="caption" weight="bold" style={{ color: 'black' }}>HELD</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          )) : (
            <View style={styles.placeholder}><ThemedText>Press Deal to Start</ThemedText></View>
          )}
        </View>

        {gameState === 'gameOver' && (
          <ThemedText variant="h2" weight="bold" color={Colors.primary} style={styles.resultText}>
            {winHandName}
          </ThemedText>
        )}
      </View>

      <View style={styles.controls}>
        {gameState === 'betting' || gameState === 'gameOver' ? (
          <Button title={gameState === 'gameOver' ? "New Hand" : "Deal"} onPress={deal} />
        ) : (
          <Button title="Draw" onPress={draw} />
        )}
        <ThemedText style={{ textAlign: 'center', marginTop: 10, color: Colors.textDim }}>Bet: {bet}</ThemedText>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  handContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 120,
    alignItems: 'center',
  },
  cardContainer: {
    position: 'relative',
  },
  heldCard: {
    transform: [{ translateY: -10 }],
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 8,
  },
  holdBadge: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    borderRadius: 4,
  },
  placeholder: {
    height: 100,
    justifyContent: 'center',
  },
  resultText: {
    marginTop: 30,
  },
  controls: {
    padding: 20,
  },
});
