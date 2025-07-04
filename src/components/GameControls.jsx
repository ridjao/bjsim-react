import React from 'react';
import './GameControls.css';

const GameControls = ({ 
  onDeal, 
  onHit, 
  onStand, 
  onDouble, 
  onSplit,
  onSurrender, 
  gameState,
  canHit = true,
  canStand = true,
  canDouble = true,
  canSplit = false,
  canSurrender = false
}) => {
  return (
    <div className="game-controls">
      <div className="control-section">
        <div className="all-actions">
          <div className="player-actions">
            <button 
              className="btn btn-success" 
              onClick={onHit}
              disabled={gameState !== 'playing' || !canHit}
            >
              Hit
            </button>
            <button 
              className="btn btn-warning" 
              onClick={onStand}
              disabled={gameState !== 'playing' || !canStand}
            >
              Stand
            </button>
            <button 
              className="btn btn-info" 
              onClick={onDouble}
              disabled={gameState !== 'playing' || !canDouble}
            >
              Double
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={onSplit}
              disabled={gameState !== 'playing' || !canSplit}
            >
              Split
            </button>
            <button 
              className="btn btn-danger" 
              onClick={onSurrender}
              disabled={gameState !== 'playing' || !canSurrender}
            >
              Surr
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;