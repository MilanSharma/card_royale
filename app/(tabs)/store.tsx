import { View, ScrollView, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function StoreScreen() {
  const { user, addChips } = useUser();

  const handleBuy = (amount: number) => {
    addChips(amount);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="h1" weight="bold">Chip Store</ThemedText>
          <Chip amount={user.chips} />
        </View>

        <ThemedText style={{ marginBottom: 24, color: Colors.textDim }}>
          Top up your balance to keep playing high stakes tables.
        </ThemedText>

        <View style={styles.grid}>
          <StoreItem 
            chips={1000} 
            price="$0.99" 
            onBuy={() => handleBuy(1000)} 
          />
          <StoreItem 
            chips={5000} 
            price="$4.99" 
            popular 
            onBuy={() => handleBuy(5000)} 
          />
          <StoreItem 
            chips={10000} 
            price="$9.99" 
            onBuy={() => handleBuy(10000)} 
          />
          <StoreItem 
            chips={50000} 
            price="$49.99" 
            variant="gold"
            onBuy={() => handleBuy(50000)} 
          />
        </View>

        <View style={styles.adSection}>
          <LinearGradient
            colors={[Colors.surfaceLight, Colors.surface] as any}
            style={styles.adCard}
          >
            <ThemedText variant="h3" weight="bold">Free Chips</ThemedText>
            <ThemedText style={{ marginVertical: 8, color: Colors.textDim }}>
              Watch a short video to earn 500 chips instantly.
            </ThemedText>
            <Button title="Watch Ad (+500)" onPress={() => handleBuy(500)} variant="secondary" />
          </LinearGradient>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

function StoreItem({ chips, price, popular, variant = 'standard', onBuy }: any) {
  const isGold = variant === 'gold';
  
  return (
    <View style={styles.itemWrapper}>
      <LinearGradient
        colors={isGold ? Colors.goldGradient : [Colors.surface, Colors.surfaceLight] as any}
        style={styles.item}
      >
        {popular && (
          <View style={styles.badge}>
            <ThemedText variant="caption" weight="bold" style={{ color: Colors.background }}>BEST VALUE</ThemedText>
          </View>
        )}
        
        <View style={styles.chipIcon}>
          <ThemedText variant="h1">{isGold ? '🏆' : '🪙'}</ThemedText>
        </View>
        
        <ThemedText 
          variant="h3" 
          weight="bold" 
          style={{ color: isGold ? Colors.background : Colors.text, marginTop: 12 }}
        >
          {chips.toLocaleString()}
        </ThemedText>
        
        <Button 
          title={price} 
          onPress={onBuy} 
          size="sm" 
          variant={isGold ? 'secondary' : 'primary'}
          style={{ marginTop: 16, minWidth: 100 }} 
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  itemWrapper: {
    width: '47%',
    aspectRatio: 0.8,
  },
  item: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIcon: {
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adSection: {
    marginTop: 32,
  },
  adCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
});
