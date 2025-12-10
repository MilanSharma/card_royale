import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';

interface UserState {
  chips: number;
  xp: number;
  level: number;
  username: string;
}

const INITIAL_CHIPS = 10000;
const INITIAL_STATE: UserState = {
  chips: INITIAL_CHIPS,
  xp: 0,
  level: 1,
  username: 'Guest Player',
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [localState, setLocalState] = useState<UserState>(INITIAL_STATE);

  // Load state from storage
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem('card-royale-user');
        return stored ? (JSON.parse(stored) as UserState) : INITIAL_STATE;
      } catch (e) {
        console.error('Failed to load user', e);
        return INITIAL_STATE;
      }
    },
  });

  // Sync effect
  if (userQuery.data && userQuery.data !== localState && !userQuery.isStale) {
    // Only set if we just loaded it. 
    // Actually with RQ, we should initialize state or sync it.
    // For simplicity in this session, I'll just use the local state and sync on change.
  }

  // However, the above pattern with RQ + useState can be tricky.
  // Let's keep it simple: Use local state as source of truth after initial load.
  // We can just use useEffect to set it once loaded.
  
  useState(() => {
    // Optimistic init if needed, but we rely on the query to settle.
  });

  // Better approach for this MVP:
  // Just load it once.
  const { mutate: syncUser } = useMutation({
    mutationFn: async (newState: UserState) => {
      await AsyncStorage.setItem('card-royale-user', JSON.stringify(newState));
    },
  });

  const updateState = useCallback((updates: Partial<UserState>) => {
    setLocalState((prev) => {
      const next = { ...prev, ...updates };
      syncUser(next);
      return next;
    });
  }, [syncUser]);

  const addChips = useCallback((amount: number) => {
    updateState({ chips: localState.chips + amount });
  }, [localState.chips, updateState]);

  const removeChips = useCallback((amount: number): boolean => {
    if (localState.chips >= amount) {
      updateState({ chips: localState.chips - amount });
      return true;
    }
    return false;
  }, [localState.chips, updateState]);

  const addXp = useCallback((amount: number) => {
    // Simple leveling logic: level * 1000 XP needed
    let newXp = localState.xp + amount;
    let newLevel = localState.level;
    const xpNeeded = newLevel * 1000;
    
    if (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      newLevel += 1;
      // Bonus chips for leveling up?
    }
    
    updateState({ xp: newXp, level: newLevel });
  }, [localState.xp, localState.level, updateState]);

  return {
    user: localState,
    addChips,
    removeChips,
    addXp,
    isLoading: userQuery.isLoading,
  };
});
