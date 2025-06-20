import React, { useState } from 'react';
import { Game, Parameters } from '../game/Game';
import { Player } from '../game/Player';
import { basic, conservative } from '../game/Strategy';
import './Simulator.css';

const Simulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [playedHands, setPlayedHands] = useState([]);
  const [simulationParams, setSimulationParams] = useState({
    players: 1,
    games: 100000,
    decks: 6,
    strategy: 'basic'
  });
  const [customGames, setCustomGames] = useState('');

  const runSimulation = async () => {
    // Get the actual number of games to run
    let gamesToRun;
    if (simulationParams.games === 'custom') {
      gamesToRun = parseInt(customGames);
      if (!gamesToRun || gamesToRun < 1) {
        alert('Please enter a valid number of games (1 or greater)');
        return;
      }
    } else {
      gamesToRun = simulationParams.games;
    }

    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setPlayedHands([]);

    const players = [];
    const strategy = simulationParams.strategy === 'basic' ? basic : conservative;
    
    for (let i = 0; i < simulationParams.players; i++) {
      players.push(new Player(`Player ${i + 1}`, strategy));
    }

    const params = new Parameters();
    params.times = gamesToRun;
    params.decks = simulationParams.decks;

    const game = new Game(players, params);

    // Run simulation with progress updates and hand tracking
    const startTime = Date.now();
    
    const finalResults = game.run(
      gamesToRun, 
      (progressData) => {
        setProgress(progressData.progress);
      },
      (handData) => {
        // Only track hands if games <= 1000 to avoid memory issues
        if (gamesToRun <= 1000) {
          setPlayedHands(prev => [...prev, handData]);
        }
      }
    );
    
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

  const formatCard = (cardStr) => {
    if (!cardStr) return '';
    const rank = cardStr.charAt(0);
    const suit = cardStr.charAt(1);
    const suitSymbols = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
    const isRed = suit === 'H' || suit === 'D';
    return (
      <span className={`card ${isRed ? 'red' : 'black'}`}>
        {rank === 'T' ? '10' : rank}{suitSymbols[suit] || suit}
      </span>
    );
  };

  return (
    <div className="simulator">
      <h2>Blackjack Simulator</h2>
      
      <div className="simulator-layout">
        <div className="main-content">
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
            value={simulationParams.games === 'custom' ? 'custom' : simulationParams.games}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'custom') {
                handleParamChange('games', 'custom');
              } else {
                handleParamChange('games', parseInt(value));
                setCustomGames('');
              }
            }}
            disabled={isRunning}
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
          {simulationParams.games === 'custom' && (
            <input
              type="number"
              min="1"
              max="100000000"
              placeholder="Enter number of games"
              value={customGames}
              onChange={(e) => setCustomGames(e.target.value)}
              disabled={isRunning}
              className="custom-games-input"
            />
          )}
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

        <div className="side-panel">
          <div className="played-hands">
            <div className="hands-header">
              <h3>Played Hands</h3>
              {playedHands.length > 0 && (
                <span className="hands-count">({playedHands.length})</span>
              )}
            </div>
            
            {(simulationParams.games === 'custom' ? parseInt(customGames) || 0 : simulationParams.games) > 1000 ? (
              <div className="hands-disabled">
                <p>Hand tracking is disabled for simulations with more than 1,000 games to conserve memory.</p>
                <p>Set games to 1,000 or fewer to see individual hands.</p>
              </div>
            ) : playedHands.length === 0 ? (
              <div className="no-hands">
                <p>No hands played yet. Run a simulation to see individual hands.</p>
              </div>
            ) : (
              <div className="hands-list">
                {playedHands.slice().reverse().map((hand, index) => (
                  <div key={hand.handNumber} className="hand-record">
                    <div className="hand-header">
                      <span className="hand-number">#{hand.handNumber}</span>
                    </div>
                    
                    <div className="hand-details">
                      <div className="dealer-info">
                        <div className="dealer-label">Dealer:</div>
                        <div className="dealer-cards">
                          {hand.dealer.cards ? (
                            <>
                              {hand.dealer.cards.map((card, i) => (
                                <span key={i}>{formatCard(card)}</span>
                              ))}
                              <span className="total">({hand.dealer.finalTotal === -1 ? 'Bust' : hand.dealer.finalTotal})</span>
                            </>
                          ) : (
                            <>
                              {formatCard(hand.dealer.upCard)}
                              <span className="total">(?)</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {hand.players.map((player, playerIndex) => (
                        <div key={playerIndex} className="player-info">
                          <div className="player-label">{player.name}:</div>
                          {player.hands.map((playerHand, handIndex) => (
                            <div key={handIndex} className="player-hand">
                              <div className="player-cards">
                                {playerHand.cards.map((card, i) => (
                                  <span key={i}>{formatCard(card)}</span>
                                ))}
                                <span className="total">
                                  ({playerHand.finalTotal === -1 ? 'Bust' : playerHand.finalTotal})
                                </span>
                              </div>
                              <div className={`result ${playerHand.result}`}>
                                {playerHand.result.toUpperCase()}
                                {playerHand.payout !== 0 && (
                                  <span className="payout">
                                    {playerHand.payout > 0 ? '+' : ''}${playerHand.payout.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;