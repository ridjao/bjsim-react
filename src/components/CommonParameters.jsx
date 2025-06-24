import React from 'react';
import './CommonParameters.css';

const CommonParameters = ({ 
  parameters,
  onParameterChange,
  disabled = false,
  currentView = 'simulator',
  customGames = '',
  onCustomGamesChange = () => {}
}) => {
  const isInteractiveMode = currentView === 'interactive';

  return (
    <div className="common-parameters">
      <div className="param-rows">
        {/* First row - Simulator-only parameters */}
        {!isInteractiveMode && (
          <div className="param-row">
            <div className="param-group">
              <label>Number of Players:</label>
              <input
                type="number"
                min="1"
                max="6"
                value={parameters.players}
                onChange={(e) => onParameterChange('players', parseInt(e.target.value))}
                disabled={disabled}
              />
            </div>

            <div className="param-group">
              <label>Number of Games:</label>
              <select
                value={parameters.games === 'custom' ? 'custom' : parameters.games}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'custom') {
                    onParameterChange('games', 'custom');
                  } else {
                    onParameterChange('games', parseInt(value));
                    onCustomGamesChange('');
                  }
                }}
                disabled={disabled}
              >
                <option value={10}>10</option>
                <option value={100}>100</option>
                <option value={1000}>1,000</option>
                <option value={10000}>10,000</option>
                <option value={100000}>100,000</option>
                <option value={1000000}>1,000,000</option>
                <option value={10000000}>10,000,000</option>
                <option value="custom">Custom...</option>
              </select>
              {parameters.games === 'custom' && (
                <input
                  type="number"
                  min="1"
                  max="100000000"
                  placeholder="Enter number of games"
                  value={customGames}
                  onChange={(e) => onCustomGamesChange(e.target.value)}
                  disabled={disabled}
                  className="custom-games-input"
                />
              )}
            </div>

            <div className="param-group">
              <label>Strategy:</label>
              <select
                value={parameters.strategy}
                onChange={(e) => onParameterChange('strategy', e.target.value)}
                disabled={disabled}
              >
                <option value="basic">Basic Strategy</option>
                <option value="conservative">Conservative Strategy</option>
              </select>
            </div>
          </div>
        )}

        {/* Second row - Common parameters */}
        <div className="param-row">
          <div className="param-group">
            <label>Number of Decks:</label>
            <select
              value={parameters.decks}
              onChange={(e) => onParameterChange('decks', parseInt(e.target.value))}
              disabled={disabled}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </div>

          <div className="param-group">
            <label>
              <input
                type="checkbox"
                checked={parameters.continuousShuffle}
                onChange={(e) => onParameterChange('continuousShuffle', e.target.checked)}
                disabled={disabled}
              />
              Continuous Shuffle (CSM)
            </label>
          </div>

          <div className="param-group">
            <label>
              <input
                type="checkbox"
                checked={parameters.countBasedBetting}
                onChange={(e) => onParameterChange('countBasedBetting', e.target.checked)}
                disabled={disabled}
              />
              Count-Based Betting
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonParameters;