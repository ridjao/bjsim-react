import React from 'react';
import Card from './Card';
import './Hand.css';

const Hand = ({ cards, total, bet, isDealer = false, hideFirstCard = false, isBlackjack = false }) => {
  return (
    <div className="hand">
      <div className="hand-cards">
        {cards.map((card, index) => (
          <Card 
            key={index} 
            card={card} 
            hidden={isDealer && index === 0 && hideFirstCard}
          />
        ))}
      </div>
      <div className="hand-info">
        <div className="hand-total">
          Total: {hideFirstCard && isDealer ? '?' : total}
          {isBlackjack && <span className="blackjack">BLACKJACK!</span>}
        </div>
        {!isDealer && (
          <div className="hand-bet">Bet: ${bet}</div>
        )}
      </div>
    </div>
  );
};

export default Hand;