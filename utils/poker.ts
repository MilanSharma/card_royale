import { CardProps, Rank, Suit } from '@/components/game/Card';

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export const createDeck = () => {
  const deck: CardProps[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({ suit, rank });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const getRankValue = (rank: Rank) => RANKS.indexOf(rank) + 2;

export const evaluateHand = (hand: CardProps[]) => {
  const values = hand.map(c => getRankValue(c.rank)).sort((a, b) => a - b);
  const suits = hand.map(c => c.suit);
  
  const isFlush = suits.every(s => s === suits[0]);
  // Handle A-5 straight (A=14, so values would be 2,3,4,5,14)
  const isStraight = values.every((v, i) => i === 0 || v === values[i - 1] + 1) || 
                    (values[0] === 2 && values[1] === 3 && values[2] === 4 && values[3] === 5 && values[4] === 14);

  const counts: Record<number, number> = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const countsArr = Object.values(counts).sort((a, b) => b - a);

  if (isFlush && isStraight && values[0] === 10) return { name: 'Royal Flush', multi: 250 };
  if (isFlush && isStraight) return { name: 'Straight Flush', multi: 50 };
  if (countsArr[0] === 4) return { name: 'Four of a Kind', multi: 25 };
  if (countsArr[0] === 3 && countsArr[1] === 2) return { name: 'Full House', multi: 9 };
  if (isFlush) return { name: 'Flush', multi: 6 };
  if (isStraight) return { name: 'Straight', multi: 4 };
  if (countsArr[0] === 3) return { name: 'Three of a Kind', multi: 3 };
  if (countsArr[0] === 2 && countsArr[1] === 2) return { name: 'Two Pair', multi: 2 };
  if (countsArr[0] === 2) {
    // Jacks or Better (11 = Jack)
    const pairValue = parseInt(Object.keys(counts).find(k => counts[parseInt(k)] === 2) || '0');
    if (pairValue >= 11) return { name: 'Jacks or Better', multi: 1 };
  }

  return null;
};
