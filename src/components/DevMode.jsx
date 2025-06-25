import React, { useState, useEffect } from 'react';
import { Card } from '../game/Card';
import './DevMode.css';

const DevMode = ({ game, onCardsChanged, onDevModeToggle, isDevMode = false, selectedCards = [] }) => {
  const [newCardRank, setNewCardRank] = useState('A');
  const [newCardSuit, setNewCardSuit] = useState('S');

  // Debug: log when game changes and reapply dev mode settings
  useEffect(() => {
    console.log('DevMode: game changed:', game ? 'Game exists' : 'No game', game?.shoe ? 'Shoe exists' : 'No shoe');
    
    // If we have a game and dev mode settings, reapply them
    if (game && game.shoe && isDevMode) {
      console.log('Reapplying dev mode settings to new game');
      game.shoe.setDevMode(true);
      if (selectedCards.length > 0) {
        game.shoe.setPreSelectedCards(selectedCards);
      }
    }
  }, [game, isDevMode, selectedCards]);

  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
  const suits = [
    { symbol: '♠', code: 'S', name: 'Spades' },
    { symbol: '♥', code: 'H', name: 'Hearts' },
    { symbol: '♦', code: 'D', name: 'Diamonds' },
    { symbol: '♣', code: 'C', name: 'Clubs' }
  ];

  const toggleDevMode = () => {
    const newDevMode = !isDevMode;
    
    // Notify parent component about dev mode change
    if (onDevModeToggle) {
      onDevModeToggle(newDevMode);
    }
    
    if (game && game.shoe) {
      console.log('Setting dev mode to:', newDevMode);
      game.shoe.setDevMode(newDevMode);
      if (!newDevMode) {
        setSelectedCards([]);
      }
    } else {
      console.log('No game or shoe available');
    }
  };

  const addCard = () => {
    const cardName = newCardRank + newCardSuit;
    const card = new Card(cardName);
    const newCards = [...selectedCards, card];
    
    if (game && game.shoe) {
      console.log('Setting pre-selected cards:', newCards.map(c => c.name));
      game.shoe.setPreSelectedCards(newCards);
    }
    
    if (onCardsChanged) {
      onCardsChanged(newCards);
    }
  };

  const removeCard = (index) => {
    const newCards = selectedCards.filter((_, i) => i !== index);
    
    if (game && game.shoe) {
      game.shoe.setPreSelectedCards(newCards);
    }
    
    if (onCardsChanged) {
      onCardsChanged(newCards);
    }
  };

  const clearCards = () => {
    if (game && game.shoe) {
      game.shoe.clearPreSelectedCards();
    }
    
    if (onCardsChanged) {
      onCardsChanged([]);
    }
  };

  const presetScenarios = [
    {
      name: 'BJ',
      cards: ['AS', '5C', 'KH'],
      description: 'Player: A♠ K♥ (BJ), Dealer: 5♣'
    },
    {
      name: 'Split',
      cards: ['AS', '7D', 'AH'],
      description: 'Player: A♠ A♥ (Split), Dealer: 7♦'
    },
    {
      name: '20',
      cards: ['KS', '6H', 'QH'],
      description: 'Player: K♠ Q♥ (20), Dealer: 6♥'
    },
    {
      name: 'S18',
      cards: ['AS', '9C', '7H'],
      description: 'Player: A♠ 7♥ (Soft 18), Dealer: 9♣'
    },
    {
      name: 'Dbl',
      cards: ['5S', '8D', '6H'],
      description: 'Player: 5♠ 6♥ (11), Dealer: 8♦'
    },
    {
      name: 'Bust',
      cards: ['KS', '8D', '5H', 'QC'],
      description: 'Player: K♠ 5♥ (15), hit Q♣ → Bust'
    }
  ];

  const loadPreset = (preset) => {
    const cards = preset.cards.map(cardName => new Card(cardName));
    
    if (game && game.shoe) {
      console.log('Loading preset:', preset.name, 'Cards:', cards.map(c => c.name));
      game.shoe.setPreSelectedCards(cards);
    }
    
    if (onCardsChanged) {
      onCardsChanged(cards);
    }
  };

  const getCardDisplay = (card) => {
    const suit = card.name.charAt(1);
    const rank = card.name.charAt(0);
    const suitObj = suits.find(s => s.code === suit);
    const isRed = suit === 'H' || suit === 'D';
    
    return (
      <span className={`card-display ${isRed ? 'red' : 'black'}`}>
        {rank === 'T' ? '10' : rank}{suitObj ? suitObj.symbol : suit}
      </span>
    );
  };

  return (
    <div className={`dev-mode ${isDevMode ? '' : 'collapsed'}`}>
      <div className="dev-mode-header">
        <label className="dev-toggle">
          <input
            type="checkbox"
            checked={isDevMode}
            onChange={toggleDevMode}
          />
          Developer Mode
        </label>
      </div>

      {isDevMode && (
        <div className="dev-mode-content">
          <div className="card-builder">
            <h4>Add Cards to Deal</h4>
            <div className="card-selector">
              <select
                value={newCardRank}
                onChange={(e) => setNewCardRank(e.target.value)}
                className="rank-selector"
              >
                {ranks.map(rank => (
                  <option key={rank} value={rank}>
                    {rank === 'T' ? '10' : rank}
                  </option>
                ))}
              </select>
              
              <select
                value={newCardSuit}
                onChange={(e) => setNewCardSuit(e.target.value)}
                className={`suit-selector ${(newCardSuit === 'H' || newCardSuit === 'D') ? 'red-suit-selected' : 'black-suit-selected'}`}
              >
                {suits.map(suit => (
                  <option 
                    key={suit.code} 
                    value={suit.code}
                    className={suit.code === 'H' || suit.code === 'D' ? 'red-suit' : 'black-suit'}
                  >
                    {suit.symbol} {suit.name}
                  </option>
                ))}
              </select>
              
              <button className="btn btn-primary" onClick={addCard}>
                Add Card
              </button>
            </div>
          </div>

          <div className="preset-scenarios">
            <h4>Quick Scenarios</h4>
            <div className="preset-buttons">
              {presetScenarios.map((preset, index) => (
                <button
                  key={index}
                  className="btn btn-secondary preset-btn"
                  onClick={() => loadPreset(preset)}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="selected-cards">
            <div className="selected-cards-header">
              <h4>Cards to Deal ({selectedCards.length})</h4>
              {selectedCards.length > 0 && (
                <button className="btn btn-danger clear-btn" onClick={clearCards}>
                  Clear All
                </button>
              )}
            </div>
            
            {selectedCards.length === 0 ? (
              <p className="no-cards">No cards selected. Cards will be dealt randomly.</p>
            ) : (
              <div className="cards-list">
                {selectedCards.map((card, index) => (
                  <div key={index} className="selected-card">
                    <span className="card-position">#{index + 1}</span>
                    {getCardDisplay(card)}
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => removeCard(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dev-mode-info">
            <p><strong>How it works:</strong> Cards will be dealt in the order shown above. After all pre-selected cards are used, dealing will continue randomly from the shoe.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevMode;