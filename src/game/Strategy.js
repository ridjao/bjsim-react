export class Strategy {
  getAction(playerTotal, dealerTotal, soft, pair, cards) {
    throw new Error("Strategy must implement getAction method");
  }

  computeBet(count) {
    return 1.0;
  }
}

export class BasicStrategy extends Strategy {
  getAction(playerTotal, dealerTotal, soft, pair, cards) {
    // Basic strategy implementation
    if (pair) {
      return this.getPairAction(playerTotal, dealerTotal);
    }
    
    if (soft) {
      return this.getSoftAction(playerTotal, dealerTotal);
    }
    
    // Check for surrender opportunities (only valid with exactly 2 cards)
    if (cards && cards.length === 2 && !soft && !pair) {
      if ((playerTotal === 16 && (dealerTotal === 9 || dealerTotal === 10 || dealerTotal === 11)) ||
          (playerTotal === 15 && dealerTotal === 10)) {
        return 'r';
      }
    }
    
    return this.getHardAction(playerTotal, dealerTotal);
  }

  getPairAction(playerTotal, dealerTotal) {
    const pairRank = playerTotal / 2;
    
    if (pairRank === 11) return 'p'; // Always split Aces
    if (pairRank === 8) return 'p'; // Always split 8s
    if (pairRank === 10) return 's'; // Never split 10s
    if (pairRank === 5) {
      // Never split 5s, treat as hard 10: double vs 2-9, hit vs 10/A
      return dealerTotal <= 9 ? 'd' : 'h';
    }
    if (pairRank === 4) return 'h'; // Never split 4s
    
    if (pairRank === 9) {
      return (dealerTotal === 7 || dealerTotal === 10 || dealerTotal === 11) ? 's' : 'p';
    }
    
    if (pairRank === 7) {
      return dealerTotal <= 7 ? 'p' : 'h';
    }
    
    if (pairRank === 6) {
      return dealerTotal <= 6 ? 'p' : 'h';
    }
    
    if (pairRank === 3 || pairRank === 2) {
      return dealerTotal <= 7 ? 'p' : 'h';
    }
    
    return 'h';
  }

  getSoftAction(playerTotal, dealerTotal) {
    if (playerTotal >= 19) return 's';
    if (playerTotal === 18) {
      if (dealerTotal <= 6) return 'd';
      if (dealerTotal <= 8) return 's';
      return 'h';
    }
    if (playerTotal === 17) {
      return dealerTotal <= 6 ? 'd' : 'h';
    }
    if (playerTotal >= 15) {
      return dealerTotal <= 6 ? 'd' : 'h';
    }
    if (playerTotal >= 13) {
      return dealerTotal <= 6 ? 'd' : 'h';
    }
    return 'h';
  }

  getHardAction(playerTotal, dealerTotal) {
    if (playerTotal >= 17) return 's';
    if (playerTotal >= 13) {
      return dealerTotal <= 6 ? 's' : 'h';
    }
    if (playerTotal === 12) {
      return (dealerTotal >= 4 && dealerTotal <= 6) ? 's' : 'h';
    }
    if (playerTotal === 11) {
      return 'd';
    }
    if (playerTotal === 10) {
      return dealerTotal <= 9 ? 'd' : 'h';
    }
    if (playerTotal === 9) {
      return (dealerTotal >= 3 && dealerTotal <= 6) ? 'd' : 'h';
    }
    return 'h';
  }
}

export class ConservativeStrategy extends Strategy {
  getAction(playerTotal, dealerTotal, soft, pair, cards) {
    // Conservative strategy - more cautious
    if (playerTotal >= 12) return 's';
    if (playerTotal >= 10) return 'd';
    return 'h';
  }
}

export class InteractiveStrategy extends Strategy {
  getAction(playerTotal, dealerTotal, soft, pair, cards) {
    // For interactive play - will be handled by UI
    return 'h'; // Default to hit
  }
}

export const basic = new BasicStrategy();
export const conservative = new ConservativeStrategy();
export const interactive = new InteractiveStrategy();