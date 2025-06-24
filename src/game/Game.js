import { Player, Dealer } from './Player.js';
import { Shoe } from './Shoe.js';
import { Card } from './Card.js';
import { basic } from './Strategy.js';

export class Parameters {
  constructor() {
    this.playerCard1 = new Card("0X");
    this.playerCard2 = new Card("0X");
    this.dealerCard1 = new Card("0X");
    this.dealerCard2 = new Card("0X");
    this.times = 1000000;
    this.decks = 6;
    this.continuousShuffle = false;
    this.countBasedBetting = true;
  }
}

export class Game {
  constructor(players = [], params = null) {
    if (typeof players === 'number') {
      // Constructor with number of players
      this.players = [];
      for (let i = 0; i < players; i++) {
        this.players.push(new Player(`Player${i + 1}`, basic));
      }
    } else {
      // Constructor with player array
      this.players = [...players];
    }
    
    this.dealer = new Dealer("Dealer");
    this.showMode = false;
    this.shoe = new Shoe();
    this.params = params;
    this.gameHistory = [];
    this.currentGameState = null;
  }

  deal(count = 0) {
    let playerCard1 = new Card("0X");
    let playerCard2 = new Card("0X");
    let dealerCard1 = new Card("0X");
    let decks = 6;
    let countBasedBetting = true;

    if (this.params) {
      playerCard1 = this.params.playerCard1;
      playerCard2 = this.params.playerCard2;
      dealerCard1 = this.params.dealerCard1;
      decks = this.params.decks;
      countBasedBetting = this.params.countBasedBetting;
    }

    // Shoe management is now handled at game loop level

    let bet = 1.0;
    if (countBasedBetting && count !== 0) {
      bet = Math.max(1.0, bet + (count / decks) * bet);
      bet = Math.round(bet); // Round to whole numbers only
    }

    // Deal first cards
    for (const player of this.players) {
      player.setBet(0, bet);
      player.receive(0, this.shoe.deal(playerCard1));
    }
    this.dealer.receive(0, this.shoe.deal(dealerCard1));

    // Deal second cards
    for (const player of this.players) {
      player.receive(0, this.shoe.deal(playerCard2));
    }

    this.currentGameState = {
      players: this.players.map(p => ({
        name: p.getName(),
        hands: p.getHands().map(h => ({
          cards: h.getCards().map(c => c.toString()),
          total: h.getTotal(),
          bet: h.getBet(),
          isBlackjack: h.isBlackjack(),
          isSurrendered: h.isSurrendered()
        }))
      })),
      dealer: {
        name: this.dealer.getName(),
        hands: [{
          cards: this.dealer.getHand(0).getCards().map(c => c.toString()),
          total: this.dealer.total(0),
          bet: 0,
          isBlackjack: this.dealer.isBlackjack(0)
        }]
      }
    };
  }

  play() {
    let dealerCard2 = new Card("0X");
    if (this.params) {
      dealerCard2 = this.params.dealerCard2;
    }

    let allBjs = true;
    let allBusts = true;

    for (const player of this.players) {
      let splits = 0;
      let splittingAces = false;

      for (let i = 0; i < player.getNumberOfHands(); i++) {
        // Second card for split hands
        if (i > 0) {
          player.receive(i, this.shoe.deal());
          if (splittingAces) break;
        }

        // Check for blackjack
        if (player.total(i) === 21) {
          break;
        }

        allBjs = false;

        let action = player.getAction(i, this.dealer.total(0));
        let isFirstAction = true;

        if (action === 'r') {
          player.surrender(i);
        } else {
          while (action !== 's') {
            if (action === 'p' && splits < 2) {
              player.split(i);
              splits++;
            }

            // Only allow doubling on first action with exactly 2 cards
            if (action === 'd' && isFirstAction && player.getHand(i).getCards().length === 2) {
              player.doubleBet(i);
            }

            if (action === 'p' && player.total(i) === 11) {
              splittingAces = true;
            }

            player.receive(i, this.shoe.deal());

            if (action === 'd' || splittingAces || player.total(i) === -1 || player.total(i) === 21) {
              break;
            }

            isFirstAction = false; // After first action, no more doubling allowed
            action = player.getAction(i, this.dealer.total(0));
          }
        }

        if (player.total(i) !== -1) {
          allBusts = false;
        }
      }
    }

    // Dealer's turn - first deal hole card
    this.dealer.receive(0, this.shoe.deal(dealerCard2));
    
    const dealerTotal = this.dealer.total(0);
    if ((!allBusts && !allBjs) || (allBjs && (dealerTotal === 10 || dealerTotal === 11))) {
      while (this.dealer.total(0) < 17 && this.dealer.total(0) !== -1) {
        this.dealer.receive(0, this.shoe.deal());
      }
    }
  }

