import React, { useState } from 'react';
import { Game } from '../game/Game';
import { Player } from '../game/Player';
import { interactive, basic } from '../game/Strategy';
import PlayerComponent from './Player';
import GameControls from './GameControls';
import DevMode from './DevMode';
import './GameBoard.css';

const GameBoard = () => {
  const [game, setGame] = useState(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [currentGameData, setCurrentGameData] = useState(null);
  const [currentPlayerHand, setCurrentPlayerHand] = useState(0);
  const [hideHoleCard, setHideHoleCard] = useState(true);
  const [finishedHands, setFinishedHands] = useState(new Set());
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
    blackjacks: 0,
    busts: 0,
    earnings: 0,
    totalBet: 0
  });
  const [devModeState, setDevModeState] = useState({
    enabled: false,
    cards: []
  });
  const [showHints, setShowHints] = useState(true);

  const initializeGame = () => {
    const players = [new Player("You", interactive)];
    const newGame = new Game(players);
    
    // Apply dev mode settings if they exist
    if (devModeState.enabled && newGame.shoe) {
      newGame.shoe.setDevMode(true);
      if (devModeState.cards.length > 0) {
        newGame.shoe.setPreSelectedCards(devModeState.cards);
      }
    }
    
    setGame(newGame);
    return newGame;
  };

  const findNextPlayableHand = (gameData) => {
    if (!gameData || !gameData.players[0]) return -1;
    
    const totalHands = gameData.players[0].hands.length;
    for (let i = 0; i < totalHands; i++) {
      const hand = gameData.players[0].hands[i];
      // Hand is playable if it's not finished and not busted and not 21
      if (!finishedHands.has(i) && hand.total !== -1 && hand.total !== 21) {
        return i;
      }
    }
    return -1; // No more playable hands
  };

  const dealNewHand = () => {
    let currentGame = game;
    if (!currentGame) {
      currentGame = initializeGame();
    } else {
      // Clear previous hands before dealing new ones
      currentGame.clearHands();
      // Reset dev card index for new hand
      if (currentGame.shoe) {
        currentGame.shoe.resetDevCardIndex();
      }
    }

    const gameData = currentGame.dealSingle();
    setCurrentGameData(gameData);
    setGameState('playing');
    setCurrentPlayerHand(0);
    setHideHoleCard(true);
    setFinishedHands(new Set());
  };

  const playerHit = () => {
    if (!game || gameState !== 'playing') return;

    const gameData = game.playerAction(0, currentPlayerHand, 'h');
    setCurrentGameData(gameData);

    // Check if current hand is finished (busted or 21)
    const playerTotal = gameData.players[0].hands[currentPlayerHand].total;
    if (playerTotal === -1 || playerTotal === 21) {
      // Mark current hand as finished
      const newFinishedHands = new Set(finishedHands);
      newFinishedHands.add(currentPlayerHand);
      setFinishedHands(newFinishedHands);
      
      // Find next playable hand
      const nextHand = findNextPlayableHandWithSet(gameData, newFinishedHands);
      if (nextHand !== -1) {
        setCurrentPlayerHand(nextHand);
      } else {
        finishRound();
      }
    }
  };

  const playerStand = () => {
    if (!currentGameData) return;
    
    // Mark current hand as finished
    const newFinishedHands = new Set(finishedHands);
    newFinishedHands.add(currentPlayerHand);
    setFinishedHands(newFinishedHands);
    
    // Find next playable hand with the updated finished hands
    const nextHand = findNextPlayableHandWithSet(currentGameData, newFinishedHands);
    if (nextHand !== -1) {
      setCurrentPlayerHand(nextHand);
    } else {
      finishRound();
    }
  };

  const findNextPlayableHandWithSet = (gameData, finishedHandsSet) => {
    if (!gameData || !gameData.players[0]) return -1;
    
    const totalHands = gameData.players[0].hands.length;
    for (let i = 0; i < totalHands; i++) {
      const hand = gameData.players[0].hands[i];
      // Hand is playable if it's not finished and not busted and not 21
      if (!finishedHandsSet.has(i) && hand.total !== -1 && hand.total !== 21) {
        return i;
      }
    }
    return -1; // No more playable hands
  };

  const playerDouble = () => {
    if (!game || gameState !== 'playing') return;

    const gameData = game.playerAction(0, currentPlayerHand, 'd');
    setCurrentGameData(gameData);
    
    // After double, hand is automatically finished
    const newFinishedHands = new Set(finishedHands);
    newFinishedHands.add(currentPlayerHand);
    setFinishedHands(newFinishedHands);
    
    // Find next playable hand
    const nextHand = findNextPlayableHandWithSet(gameData, newFinishedHands);
    if (nextHand !== -1) {
      setCurrentPlayerHand(nextHand);
    } else {
      finishRound();
    }
  };

  const playerSplit = () => {
    if (!game || gameState !== 'playing') return;

    const gameData = game.playerAction(0, currentPlayerHand, 'p');
    setCurrentGameData(gameData);
    // After split, continue playing the first hand
    setCurrentPlayerHand(0);
  };

  const finishRound = () => {
    if (!game) return;

    setHideHoleCard(false);
    
    // Simulate dealer play and determine winner
    setTimeout(() => {
      const finalGameData = game.finishRound();
      setCurrentGameData(finalGameData);
      setGameState('finished');
      updateGameStats(finalGameData);
    }, 1000);
  };

  const canHit = () => {
    if (!currentGameData || gameState !== 'playing') return false;
    if (finishedHands.has(currentPlayerHand)) return false;
    const currentHand = currentGameData.players[0].hands[currentPlayerHand];
    return currentHand.total !== -1 && currentHand.total !== 21;
  };

  const canDouble = () => {
    if (!currentGameData || gameState !== 'playing') return false;
    if (finishedHands.has(currentPlayerHand)) return false;
    const currentHand = currentGameData.players[0].hands[currentPlayerHand];
    return currentHand.cards.length === 2 && currentHand.total !== -1 && currentHand.total !== 21;
  };

  const canSplit = () => {
    if (!currentGameData || gameState !== 'playing') return false;
    if (finishedHands.has(currentPlayerHand)) return false;
    const currentHand = currentGameData.players[0].hands[currentPlayerHand];
    return currentHand.cards.length === 2 && 
           currentHand.cards[0].charAt(0) === currentHand.cards[1].charAt(0) &&
           currentHand.total !== -1 && currentHand.total !== 21;
  };

  const canStand = () => {
    if (!currentGameData || gameState !== 'playing') return false;
    if (finishedHands.has(currentPlayerHand)) return false;
    const currentHand = currentGameData.players[0].hands[currentPlayerHand];
    return currentHand.total !== -1;
  };

  const updateGameStats = (gameData) => {
    if (!gameData || !gameData.players[0]) return;

    let totalBet = 0;
    let totalEarnings = 0;
    let wins = 0;
    let losses = 0;
    let pushes = 0;
    let blackjacks = 0;
    let busts = 0;

    const dealerHand = gameData.dealer.hands[0];
    const dealerTotal = dealerHand.total;
    const dealerBj = dealerHand.isBlackjack;

    // Calculate stats for each hand
    for (const hand of gameData.players[0].hands) {
      const bet = hand.bet;
      totalBet += bet;
      
      const playerTotal = hand.total;
      const playerBj = hand.isBlackjack;

      if (playerTotal === -1) {
        // Player busted
        busts++;
        losses++;
        totalEarnings -= bet;
      } else if (dealerTotal === -1) {
        // Dealer busted, player wins
        wins++;
        totalEarnings += bet;
      } else if (playerBj && !dealerBj) {
        // Player blackjack wins
        blackjacks++;
        wins++;
        totalEarnings += bet * 1.5; // Blackjack pays 3:2
      } else if (dealerBj && !playerBj) {
        // Dealer blackjack wins
        losses++;
        totalEarnings -= bet;
      } else if (playerBj && dealerBj) {
        // Both blackjack - push
        pushes++;
      } else if (playerTotal > dealerTotal) {
        // Player wins
        wins++;
        totalEarnings += bet;
      } else if (playerTotal < dealerTotal) {
        // Dealer wins
        losses++;
        totalEarnings -= bet;
      } else {
        // Push
        pushes++;
      }
    }

    setGameStats(prevStats => ({
      gamesPlayed: prevStats.gamesPlayed + 1,
      wins: prevStats.wins + wins,
      losses: prevStats.losses + losses,
      pushes: prevStats.pushes + pushes,
      blackjacks: prevStats.blackjacks + blackjacks,
      busts: prevStats.busts + busts,
      earnings: prevStats.earnings + totalEarnings,
      totalBet: prevStats.totalBet + totalBet
    }));
  };

  const resetStats = () => {
    setGameStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      blackjacks: 0,
      busts: 0,
      earnings: 0,
      totalBet: 0
    });
  };

  const handleDevCardsChanged = (cards) => {
    setDevModeState(prev => ({
      ...prev,
      cards
    }));
  };

  const handleDevModeToggle = (enabled) => {
    setDevModeState(prev => ({
      ...prev,
      enabled
    }));
  };

  const getBasicStrategyHint = () => {
    if (!currentGameData || gameState !== 'playing' || finishedHands.has(currentPlayerHand)) {
      return null;
    }

    const playerHand = currentGameData.players[0].hands[currentPlayerHand];
    const dealerUpCard = currentGameData.dealer.hands[0].cards[0];
    
    if (!playerHand || !dealerUpCard) return null;

    // Parse dealer up card value
    const dealerValue = dealerUpCard.charAt(0);
    let dealerTotal;
    if (dealerValue === 'A') dealerTotal = 11;
    else if (['K', 'Q', 'J', 'T'].includes(dealerValue)) dealerTotal = 10;
    else dealerTotal = parseInt(dealerValue);

    // Get player hand info
    const playerTotal = playerHand.total;
    
    // Check if hand is soft (has an Ace counting as 11)
    let hasAce = false;
    let totalWithoutAces = 0;
    for (const card of playerHand.cards) {
      const rank = card.charAt(0);
      if (rank === 'A') {
        hasAce = true;
      } else if (['K', 'Q', 'J', 'T'].includes(rank)) {
        totalWithoutAces += 10;
      } else {
        totalWithoutAces += parseInt(rank);
      }
    }
    const isPlayerSoft = hasAce && (totalWithoutAces + 11 <= 21);
    
    const isPair = playerHand.cards.length === 2 && 
                   playerHand.cards[0].charAt(0) === playerHand.cards[1].charAt(0);

    // Get basic strategy action
    const action = basic.getAction(playerTotal, dealerTotal, isPlayerSoft, isPair, playerHand.cards);
    
    // Convert action to readable text
    const actionMap = {
      'h': 'Hit',
      's': 'Stand', 
      'd': 'Double',
      'p': 'Split'
    };

    return {
      action: actionMap[action] || 'Hit',
      reason: getActionReason(action, playerTotal, dealerTotal, isPlayerSoft, isPair)
    };
  };

  const getActionReason = (action, playerTotal, dealerTotal, isPlayerSoft, isPair) => {
    if (isPair) {
      const pairRank = playerTotal / 2;
      if (pairRank === 11) return "Always split Aces";
      if (pairRank === 8) return "Always split 8s"; 
      if (pairRank === 10) return "Never split 10s";
      if (pairRank === 5) return "Double instead of splitting 5s";
      return `${action === 'p' ? 'Split' : 'Don\'t split'} ${pairRank}s vs dealer ${dealerTotal}`;
    }
    
    if (isPlayerSoft) {
      const softName = playerTotal === 21 ? '21' : playerTotal.toString();
      return `Soft ${softName} vs dealer ${dealerTotal}`;
    }
    
    if (action === 'd') {
      return `Double on ${playerTotal} vs dealer ${dealerTotal}`;
    }
    
    return `Hard ${playerTotal} vs dealer ${dealerTotal}`;
  };

  const getGameResult = () => {
    if (!currentGameData || gameState !== 'finished') return '';
    
    const playerHand = currentGameData.players[0].hands[0];
    const dealerHand = currentGameData.dealer.hands[0];
    const dealerTotal = dealerHand.total;
    const playerTotal = playerHand.total;

    if (playerTotal === -1) return 'You busted! Dealer wins.';
    if (dealerTotal === -1) return 'Dealer busted! You win!';
    if (playerHand.isBlackjack && !dealerHand.isBlackjack) return 'Blackjack! You win!';
    if (dealerHand.isBlackjack && !playerHand.isBlackjack) return 'Dealer blackjack! You lose.';
    if (playerHand.isBlackjack && dealerHand.isBlackjack) return 'Both blackjack! Push!';
    if (playerTotal > dealerTotal) return 'You win!';
    if (playerTotal < dealerTotal) return 'Dealer wins!';
    return 'Push! It\'s a tie.';
  };

  return (
    <div className="game-board">
      <div className="game-header">
        {gameState === 'finished' && (
          <div className="game-result-banner">
            <h3>{getGameResult()}</h3>
          </div>
        )}
      </div>

      <div className="game-layout">
        <div className="main-content">
          {currentGameData && (
            <div className="game-area">
              <PlayerComponent
                player={currentGameData.dealer}
                isDealer={true}
                hideHoleCard={hideHoleCard}
              />
              
              {currentGameData.players.map((player, index) => (
                <PlayerComponent
                  key={index}
                  player={player}
                  isDealer={false}
                  currentHandIndex={gameState === 'playing' ? currentPlayerHand : -1}
                  finishedHands={finishedHands}
                />
              ))}
            </div>
          )}

          {showHints && gameState === 'playing' && getBasicStrategyHint() && (
            <div className="strategy-hint">
              <div className="hint-header">
                <span className="hint-label">💡 Basic Strategy Hint:</span>
                <button 
                  className="hint-toggle"
                  onClick={() => setShowHints(false)}
                  title="Hide hints"
                >
                  ×
                </button>
              </div>
              <div className="hint-content">
                <span className="hint-action">{getBasicStrategyHint().action}</span>
                <span className="hint-reason">({getBasicStrategyHint().reason})</span>
              </div>
            </div>
          )}

          {!showHints && gameState === 'playing' && (
            <div className="hint-toggle-container">
              <button 
                className="show-hint-btn"
                onClick={() => setShowHints(true)}
                title="Show basic strategy hints"
              >
                💡 Show Hints
              </button>
            </div>
          )}

          <GameControls
            onDeal={dealNewHand}
            onHit={playerHit}
            onStand={playerStand}
            onDouble={playerDouble}
            onSplit={playerSplit}
            gameState={gameState}
            canHit={canHit()}
            canStand={canStand()}
            canDouble={canDouble()}
            canSplit={canSplit()}
          />

        </div>

        <div className="side-panel">
          <div className="game-stats">
            <div className="stats-header">
              <h3>Statistics</h3>
              <button className="btn btn-secondary reset-btn" onClick={resetStats}>
                Reset
              </button>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Games</div>
                <div className="stat-value">{gameStats.gamesPlayed}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Wins</div>
                <div className="stat-value wins">{gameStats.wins}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Losses</div>
                <div className="stat-value losses">{gameStats.losses}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Pushes</div>
                <div className="stat-value">{gameStats.pushes}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Blackjacks</div>
                <div className="stat-value blackjacks">{gameStats.blackjacks}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Busts</div>
                <div className="stat-value busts">{gameStats.busts}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Win Rate</div>
                <div className="stat-value">
                  {gameStats.gamesPlayed > 0 
                    ? `${((gameStats.wins / gameStats.gamesPlayed) * 100).toFixed(1)}%`
                    : '0%'}
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Earnings</div>
                <div className={`stat-value ${gameStats.earnings >= 0 ? 'earnings-positive' : 'earnings-negative'}`}>
                  ${gameStats.earnings.toFixed(2)}
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Total Bet</div>
                <div className="stat-value">${gameStats.totalBet.toFixed(2)}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Return</div>
                <div className={`stat-value ${gameStats.earnings >= 0 ? 'earnings-positive' : 'earnings-negative'}`}>
                  {gameStats.totalBet > 0 
                    ? `${(((gameStats.totalBet + gameStats.earnings) / gameStats.totalBet) * 100).toFixed(1)}%`
                    : '0%'}
                </div>
              </div>
            </div>
          </div>

          <DevMode 
            game={game}
            onCardsChanged={handleDevCardsChanged}
            onDevModeToggle={handleDevModeToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;