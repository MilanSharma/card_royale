import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';

const NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

export default function RouletteScreen() {
  const router = useRouter();
  const { user, removeChips, addChips, addXp, updateStats } = useUser();
  const [selectedBet, setSelectedBet] = useState<'red' | 'black' | 'even' | 'odd' | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);

  const getColor = (num: number) => {
    if (num === 0) return 'green';
    // Simplified logic: Odd is usually red in simple view, but Roulette is specific.
    // Standard Red numbers: 1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
    const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    return reds.includes(num) ? 'red' : 'black';
  };

  const spin = () => {
    if (!selectedBet) {
      Alert.alert('Place a bet first');
      return;
    }
    if (user.chips < betAmount) {
      Alert.alert('Insufficient chips');
      return;
    }

    removeChips(betAmount);
    setSpinning(true);
    setResult(null);
    updateStats({ gamesPlayed: 1 });

    // Fake spin delay
    setTimeout(() => {
      const winningNumber = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
      setResult(winningNumber);
      setSpinning(false);
      
      const winningColor = getColor(winningNumber);
      const isEven = winningNumber !== 0 && winningNumber % 2 === 0;
      const isOdd = winningNumber !== 0 && winningNumber % 2 !== 0;

      let won = false;
      if (selectedBet === 'red' && winningColor === 'red') won = true;
      if (selectedBet === 'black' && winningColor === 'black') won = true;
      if (selectedBet === 'even' && isEven) won = true;
      if (selectedBet === 'odd' && isOdd) won = true;

      if (won) {
        const win = betAmount * 2;
        addChips(win);
        addXp(50);
        updateStats({ gamesWon: 1, totalChipsWon: win });
      } else {
        addXp(5);
      }
    }, 1500);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Chip amount={user.chips} />
      </View>

      <View style={styles.content}>
        {/* Wheel Display */}
        <View style={styles.wheelSection}>
          <View style={[styles.wheel, spinning && styles.wheelSpinning]}>
             <ThemedText variant="h1" style={{ fontSize: 60 }}>
               {result !== null ? result : '🎡'}
             </ThemedText>
             {result !== null && (
               <View style={[styles.resultBadge, { backgroundColor: getColor(result) === 'red' ? Colors.red : getColor(result) === 'black' ? '#333' : 'green' }]}>
                 <ThemedText weight="bold">{getColor(result).toUpperCase()}</ThemedText>
               </View>
             )}
          </View>
        </View>

        {/* Betting Board */}
        <View style={styles.bettingBoard}>
          <ThemedText variant="h3" style={{ marginBottom: 16, textAlign: 'center' }}>
            Current Bet: {betAmount}
          </ThemedText>
          
          <View style={styles.row}>
            <BetButton 
              label="RED" 
              color={Colors.red} 
              selected={selectedBet === 'red'} 
              onPress={() => setSelectedBet('red')} 
            />
            <BetButton 
              label="BLACK" 
              color="#333" 
              selected={selectedBet === 'black'} 
              onPress={() => setSelectedBet('black')} 
            />
          </View>
          <View style={styles.row}>
            <BetButton 
              label="EVEN" 
              color="#444" 
              selected={selectedBet === 'even'} 
              onPress={() => setSelectedBet('even')} 
            />
            <BetButton 
              label="ODD" 
              color="#444" 
              selected={selectedBet === 'odd'} 
              onPress={() => setSelectedBet('odd')} 
            />
          </View>
        </View>

        <View style={styles.controls}>
           <Button title={spinning ? "No More Bets" : "Spin"} onPress={spin} disabled={spinning} />
        </View>
      </View>
    </ScreenContainer>
  );
}

function BetButton({ label, color, selected, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.betButton, 
        { backgroundColor: color },
        selected && styles.betButtonSelected
      ]}
    >
      <ThemedText weight="bold">{label}</ThemedText>
    </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  wheelSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  wheelSpinning: {
    opacity: 0.5,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  bettingBoard: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  betButton: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  betButtonSelected: {
    borderColor: Colors.primary,
  },
  controls: {
    marginTop: 20,
  },
});
