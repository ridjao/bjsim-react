import React from 'react';
import Hand from './Hand';
import './Player.css';

const Player = ({ player, isDealer = false, hideFirstCard = false }) => {
  if (!player || !player.hands) {
    return null;
  }

  return (
    <div className={`player ${isDealer ? 'dealer' : ''}`}>
      <h3 className="player-name">{player.name}</h3>
      {player.hands.map((hand, index) => (
        <Hand
          key={index}
          cards={hand.cards || []}
          total={hand.total}
          bet={hand.bet}
          isDealer={isDealer}
          hideFirstCard={hideFirstCard}
          isBlackjack={hand.isBlackjack}
        />
      ))}
    </div>
  );
};

export default Player;