import React from 'react';
import './GameControls.css';

const GameControls = ({ 
  onDeal, 
  onHit, 
  onStand, 
  onDouble, 
  onSplit, 
  gameState,
  canHit = true,
  canStand = true,
  canDouble = true,
  canSplit = false
}) => {
  return (
    <div className="game-controls">
      <div className="control-section">
        <div className="all-actions">
          <button 
            className="btn btn-primary deal-btn" 
            onClick={onDeal}
            disabled={gameState === 'playing'}
          >
            Deal New Hand
          </button>
          
          {gameState === 'playing' && (
            <div className="player-actions">
              <button 
                className="btn btn-success" 
                onClick={onHit}
                disabled={!canHit}
              >
                Hit
              </button>
              <button 
                className="btn btn-warning" 
                onClick={onStand}
                disabled={!canStand}
              >
                Stand
              </button>
              <button 
                className="btn btn-info" 
                onClick={onDouble}
                disabled={!canDouble}
              >
                Double
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={onSplit}
                disabled={!canSplit}
              >
                Split
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameControls;