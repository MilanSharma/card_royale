import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/game/Card';
import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { useBlackjack } from '@/hooks/useBlackjack';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';

export default function BlackjackScreen() {
  const router = useRouter();
  const { user, removeChips, addChips, addXp, updateStats } = useUser();
  const game = useBlackjack();
  const [selectedBet, setSelectedBet] = useState(100);

  // Handle Game Over payouts
  useEffect(() => {
    if (game.gameState === 'gameOver' && game.result) {
      let winAmount = 0;
      
      const stats = {
        gamesPlayed: 1,
        gamesWon: 0,
        blackjacks: 0,
        totalChipsWon: 0,
      };
      
      if (game.result === 'blackjack') {
        winAmount = Math.floor(game.currentBet * 2.5);
        addChips(winAmount); 
        addXp(100);
        stats.gamesWon = 1;
        stats.blackjacks = 1;
        stats.totalChipsWon = winAmount;
      } else if (game.result === 'win') {
        winAmount = game.currentBet * 2;
        addChips(winAmount); 
        addXp(50);
        stats.gamesWon = 1;
        stats.totalChipsWon = winAmount;
      } else if (game.result === 'push') {
        winAmount = game.currentBet;
        addChips(winAmount); 
      } else {
        addXp(10); 
      }
      
      // Update persistent stats and check achievements
      updateStats(stats);
    }
  }, [game.gameState, game.result, game.currentBet]);

  const handlePlaceBet = () => {
    if (selectedBet > user.chips) {
      Alert.alert('Insufficient Funds', 'You need more chips!');
      return;
    }
    if (removeChips(selectedBet)) {
      game.startNewGame(selectedBet);
    }
  };

  const handleLeave = () => {
    if (game.gameState === 'playing' || game.gameState === 'dealerTurn') {
      Alert.alert(
        'Leave Game?',
        'If you leave now, you will lose your current bet.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const chipsValues = [10, 50, 100, 500, 1000];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLeave} style={styles.backButton}>
          <ArrowLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Chip amount={user.chips} />
      </View>

      <View style={styles.table}>
        {/* Dealer Section */}
        <View style={styles.dealerSection}>
          <ThemedText variant="label" style={styles.label}>Dealer {game.gameState !== 'betting' && `(${game.dealerScore})`}</ThemedText>
          <View style={styles.cardsRow}>
            {game.dealerHand.map((card, index) => (
              <View key={index} style={[styles.cardWrapper, { marginLeft: index > 0 ? -40 : 0 }]}>
                <Card 
                  suit={card.suit} 
                  rank={card.rank} 
                  hidden={index === 0 && game.gameState === 'playing'} 
                />
              </View>
            ))}
            {game.dealerHand.length === 0 && (
               <View style={styles.emptyCardPlaceholder} />
            )}
          </View>
        </View>

        {/* Center / Messages */}
        <View style={styles.centerSection}>
          {game.gameState === 'gameOver' && (
            <View style={styles.resultBanner}>
              <ThemedText variant="h1" weight="bold" style={{ color: Colors.primary }}>
                {game.result === 'blackjack' ? 'BLACKJACK!' : 
                 game.result === 'win' ? 'YOU WIN!' :
                 game.result === 'lose' || game.result === 'bust' ? 'DEALER WINS' : 'PUSH'}
              </ThemedText>
              <ThemedText variant="h3" style={{ color: Colors.text }}>
                {game.result === 'blackjack' ? `+${Math.floor(game.currentBet * 1.5)}` :
                 game.result === 'win' ? `+${game.currentBet}` :
                 game.result === 'push' ? '+0' : `-${game.currentBet}`}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Player Section */}
        <View style={styles.playerSection}>
          <ThemedText variant="label" style={styles.label}>You {game.gameState !== 'betting' && `(${game.playerScore})`}</ThemedText>
          <View style={styles.cardsRow}>
            {game.playerHand.map((card, index) => (
              <View key={index} style={[styles.cardWrapper, { marginLeft: index > 0 ? -40 : 0 }]}>
                 <Card suit={card.suit} rank={card.rank} />
              </View>
            ))}
             {game.playerHand.length === 0 && (
               <View style={styles.emptyCardPlaceholder} />
            )}
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {game.gameState === 'betting' ? (
          <>
            <View style={styles.chipSelector}>
              {chipsValues.map(val => (
                <TouchableOpacity 
                  key={val} 
                  onPress={() => setSelectedBet(val)}
                  style={[styles.chipBtn, selectedBet === val && styles.chipBtnSelected]}
                >
                  <ThemedText weight="bold" style={{ color: selectedBet === val ? Colors.primary : Colors.textDim }}>{val}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <Button 
              title={`Deal • ${selectedBet}`} 
              onPress={handlePlaceBet} 
              style={{ width: '100%' }}
            />
          </>
        ) : game.gameState === 'playing' ? (
          <View style={styles.actionButtons}>
            <Button title="Hit" onPress={game.hit} variant="secondary" style={{ flex: 1 }} />
            <View style={{ width: 16 }} />
            <Button title="Stand" onPress={game.stand} style={{ flex: 1 }} />
          </View>
        ) : (
          <Button title="New Game" onPress={game.resetGame} style={{ width: '100%' }} />
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
  backButton: {
    padding: 8,
  },
  table: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  dealerSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  playerSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginBottom: 12,
    color: Colors.textDim,
  },
  cardsRow: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyCardPlaceholder: {
    width: 70, 
    height: 98, 
    borderWidth: 2, 
    borderColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 6,
    borderStyle: 'dashed'
  },
  controls: {
    padding: 24,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
  },
  chipSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  resultBanner: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    width: '80%',
  },
});
