import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ACHIEVEMENTS, UserStats, AchievementDefinition } from '@/constants/achievements';

interface UserState {
  chips: number;
  xp: number;
  level: number;
  username: string;
  stats: UserStats;
  unlockedAchievements: string[];
}

const INITIAL_CHIPS = 10000;
const INITIAL_STATS: UserStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  blackjacks: 0,
  totalChipsWon: 0,
  highestBalance: INITIAL_CHIPS,
};

const INITIAL_STATE: UserState = {
  chips: INITIAL_CHIPS,
  xp: 0,
  level: 1,
  username: 'Guest Player',
  stats: INITIAL_STATS,
  unlockedAchievements: [],
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [localState, setLocalState] = useState<UserState>(INITIAL_STATE);
  const [notificationQueue, setNotificationQueue] = useState<AchievementDefinition[]>([]);

  // Load state from storage
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem('card-royale-user');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Ensure stats object exists for migrated users
          return {
            ...INITIAL_STATE,
            ...parsed,
            stats: { ...INITIAL_STATS, ...parsed.stats },
          };
        }
        return INITIAL_STATE;
      } catch (e) {
        console.error('Failed to load user', e);
        return INITIAL_STATE;
      }
    },
  });

  // Hydrate state once loaded
  if (userQuery.data && !userQuery.isStale && userQuery.data !== localState && localState === INITIAL_STATE) {
    setLocalState(userQuery.data);
  }

  const { mutate: syncUser } = useMutation({
    mutationFn: async (newState: UserState) => {
      await AsyncStorage.setItem('card-royale-user', JSON.stringify(newState));
    },
  });

  const addChips = useCallback((amount: number) => {
    setLocalState((prev) => {
      const newChips = prev.chips + amount;
      const newHighest = Math.max(prev.stats.highestBalance, newChips);
      const newState = {
        ...prev,
        chips: newChips,
        stats: {
          ...prev.stats,
          highestBalance: newHighest,
        }
      };
      syncUser(newState);
      return newState;
    });
  }, [syncUser]);

  const removeChips = useCallback((amount: number): boolean => {
    if (localState.chips >= amount) {
      setLocalState((prev) => {
        const newState = { ...prev, chips: prev.chips - amount };
        syncUser(newState);
        return newState;
      });
      return true;
    }
    return false;
  }, [localState.chips, syncUser]);

  const addXp = useCallback((amount: number) => {
    setLocalState((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      const xpNeeded = newLevel * 1000;
      
      if (newXp >= xpNeeded) {
        newXp -= xpNeeded;
        newLevel += 1;
      }
      
      const next = { ...prev, xp: newXp, level: newLevel };
      syncUser(next);
      return next;
    });
  }, [syncUser]);

  const updateStats = useCallback((gameStats: Partial<UserStats>) => {
    setLocalState((prev) => {
      // 1. Calculate new stats
      const newStats: UserStats = {
        gamesPlayed: prev.stats.gamesPlayed + (gameStats.gamesPlayed || 0),
        gamesWon: prev.stats.gamesWon + (gameStats.gamesWon || 0),
        blackjacks: prev.stats.blackjacks + (gameStats.blackjacks || 0),
        totalChipsWon: prev.stats.totalChipsWon + (gameStats.totalChipsWon || 0),
        highestBalance: Math.max(prev.stats.highestBalance, prev.chips),
      };

      // 2. Check for new unlocks
      const newUnlockedIds: string[] = [];
      const newAchievements: AchievementDefinition[] = [];
      let xpBonus = 0;

      ACHIEVEMENTS.forEach((ach) => {
        if (!prev.unlockedAchievements.includes(ach.id) && ach.condition(newStats)) {
          newUnlockedIds.push(ach.id);
          newAchievements.push(ach);
          xpBonus += ach.xpReward;
        }
      });

      // 3. Update Notification Queue
      if (newAchievements.length > 0) {
        setNotificationQueue((q) => [...q, ...newAchievements]);
      }

      // 4. Update Level if needed
      let newXp = prev.xp + xpBonus;
      let newLevel = prev.level;
      while (newXp >= newLevel * 1000) {
        newXp -= newLevel * 1000;
        newLevel += 1;
      }

      const nextState = {
        ...prev,
        stats: newStats,
        unlockedAchievements: [...prev.unlockedAchievements, ...newUnlockedIds],
        xp: newXp,
        level: newLevel,
      };
      
      syncUser(nextState);
      return nextState;
    });
  }, [syncUser]);

  const dismissNotification = useCallback(() => {
    setNotificationQueue((prev) => prev.slice(1));
  }, []);

  return {
    user: localState,
    addChips,
    removeChips,
    addXp,
    updateStats,
    notificationQueue,
    dismissNotification,
    isLoading: userQuery.isLoading,
  };
});
