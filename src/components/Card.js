import React from 'react';
import './Card.css';

const Card = ({ card, hidden = false }) => {
  if (hidden) {
    return (
      <div className="card card-hidden">
        <div className="card-back">?</div>
      </div>
    );
  }

  const suit = card.charAt(1);
  const rank = card.charAt(0);
  
  const suitSymbols = {
    'C': '♣',
    'D': '♦',
    'H': '♥',
    'S': '♠'
  };

  const rankNames = {
    'A': 'A',
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
    '7': '7', '8': '8', '9': '9', 'T': '10',
    'J': 'J', 'Q': 'Q', 'K': 'K'
  };

  const isRed = suit === 'D' || suit === 'H';

  return (
    <div className={`card ${isRed ? 'red' : 'black'}`}>
      <div className="card-rank">{rankNames[rank]}</div>
      <div className="card-suit">{suitSymbols[suit]}</div>
    </div>
  );
};

export default Card;