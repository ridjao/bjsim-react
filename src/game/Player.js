import { Hand } from './Hand.js';
import { basic } from './Strategy.js';

export class Player {
  constructor(name = "", strategy = basic) {
    this.name = name;
    this.hands = [new Hand()];
    this.earnings = 0;
    this.wins = 0;
    this.pairs = 0;
    this.strategy = strategy;
  }

  receive(handIndex, card) {
    if (handIndex >= this.hands.length) {
      this.hands.push(new Hand());
    }
    this.hands[handIndex].add(card);
  }

  total(handIndex) {
    return this.hands[handIndex].getTotal();
  }

  setBet(handIndex, bet) {
    if (handIndex >= this.hands.length) {
      this.hands.push(new Hand());
    }
    this.hands[handIndex].setBet(bet);
  }

  getBet(handIndex) {
    return this.hands[handIndex].getBet();
  }

  doubleBet(handIndex) {
    this.hands[handIndex].setBet(this.hands[handIndex].getBet() * 2);
    this.hands[handIndex].setDoubled(true);
  }

  split(handIndex) {
    const currentHand = this.hands[handIndex];
    const cards = currentHand.getCards();
    
    if (cards.length === 2 && cards[0].rank() === cards[1].rank()) {
      const originalBet = currentHand.getBet();
      
      // Create new hand with second card
      const newHand = new Hand();
      newHand.add(cards[1]);
      newHand.setBet(originalBet);
      
      // Clear current hand and add first card back
      currentHand.clear();
      currentHand.add(cards[0]);
      currentHand.setBet(originalBet);
      
      // Insert new hand after current hand
      this.hands.splice(handIndex + 1, 0, newHand);
    }
  }

  surrender(handIndex) {
    this.hands[handIndex].surrender();
  }

  win(handIndex, isBlackjack = false) {
    const bet = this.hands[handIndex].getBet();
    const payout = isBlackjack ? bet * 1.5 : bet;
    this.earnings += payout;
    this.wins++;
  }

  loss(handIndex) {
    const bet = this.hands[handIndex].getBet();
    this.earnings -= bet;
  }

  getName() {
    return this.name;
  }

  discardHands() {
    this.hands = [new Hand()];
  }

  getNumberOfHands() {
    return this.hands.length;
  }

  getNumberOfCards(handIndex) {
    return this.hands[handIndex].getCards().length;
  }

  isBlackjack(handIndex) {
    return this.hands[handIndex].isBlackjack();
  }

  getAction(handIndex, dealerTotal) {
    const hand = this.hands[handIndex];
    const playerTotal = hand.getTotal();
    const soft = hand.isSoft();
    const pair = hand.isPair();
    const cards = hand.getCards().length;
    
    return this.strategy.getAction(playerTotal, dealerTotal, soft, pair, cards);
  }

  getEarnings() {
    return this.earnings;
  }

  isDoubled(handIndex) {
    return this.hands[handIndex].isDoubled();
  }

  getWins() {
    return this.wins;
  }

  getPairs() {
    return this.pairs;
  }

  incrementPairs() {
    this.pairs++;
  }

  getHand(handIndex) {
    return this.hands[handIndex];
  }

  getHands() {
    return this.hands;
  }
}

export class Dealer extends Player {
  constructor(name = "Dealer") {
    super(name);
  }
}