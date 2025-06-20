import { Deck } from './Card.js';

export class Shoe {
  constructor() {
    this.cards = [];
    this.runningCount = 0;
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
    if (forcedCard && forcedCard.name !== "0X") {
      // Update count for forced card
      this.updateCount(forcedCard);
      return forcedCard;
    }

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
}