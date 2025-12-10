import { View, StyleSheet, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { ACHIEVEMENTS, AchievementDefinition } from '@/constants/achievements';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';

export default function AchievementsScreen() {
  const { user } = useUser();

  const renderItem = ({ item }: { item: AchievementDefinition }) => {
    const isUnlocked = user.unlockedAchievements.includes(item.id);

    return (
      <View style={[styles.card, !isUnlocked && styles.cardLocked]}>
        <LinearGradient
          colors={isUnlocked ? [Colors.surface, Colors.surfaceLight] : ['rgba(21, 27, 41, 0.5)', 'rgba(21, 27, 41, 0.5)']}
          style={styles.cardContent}
        >
          <View style={[styles.iconBox, !isUnlocked && styles.iconBoxLocked]}>
            {isUnlocked ? (
              <ThemedText style={{ fontSize: 32 }}>{item.icon}</ThemedText>
            ) : (
              <Lock color={Colors.textDim} size={24} />
            )}
          </View>
          
          <View style={styles.info}>
            <View style={styles.header}>
              <ThemedText weight="bold" style={{ color: isUnlocked ? Colors.text : Colors.textDim }}>
                {item.title}
              </ThemedText>
              {isUnlocked && <ThemedText variant="caption" color={Colors.primary}>+{item.xpReward} XP</ThemedText>}
            </View>
            <ThemedText variant="caption" style={{ marginTop: 4, color: Colors.textDim }}>
              {item.description}
            </ThemedText>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <ThemedText variant="h1" weight="bold">Achievements</ThemedText>
          <ThemedText style={{ color: Colors.textDim, marginTop: 4 }}>
            {user.unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
          </ThemedText>
        </View>

        <FlatList
          data={ACHIEVEMENTS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    marginVertical: 24,
  },
  list: {
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLocked: {
    borderColor: 'rgba(255,255,255,0.05)',
    opacity: 0.7,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  iconBoxLocked: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'transparent',
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
