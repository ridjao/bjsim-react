import React from 'react';
import Hand from './Hand';
import './Player.css';

const Player = ({ player, isDealer = false, hideHoleCard = false, currentHandIndex = -1, finishedHands = new Set() }) => {
  if (!player || !player.hands) {
    return null;
  }

  return (
    <div className={`player ${isDealer ? 'dealer' : ''}`}>
      <h3 className="player-name">{player.name}</h3>
      {player.hands.map((hand, index) => {
        const isCurrentHand = index === currentHandIndex;
        const isFinished = finishedHands.has(index);
        const handClass = isCurrentHand ? 'current-hand' : (isFinished ? 'finished-hand' : '');
        
        return (
          <div key={index} className={`hand-container ${handClass}`}>
            {player.hands.length > 1 && (
              <div className="hand-label">
                Hand {index + 1} {isCurrentHand ? '(Current)' : isFinished ? '(Finished)' : ''}
              </div>
            )}
            <Hand
              cards={hand.cards || []}
              total={hand.total}
              bet={hand.bet}
              isDealer={isDealer}
              hideHoleCard={hideHoleCard}
              isBlackjack={hand.isBlackjack}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Player;