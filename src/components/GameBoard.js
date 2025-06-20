import React, { useState } from 'react';
import { Game } from '../game/Game';
import { Player } from '../game/Player';
import { interactive } from '../game/Strategy';
import PlayerComponent from './Player';
import GameControls from './GameControls';
import './GameBoard.css';

const GameBoard = () => {
  const [game, setGame] = useState(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [currentGameData, setCurrentGameData] = useState(null);
  const [currentPlayerHand, setCurrentPlayerHand] = useState(0);
  const [hideFirstCard, setHideFirstCard] = useState(true);

  const initializeGame = () => {
    const players = [new Player("You", interactive)];
    const newGame = new Game(players);
    setGame(newGame);
    return newGame;
  };

  const dealNewHand = () => {
    let currentGame = game;
    if (!currentGame) {
      currentGame = initializeGame();
    } else {
      // Clear previous hands before dealing new ones
      currentGame.clearHands();
    }

    const gameData = currentGame.dealSingle();
    setCurrentGameData(gameData);
    setGameState('playing');
    setCurrentPlayerHand(0);
    setHideFirstCard(true);
  };

  const playerHit = () => {
    if (!game || gameState !== 'playing') return;

    const gameData = game.playerAction(0, currentPlayerHand, 'h');
    setCurrentGameData(gameData);

    // Check if player busted
    const playerTotal = gameData.players[0].hands[currentPlayerHand].total;
    if (playerTotal === -1 || playerTotal === 21) {
      finishRound();
    }
  };

  const playerStand = () => {
    finishRound();
  };

  const playerDouble = () => {
    if (!game || gameState !== 'playing') return;

    const gameData = game.playerAction(0, currentPlayerHand, 'd');
    setCurrentGameData(gameData);
    finishRound();
  };

  const playerSplit = () => {
    if (!game || gameState !== 'playing') return;

    const gameData = game.playerAction(0, currentPlayerHand, 'p');
    setCurrentGameData(gameData);
  };

  const finishRound = () => {
    if (!game) return;

    setHideFirstCard(false);
    
    // Simulate dealer play and determine winner
    setTimeout(() => {
      const finalGameData = game.finishRound();
      setCurrentGameData(finalGameData);
      setGameState('finished');
    }, 1000);
  };

  const canDouble = () => {
    if (!currentGameData || gameState !== 'playing') return false;
    const currentHand = currentGameData.players[0].hands[currentPlayerHand];
    return currentHand.cards.length === 2;
  };

  const canSplit = () => {
    if (!currentGameData || gameState !== 'playing') return false;
    const currentHand = currentGameData.players[0].hands[currentPlayerHand];
    return currentHand.cards.length === 2 && 
           currentHand.cards[0].charAt(0) === currentHand.cards[1].charAt(0);
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
      <h2>Interactive Blackjack Game</h2>
      
      <GameControls
        onDeal={dealNewHand}
        onHit={playerHit}
        onStand={playerStand}
        onDouble={playerDouble}
        onSplit={playerSplit}
        gameState={gameState}
        canDouble={canDouble()}
        canSplit={canSplit()}
      />

      {currentGameData && (
        <div className="game-area">
          <PlayerComponent
            player={currentGameData.dealer}
            isDealer={true}
            hideFirstCard={hideFirstCard}
          />
          
          {currentGameData.players.map((player, index) => (
            <PlayerComponent
              key={index}
              player={player}
              isDealer={false}
            />
          ))}
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-result">
          <h3>{getGameResult()}</h3>
        </div>
      )}
    </div>
  );
};

export default GameBoard;