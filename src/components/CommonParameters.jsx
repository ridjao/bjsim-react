import React from 'react';
import './CommonParameters.css';

const CommonParameters = ({ 
  parameters,
  onParameterChange,
  disabled = false
}) => {
  return (
    <div className="common-parameters">
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
  );
};

export default CommonParameters;