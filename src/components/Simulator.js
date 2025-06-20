import React, { useState } from 'react';
import { Game, Parameters } from '../game/Game';
import { Player } from '../game/Player';
import { basic, conservative } from '../game/Strategy';
import './Simulator.css';

const Simulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [simulationParams, setSimulationParams] = useState({
    players: 1,
    games: 100000,
    decks: 6,
    strategy: 'basic'
  });

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    const players = [];
    const strategy = simulationParams.strategy === 'basic' ? basic : conservative;
    
    for (let i = 0; i < simulationParams.players; i++) {
      players.push(new Player(`Player ${i + 1}`, strategy));
    }

    const params = new Parameters();
    params.times = simulationParams.games;
    params.decks = simulationParams.decks;

    const game = new Game(players, params);

    // Run simulation with progress updates
    const startTime = Date.now();
    
    const finalResults = game.run(simulationParams.games, (progressData) => {
      setProgress(progressData.progress);
    });
    
    const endTime = Date.now();
    const elapsedSeconds = (endTime - startTime) / 1000;
    
    setResults({
      ...finalResults,
      elapsedTime: elapsedSeconds
    });
    setIsRunning(false);
  };

  const handleParamChange = (param, value) => {
    setSimulationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return (
    <div className="simulator">
      <h2>Blackjack Simulator</h2>
      
      <div className="simulator-controls">
        <div className="param-group">
          <label>Number of Players:</label>
          <input
            type="number"
            min="1"
            max="6"
            value={simulationParams.players}
            onChange={(e) => handleParamChange('players', parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>

        <div className="param-group">
          <label>Number of Games:</label>
          <select
            value={simulationParams.games}
            onChange={(e) => handleParamChange('games', parseInt(e.target.value))}
            disabled={isRunning}
          >
            <option value={1000}>1,000</option>
            <option value={10000}>10,000</option>
            <option value={100000}>100,000</option>
            <option value={1000000}>1,000,000</option>
            <option value={10000000}>10,000,000</option>
          </select>
        </div>

        <div className="param-group">
          <label>Number of Decks:</label>
          <select
            value={simulationParams.decks}
            onChange={(e) => handleParamChange('decks', parseInt(e.target.value))}
            disabled={isRunning}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </div>

        <div className="param-group">
          <label>Strategy:</label>
          <select
            value={simulationParams.strategy}
            onChange={(e) => handleParamChange('strategy', e.target.value)}
            disabled={isRunning}
          >
            <option value="basic">Basic Strategy</option>
            <option value="conservative">Conservative Strategy</option>
          </select>
        </div>

        <button
          className="btn btn-primary run-button"
          onClick={runSimulation}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      {isRunning && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{progress.toFixed(1)}%</div>
        </div>
      )}

      {results && (
        <div className="results">
          <h3>Simulation Results</h3>
          <div className="results-summary">
            <p><strong>Total Games:</strong> {results.totalGames.toLocaleString()}</p>
            <p><strong>Elapsed Time:</strong> {results.elapsedTime.toFixed(2)} seconds</p>
          </div>
          
          <div className="player-results">
            {results.players.map((player, index) => (
              <div key={index} className="player-result">
                <h4>{player.name}</h4>
                <div className="result-stats">
                  <div className="stat">
                    <span className="stat-label">Earnings:</span>
                    <span className={`stat-value ${player.earnings >= 0 ? 'positive' : 'negative'}`}>
                      ${player.earnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Expected Value:</span>
                    <span className={`stat-value ${player.expectedValue >= 0 ? 'positive' : 'negative'}`}>
                      {player.expectedValue.toFixed(3)}%
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Wins:</span>
                    <span className="stat-value">{player.wins.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Win Rate:</span>
                    <span className="stat-value">
                      {((player.wins / results.totalGames) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;