  // Interactive mode dealer play - only plays dealer, assumes players are done
  playDealer() {
    let dealerCard2 = new Card("0X");
    if (this.params) {
      dealerCard2 = this.params.dealerCard2;
    }

    // Check if any player hands are not busted, surrendered, or blackjack
    let allFinished = true;
    let allBjs = true;
    
    for (const player of this.players) {
      for (let i = 0; i < player.getNumberOfHands(); i++) {
        // Hand is finished if busted, surrendered, or blackjack (21 with 2 cards)
        const isFinished = player.total(i) === -1 || player.isSurrendered(i) || player.isBlackjack(i);
        if (!isFinished) {
          allFinished = false;
        }
        if (player.total(i) !== 21 || !player.isBlackjack(i)) {
          allBjs = false;
        }
      }
    }

    // Dealer plays only if there are unfinished hands (not busted, surrendered, or blackjack)
    const dealerTotal = this.dealer.total(0);
    if ((!allFinished && !allBjs) || (allBjs && (dealerTotal === 10 || dealerTotal === 11))) {
      while (this.dealer.total(0) < 17 && this.dealer.total(0) !== -1) {
        this.dealer.receive(0, this.shoe.deal(dealerCard2));
      }
    }
  }

  pay() {
    const dealerBj = this.dealer.isBlackjack(0);
    const dealerTotal = this.dealer.total(0);

    for (const player of this.players) {
      for (let i = 0; i < player.getNumberOfHands(); i++) {
        const playerBj = player.isBlackjack(i) && player.getNumberOfHands() === 1;
        const playerTotal = player.total(i);

        if (playerTotal === -1 || (dealerBj && !playerBj) || (dealerTotal !== -1 && dealerTotal > playerTotal)) {
          // Player loses
          if (dealerBj && player.isDoubled(i)) {
            player.setBet(i, 0.5 * player.getBet(i));
          }
          player.loss(i);
        } else if ((playerBj && !dealerBj) || (dealerTotal === -1 || dealerTotal < playerTotal)) {
          // Player wins
          player.win(i, playerBj);
        }
        // Push - no money changes hands
      }
      player.discardHands();
    }
    this.dealer.discardHands();
  }

  run(times = 1000000, onProgress = null, onHandPlayed = null) {
    if (this.params) {
      times = this.params.times;
    }

    const startTime = Date.now();
    
    for (let i = 0; i < times; i++) {
      // Handle shoe management at game loop level
      const decks = this.params ? this.params.decks : 6;
      const continuousShuffle = this.params ? this.params.continuousShuffle : false;
      
      // Reload shoe if empty
      const wasEmpty = this.shoe.remainingCards() === 0;
      if (wasEmpty) {
        this.shoe.load(decks);
      }
      
      // Shuffle: either because shoe was empty, or continuous shuffling
      if (wasEmpty || continuousShuffle) {
        this.shoe.shuffle();
      }
      
      const count = this.shoe.count();
      
      // Capture hand data before dealing starts
      const handData = this.captureHandData(i + 1, count);
      
      this.deal(count);
      
      this.play();
      
      // Capture final results and notify callback BEFORE pay() clears hands
      if (onHandPlayed) {
        const finalHandData = this.captureHandResults(handData);
        onHandPlayed(finalHandData);
      }
      
      this.pay();

      if (onProgress && i % Math.floor(times / 100) === 0) {
        onProgress({
          current: i,
          total: times,
          progress: (i / times) * 100
        });
      }
    }

    const endTime = Date.now();
    const elapsedSeconds = (endTime - startTime) / 1000;

    return this.generateReport(times, elapsedSeconds);
  }

  generateReport(times, elapsedSeconds) {
    const results = [];
    
    for (const player of this.players) {
      const earnings = player.getEarnings();
      const ev = (earnings / times) * 100;
      const wins = player.getWins();
      const pairs = player.getPairs();
      
      results.push({
        name: player.getName(),
        earnings,
        wins,
        pairs,
        games: times,
        expectedValue: ev
      });
    }

    return {
      players: results,
      elapsedTime: elapsedSeconds,
      totalGames: times
    };
  }

