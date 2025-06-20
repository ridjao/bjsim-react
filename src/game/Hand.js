export class Hand {
  constructor() {
    this.cards = [];
    this.bet = 0;
    this.doubled = false;
    this.surrendered = false;
  }

  add(card) {
    this.cards.push(card);
  }

  setBet(bet) {
    this.bet = bet;
  }

  getBet() {
    return this.bet;
  }

  getTotal() {
    let total = 0;
    let aces = 0;

    for (const card of this.cards) {
      const value = card.value();
      if (value === 11) {
        aces++;
      }
      total += value;
    }

    // Adjust for aces
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total > 21 ? -1 : total;
  }

  isSoft() {
    let total = 0;
    let aces = 0;

    for (const card of this.cards) {
      const value = card.value();
      if (value === 11) {
        aces++;
      }
      total += value;
    }

    return total <= 21 && aces > 0;
  }

  isPair() {
    return this.cards.length === 2 && 
           this.cards[0].rank() === this.cards[1].rank();
  }

  surrender() {
    this.surrendered = true;
  }

  isDoubled() {
    return this.doubled;
  }

  setDoubled(doubled) {
    this.doubled = doubled;
  }

  isBlackjack() {
    return this.cards.length === 2 && this.getTotal() === 21;
  }

  getCards() {
    return [...this.cards];
  }

  clear() {
    this.cards = [];
    this.bet = 0;
    this.doubled = false;
    this.surrendered = false;
  }
}