import { View, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { ArrowLeft } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const SYMBOLS = ['🍒', '🍋', '🍇', '💎', '7️⃣', '🔔'];
const REEL_COUNT = 3;

export default function SlotsScreen() {
  const router = useRouter();
  const { user, removeChips, addChips, addXp, updateStats } = useUser();
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<string[]>(['7️⃣', '7️⃣', '7️⃣']);
  const [bet, setBet] = useState(50);
  const [winMessage, setWinMessage] = useState('');

  const spin = async () => {
    if (spinning) return;
    if (user.chips < bet) {
      Alert.alert('Insufficient Chips');
      return;
    }
    
    removeChips(bet);
    setSpinning(true);
    setWinMessage('');
    updateStats({ gamesPlayed: 1 });

    // Simple simulation of spinning
    let interval = setInterval(() => {
      setReels(prev => prev.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const result = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ];
      
      // Rig it slightly for demo fun (10% chance of pair)
      if (Math.random() < 0.1) result[1] = result[0];

      setReels(result);
      checkWin(result);
      setSpinning(false);
    }, 2000);
  };

  const checkWin = (result: string[]) => {
    const isJackpot = result[0] === result[1] && result[1] === result[2];
    const isPair = result[0] === result[1] || result[1] === result[2] || result[0] === result[2];

    if (isJackpot) {
      const win = bet * 10; // Simple payout
      addChips(win);
      addXp(100);
      updateStats({ gamesWon: 1, totalChipsWon: win });
      setWinMessage(`JACKPOT! +${win}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (isPair) {
      const win = Math.floor(bet * 1.5);
      addChips(win);
      addXp(20);
      updateStats({ gamesWon: 1, totalChipsWon: win });
      setWinMessage(`Nice! +${win}`);
    } else {
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

      <View style={styles.machineContainer}>
        <LinearGradient
          colors={['#333', '#111']}
          style={styles.reelContainer}
        >
          {reels.map((symbol, i) => (
            <View key={i} style={styles.reel}>
              <ThemedText style={styles.symbol}>{symbol}</ThemedText>
            </View>
          ))}
        </LinearGradient>
        
        {winMessage ? (
          <ThemedText variant="h2" weight="bold" color={Colors.primary} style={styles.winText}>
            {winMessage}
          </ThemedText>
        ) : <View style={styles.winPlaceholder} />}
      </View>

      <View style={styles.controls}>
        <View style={styles.betControls}>
          <ThemedText>Bet: {bet}</ThemedText>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="-50" size="sm" variant="secondary" onPress={() => setBet(Math.max(50, bet - 50))} />
            <Button title="+50" size="sm" variant="secondary" onPress={() => setBet(bet + 50)} />
          </View>
        </View>
        
        <Button 
          title={spinning ? "Spinning..." : "SPIN"} 
          onPress={spin} 
          disabled={spinning}
          size="lg"
        />
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
  machineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  reelContainer: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#D4AF37',
    gap: 10,
  },
  reel: {
    width: 80,
    height: 100,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  symbol: {
    fontSize: 50,
  },
  winText: {
    marginTop: 40,
    textAlign: 'center',
  },
  winPlaceholder: {
    height: 32,
    marginTop: 40,
  },
  controls: {
    padding: 20,
    gap: 20,
  },
  betControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
  },
});