  setShowMode(showMode) {
    this.showMode = showMode;
  }

  isShowMode() {
    return this.showMode;
  }

  getCurrentGameState() {
    if (!this.currentGameState) {
      return {
        players: [],
        dealer: { name: "Dealer", hands: [] }
      };
    }
    return this.currentGameState;
  }

  // Interactive game methods for React UI
  dealSingle() {
    // Handle shoe management
    const decks = this.params ? this.params.decks : 6;
    const continuousShuffle = this.params ? this.params.continuousShuffle : false;
    
    // Reload shoe if empty
    const wasEmpty = this.shoe.remainingCards() === 0;
    if (wasEmpty) {
      this.shoe.load(decks);
    }
    
    // Shuffle: either because shoe was empty, or continuous shuffling
    if (wasEmpty || continuousShuffle) {
      this.shoe.shuffle();
    }

    let bet = 1.0;
    const count = this.shoe.count();
    const countBasedBetting = this.params ? this.params.countBasedBetting : true;
    
    if (countBasedBetting && count !== 0) {
      bet = Math.max(1.0, bet + (count / decks) * bet);
      bet = Math.round(bet); // Round to whole numbers only
    }

    // Deal first cards
    for (const player of this.players) {
      player.setBet(0, bet);
      player.receive(0, this.shoe.deal());
    }
    this.dealer.receive(0, this.shoe.deal());

    // Deal second cards
    for (const player of this.players) {
      player.receive(0, this.shoe.deal());
    }

    this.currentGameState = {
      players: this.players.map(p => ({
        name: p.getName(),
        hands: p.getHands().map(h => ({
          cards: h.getCards().map(c => c.toString()),
          total: h.getTotal(),
          bet: h.getBet(),
          isBlackjack: h.isBlackjack(),
          isSurrendered: h.isSurrendered()
        }))
      })),
      dealer: {
        name: this.dealer.getName(),
        hands: [{
          cards: this.dealer.getHand(0).getCards().map(c => c.toString()),
          total: this.dealer.total(0),
          bet: 0,
          isBlackjack: this.dealer.isBlackjack(0)
        }]
      },
      count: count
    };

    return this.getCurrentGameState();
  }

  playerAction(playerIndex, handIndex, action) {
    const player = this.players[playerIndex];
    
    switch (action) {
      case 'h': // Hit
        player.receive(handIndex, this.shoe.deal());
        break;
      case 's': // Stand
        break;
      case 'd': // Double
        player.doubleBet(handIndex);
        player.receive(handIndex, this.shoe.deal());
        break;
      case 'p': // Split
        player.split(handIndex);
        // Deal second cards to split hands
        if (handIndex < player.getNumberOfHands() - 1) {
          player.receive(handIndex, this.shoe.deal());
          player.receive(handIndex + 1, this.shoe.deal());
        }
        break;
      case 'r': // Surrender
        player.surrender(handIndex);
        break;
      default:
        break;
    }

    // Update the current game state after the action
    this.currentGameState = {
      players: this.players.map(p => ({
        name: p.getName(),
        hands: p.getHands().map(h => ({
          cards: h.getCards().map(c => c.toString()),
          total: h.getTotal(),
          bet: h.getBet(),
          isBlackjack: h.isBlackjack(),
          isSurrendered: h.isSurrendered()
        }))
      })),
      dealer: {
        name: this.dealer.getName(),
        hands: [{
          cards: this.dealer.getHand(0).getCards().map(c => c.toString()),
          total: this.dealer.total(0),
          bet: 0,
          isBlackjack: this.dealer.isBlackjack(0)
        }]
      }
    };

    return this.getCurrentGameState();
  }

  finishRound() {
    this.playDealer();
    this.payInteractive(); // Use special pay method that doesn't clear hands
    
    // Update game state after dealer plays
    this.currentGameState = {
      players: this.players.map(p => ({
        name: p.getName(),
        hands: p.getHands().map(h => ({
          cards: h.getCards().map(c => c.toString()),
          total: h.getTotal(),
          bet: h.getBet(),
          isBlackjack: h.isBlackjack(),
          isSurrendered: h.isSurrendered()
        }))
      })),
      dealer: {
        name: this.dealer.getName(),
        hands: [{
          cards: this.dealer.getHand(0).getCards().map(c => c.toString()),
          total: this.dealer.total(0),
          bet: 0,
          isBlackjack: this.dealer.isBlackjack(0)
        }]
      }
    };
    
    return this.getCurrentGameState();
  }

