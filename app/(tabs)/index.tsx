import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Chip } from '@/components/ui/Chip';
import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { Play, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LobbyScreen() {
  const router = useRouter();
  const { user } = useUser();

  const handlePlayBlackjack = () => {
    router.push('/game/blackjack');
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header / Stats */}
        <View style={styles.header}>
          <View>
            <ThemedText variant="label" color={Colors.primary}>Welcome Back</ThemedText>
            <ThemedText variant="h2" weight="bold">{user.username}</ThemedText>
          </View>
          <Chip amount={user.chips} size="lg" />
        </View>

        {/* Featured Game */}
        <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>Featured</ThemedText>
        
        <TouchableOpacity activeOpacity={0.9} onPress={handlePlayBlackjack}>
          <LinearGradient
            colors={Colors.goldGradient as any}
            style={styles.featuredCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.featuredContent}>
              <View>
                <ThemedText variant="label" style={{ color: Colors.background }}>LIVE NOW</ThemedText>
                <ThemedText variant="h1" weight="bold" style={{ color: Colors.background }}>Blackjack</ThemedText>
                <ThemedText style={{ color: Colors.background, marginTop: 4 }}>Standard Pays 3:2 • Dealer stands on 17</ThemedText>
              </View>
              <View style={styles.playButton}>
                <Play fill={Colors.primary} color={Colors.primary} />
              </View>
            </View>
            
            {/* Decorative Card Art Overlay */}
            <View style={styles.cardArt}>
               <ThemedText style={{ fontSize: 80 }}>♠️</ThemedText>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Other Games */}
        <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>All Games</ThemedText>
        
        <View style={styles.grid}>
          <GameCard title="Poker" locked />
          <GameCard title="Roulette" locked />
          <GameCard title="Baccarat" locked />
          <GameCard title="Slots" locked />
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

function GameCard({ title, locked }: { title: string, locked?: boolean }) {
  return (
    <View style={styles.gameCard}>
      <LinearGradient
        colors={[Colors.surface, Colors.surfaceLight] as any}
        style={styles.gameCardGradient}
      >
        <View style={styles.gameIcon}>
          {locked ? <Lock color={Colors.textDim} /> : <Play color={Colors.primary} />}
        </View>
        <ThemedText weight="bold" style={{ marginTop: 12 }} color={locked ? Colors.textDim : Colors.text}>{title}</ThemedText>
        {locked && <ThemedText variant="caption" style={{ marginTop: 4 }}>Coming Soon</ThemedText>}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 8,
  },
  featuredCard: {
    height: 180,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  cardArt: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.2,
    transform: [{ rotate: '-15deg' }],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gameCard: {
    width: '47%', // roughly half minus gap
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gameCardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
