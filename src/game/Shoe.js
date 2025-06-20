import { Deck } from './Card.js';

export class Shoe {
  constructor() {
    this.cards = [];
    this.runningCount = 0;
    this.devMode = false;
    this.preSelectedCards = [];
    this.devCardIndex = 0;
  }

  load(numDecks = 6) {
    this.cards = [];
    for (let i = 0; i < numDecks; i++) {
      this.cards.push(...Deck.getCards());
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    this.runningCount = 0;
  }

  deal(forcedCard = null) {
    // Check for forced card first (used by original C++ logic)
    if (forcedCard && forcedCard.name !== "0X") {
      this.updateCount(forcedCard);
      return forcedCard;
    }

    // Check for dev mode pre-selected cards
    if (this.devMode && this.preSelectedCards.length > 0) {
      if (this.devCardIndex < this.preSelectedCards.length) {
        const card = this.preSelectedCards[this.devCardIndex];
        this.devCardIndex++;
        this.updateCount(card);
        return card;
      }
      // If we've used all pre-selected cards, fall back to normal dealing
    }

    // Normal dealing logic
    if (this.cards.length === 0) {
      this.load(6);
      this.shuffle();
    }

    const card = this.cards.pop();
    this.updateCount(card);
    return card;
  }

  updateCount(card) {
    const value = card.value();
    if (value >= 2 && value <= 6) {
      this.runningCount++;
    } else if (value === 10 || value === 11) {
      this.runningCount--;
    }
  }

  count() {
    return this.runningCount;
  }

  remainingCards() {
    return this.cards.length;
  }

  // Dev mode methods
  setDevMode(enabled) {
    this.devMode = enabled;
    if (!enabled) {
      this.preSelectedCards = [];
      this.devCardIndex = 0;
    }
  }

  setPreSelectedCards(cards) {
    this.preSelectedCards = cards;
    this.devCardIndex = 0;
  }

  addPreSelectedCard(card) {
    this.preSelectedCards.push(card);
  }

  clearPreSelectedCards() {
    this.preSelectedCards = [];
    this.devCardIndex = 0;
  }

  getPreSelectedCards() {
    return this.preSelectedCards;
  }

  getRemainingPreSelectedCards() {
    return this.preSelectedCards.slice(this.devCardIndex);
  }

  resetDevCardIndex() {
    this.devCardIndex = 0;
  }
}