  // Pay method for interactive games - doesn't clear hands
  payInteractive() {
    const dealerBj = this.dealer.isBlackjack(0);
    const dealerTotal = this.dealer.total(0);

    for (const player of this.players) {
      for (let i = 0; i < player.getNumberOfHands(); i++) {
        const playerBj = player.isBlackjack(i) && player.getNumberOfHands() === 1;
        const playerTotal = player.total(i);

        if (player.isSurrendered(i)) {
          // Surrendered hands lose half the bet
          const bet = player.getBet(i);
          player.setBet(i, bet * 0.5);
          player.loss(i);
        } else if (playerTotal === -1 || (dealerBj && !playerBj) || (dealerTotal !== -1 && dealerTotal > playerTotal)) {
          // Player loses
          if (dealerBj && player.isDoubled(i)) {
            player.setBet(i, 0.5 * player.getBet(i));
          }
          player.loss(i);
        } else if ((playerBj && !dealerBj) || (dealerTotal === -1 || dealerTotal < playerTotal)) {
          // Player wins
          player.win(i, playerBj);
        }
        // Push - no money changes hands
      }
    }
    // Don't clear hands in interactive mode - let the UI handle it
  }

  // Method to clear hands manually for new round
  clearHands() {
    for (const player of this.players) {
      player.discardHands();
    }
    this.dealer.discardHands();
  }

  captureHandData(handNumber, countBeforeDealing = null) {
    return {
      handNumber,
      cardCount: countBeforeDealing !== null ? countBeforeDealing : this.shoe.count(), // Capture count before dealing starts
      players: this.players.map(player => ({
        name: player.getName(),
        hands: player.getHands().map(hand => ({
          cards: hand.getCards().map(card => card.toString()),
          total: hand.getTotal(),
          bet: hand.getBet(),
          isBlackjack: hand.isBlackjack()
        }))
      })),
      dealer: {
        upCard: this.dealer.getHand(0).getCards()[0]?.toString() || '',
        cards: [], // Initially empty, will be filled after play
        total: this.dealer.total(0)
      }
    };
  }

  captureHandResults(handData) {
    const dealerHand = this.dealer.getHand(0);
    const dealerCards = dealerHand.getCards();
    const dealerTotal = this.dealer.total(0);
    const dealerBj = this.dealer.isBlackjack(0);


    return {
      ...handData,
      dealer: {
        upCard: handData.dealer.upCard,
        cards: dealerCards.map(card => card.toString()),
        total: handData.dealer.total,
        finalTotal: dealerTotal,
        isBlackjack: dealerBj
      },
      players: this.players.map((player, playerIndex) => {
        const originalPlayer = handData.players[playerIndex];
        return {
          ...originalPlayer,
          hands: player.getHands().map((hand, handIndex) => {
            const playerTotal = hand.getTotal();
            const playerBj = hand.isBlackjack() && player.getNumberOfHands() === 1;
            const bet = hand.getBet();
            
            let result = 'push';
            let payout = 0;
            
            if (hand.isSurrendered()) {
              result = 'surrender';
              payout = -bet * 0.5; // Surrender loses half the bet
            } else if (playerTotal === -1) {
              result = 'bust';
              payout = -bet;
            } else if (dealerTotal === -1) {
              result = 'win';
              payout = bet;
            } else if (playerBj && !dealerBj) {
              result = 'blackjack';
              payout = bet * 1.5;
            } else if (dealerBj && !playerBj) {
              result = 'loss';
              payout = -bet;
            } else if (playerBj && dealerBj) {
              result = 'push';
              payout = 0;
            } else if (playerTotal > dealerTotal) {
              result = 'win';
              payout = bet;
            } else if (playerTotal < dealerTotal) {
              result = 'loss';
              payout = -bet;
            }
            
            return {
              cards: hand.getCards().map(card => card.toString()), // Capture final cards after all hits
              total: hand.getTotal(), // Original total (may be same as final)
              bet: hand.getBet(),
              isBlackjack: hand.isBlackjack(),
              isDoubled: hand.isDoubled(),
              isSurrendered: hand.isSurrendered(),
              finalTotal: playerTotal,
              result,
              payout
            };
          })
        };
      })
    };
  }
}