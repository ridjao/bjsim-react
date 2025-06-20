export class Card {
  constructor(name = "0X") {
    this.name = name;
  }

  value() {
    const rank = this.rank();
    if (rank === 'A') return 11;
    if (['K', 'Q', 'J', 'T'].includes(rank)) return 10;
    return parseInt(rank);
  }

  rank() {
    return this.name.charAt(0);
  }

  toString() {
    return this.name;
  }
}

export class Deck {
  static cards = [];

  static initialize() {
    if (this.cards.length > 0) return;
    
    const suits = ['C', 'D', 'H', 'S'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push(new Card(rank + suit));
      }
    }
  }

  static getCards() {
    this.initialize();
    return [...this.cards];
  }
}