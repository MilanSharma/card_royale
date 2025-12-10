export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  blackjacks: number;
  totalChipsWon: number;
  highestBalance: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: (stats: UserStats) => boolean;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-win',
    title: 'First Blood',
    description: 'Win your first game.',
    icon: '⚔️',
    xpReward: 100,
    condition: (stats) => stats.gamesWon >= 1,
  },
  {
    id: 'blackjack-novice',
    title: 'Natural',
    description: 'Get your first Blackjack.',
    icon: '🃏',
    xpReward: 150,
    condition: (stats) => stats.blackjacks >= 1,
  },
  {
    id: 'veteran',
    title: 'Card Shark',
    description: 'Play 50 hands.',
    icon: '🦈',
    xpReward: 500,
    condition: (stats) => stats.gamesPlayed >= 50,
  },
  {
    id: 'high-roller',
    title: 'High Roller',
    description: 'Win 100,000 chips total.',
    icon: '💰',
    xpReward: 1000,
    condition: (stats) => stats.totalChipsWon >= 100000,
  },
  {
    id: 'blackjack-master',
    title: 'Blackjack Master',
    description: 'Get 10 Blackjacks.',
    icon: '👑',
    xpReward: 2000,
    condition: (stats) => stats.blackjacks >= 10,
  },
  {
    id: 'millionaire',
    title: 'Millionaire',
    description: 'Hold 1,000,000 chips at once.',
    icon: '💎',
    xpReward: 5000,
    condition: (stats) => stats.highestBalance >= 1000000,
  },
];
