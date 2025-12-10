import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useUser } from '@/context/UserContext';
import { ThemedText } from './ThemedText';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export function AchievementNotification() {
  const { notificationQueue, dismissNotification } = useUser();
  const currentAchievement = notificationQueue[0];
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (currentAchievement) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Animate In
      Animated.spring(translateY, {
        toValue: 60, // Top inset
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }).start();

      // Wait and Animate Out
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -150,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          dismissNotification();
          translateY.setValue(-150); // Reset for next
        });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [currentAchievement, dismissNotification, translateY]);

  if (!currentAchievement) return null;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY }] }]}>
      <LinearGradient
        colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.98)']}
        style={styles.container}
      >
        <View style={styles.iconContainer}>
          <ThemedText style={{ fontSize: 32 }}>{currentAchievement.icon}</ThemedText>
        </View>
        <View style={styles.textContainer}>
          <ThemedText variant="label" color={Colors.primary} style={{ marginBottom: 2 }}>ACHIEVEMENT UNLOCKED</ThemedText>
          <ThemedText variant="h3" weight="bold" style={{ color: Colors.white }}>{currentAchievement.title}</ThemedText>
          <ThemedText variant="caption" style={{ color: Colors.textDim }}>+{currentAchievement.xpReward} XP</ThemedText>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  textContainer: {
    flex: 1,
  },
});
