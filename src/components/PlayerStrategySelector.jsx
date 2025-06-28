import React from 'react';
import './PlayerStrategySelector.css';

const PlayerStrategySelector = ({ 
  playerCount,
  playerStrategies = [],
  onPlayerStrategyChange,
  getPlayerStrategy,
  disabled = false 
}) => {
  const strategyOptions = [
    { value: 'basic', label: 'Basic' },
    { value: 'conservative', label: 'Conservative' }
  ];

  if (playerCount <= 1) {
    return null; // Don't show per-player strategies for single player
  }

  return (
    <div className="player-strategy-selector">
      <div className="param-group full-width">
        <label>Player Strategies:</label>
        <div className="player-strategies-grid">
          {Array.from({ length: playerCount }, (_, index) => (
            <div key={index} className="player-strategy-row">
              <span className="player-label">Player {index + 1}:</span>
              <select
                value={getPlayerStrategy(index)}
                onChange={(e) => onPlayerStrategyChange(index, e.target.value)}
                disabled={disabled}
                className="strategy-select"
              >
                {strategyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerStrategySelector;