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
  canDouble = true,
  canSplit = false
}) => {
  return (
    <div className="game-controls">
      <div className="control-section">
        <h3>Game Controls</h3>
        <button 
          className="btn btn-primary" 
          onClick={onDeal}
          disabled={gameState === 'playing'}
        >
          Deal New Hand
        </button>
      </div>
      
      {gameState === 'playing' && (
        <div className="control-section">
          <h3>Player Actions</h3>
          <div className="action-buttons">
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
        </div>
      )}
    </div>
  );
};

export default GameControls;