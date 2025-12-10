import { useState, useCallback, useEffect, useRef } from 'react';
import { CardProps, Suit, Rank } from '@/components/game/Card';

export type GameState = 'betting' | 'playing' | 'dealerTurn' | 'gameOver';
export type GameResult = 'win' | 'lose' | 'push' | 'blackjack' | 'bust' | null;

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck(decks = 6): CardProps[] {
  let deck: CardProps[] = [];
  for (let d = 0; d < decks; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ suit, rank });
      }
    }
  }
  return shuffle(deck);
}

function shuffle(deck: CardProps[]): CardProps[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

function getCardValue(rank: Rank): number {
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  if (rank === 'A') return 11;
  return parseInt(rank, 10);
}

function calculateScore(hand: CardProps[]): number {
  let score = 0;
  let aces = 0;

  for (const card of hand) {
    const value = getCardValue(card.rank);
    score += value;
    if (card.rank === 'A') aces += 1;
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}

export function useBlackjack() {
  // We use a ref for the deck to handle synchronous updates in loops (dealer turn)
  const deckRef = useRef<CardProps[]>([]);
  
  const [dealerHand, setDealerHand] = useState<CardProps[]>([]);
  const [playerHand, setPlayerHand] = useState<CardProps[]>([]);
  const [gameState, setGameState] = useState<GameState>('betting');
  const [result, setResult] = useState<GameResult>(null);
  const [currentBet, setCurrentBet] = useState(0);

  // Initialize deck
  useEffect(() => {
    deckRef.current = createDeck();
  }, []);

  const drawCard = useCallback((): CardProps => {
    if (deckRef.current.length < 15) {
      deckRef.current = createDeck();
    }
    return deckRef.current.pop()!;
  }, []);

  const startNewGame = useCallback((bet: number) => {
    if (bet <= 0) return;
    
    // Initial deal
    const p1 = drawCard();
    const d1 = drawCard();
    const p2 = drawCard();
    const d2 = drawCard();

    const pHand = [p1, p2];
    const dHand = [d1, d2];
    
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setCurrentBet(bet);
    setResult(null);

    const pScore = calculateScore(pHand);
    const dScore = calculateScore(dHand);
    
    // Check for blackjack immediately
    if (pScore === 21) {
      if (dScore === 21) {
         setGameState('gameOver');
         setResult('push');
      } else {
         setGameState('gameOver');
         setResult('blackjack');
      }
    } else {
      setGameState('playing');
    }
  }, [drawCard]);

  const hit = useCallback(() => {
    const card = drawCard();
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    
    const score = calculateScore(newHand);
    if (score > 21) {
      setGameState('gameOver');
      setResult('bust');
    }
  }, [playerHand, drawCard]);

  const stand = useCallback(() => {
    setGameState('dealerTurn');
  }, []);

  const determineWinner = useCallback((finalDealerHand: CardProps[]) => {
    const pScore = calculateScore(playerHand);
    const dScore = calculateScore(finalDealerHand);

    let res: GameResult = 'lose';

    if (dScore > 21) {
      res = 'win';
    } else if (pScore > dScore) {
      res = 'win';
    } else if (pScore === dScore) {
      res = 'push';
    } else {
      res = 'lose';
    }

    setResult(res);
    setGameState('gameOver');
  }, [playerHand]);

  // Dealer Logic
  useEffect(() => {
    if (gameState === 'dealerTurn') {
      let dHand = [...dealerHand];
      let dScore = calculateScore(dHand);

      const playDealer = async () => {
        // Reveal hidden card animation delay
        await new Promise(r => setTimeout(r, 600));
        
        while (dScore < 17) {
          await new Promise(r => setTimeout(r, 800));
          const card = drawCard();
          dHand = [...dHand, card];
          setDealerHand(dHand); // visual update
          dScore = calculateScore(dHand);
        }

        // Final delay before result
        await new Promise(r => setTimeout(r, 500));
        determineWinner(dHand);
      };

      playDealer();
    }
  }, [gameState, dealerHand, drawCard, determineWinner]);

  const resetGame = useCallback(() => {
    setGameState('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setResult(null);
  }, []);

  return {
    dealerHand,
    playerHand,
    gameState,
    result,
    currentBet,
    startNewGame,
    hit,
    stand,
    resetGame,
    playerScore: calculateScore(playerHand),
    dealerScore: calculateScore(dealerHand),
  };
}
