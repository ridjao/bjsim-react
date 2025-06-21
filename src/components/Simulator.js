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
  const [startTime, setStartTime] = useState(null);

  const runSimulation = async () => {
    try {
      console.log('🚀 Starting runSimulation function');
      
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

      console.log(`🎯 Setting up simulation for ${gamesToRun} games`);
      
      // First reset progress and results immediately
      setProgress(0);
      setResults(null);
      setPlayedHands([]);
      
      // Give React time to render the reset state
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Now start the simulation
      setIsRunning(true);
      const simulationStartTime = Date.now();
      setStartTime(simulationStartTime);
      
      console.log('✅ State updated, isRunning should now be true');

    const players = [];
    const strategy = simulationParams.strategy === 'basic' ? basic : conservative;
    
    for (let i = 0; i < simulationParams.players; i++) {
      players.push(new Player(`Player ${i + 1}`, strategy));
    }
    
    // Allow React to render the progress indicator with 0% and running state
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Create new players for each chunk to avoid cumulative stats
    const createFreshPlayers = () => {
      const freshPlayers = [];
      for (let i = 0; i < simulationParams.players; i++) {
        freshPlayers.push(new Player(`Player ${i + 1}`, strategy));
      }
      return freshPlayers;
    };
    
    // Run simulation in chunks to show progress - fewer, larger chunks for speed
    const chunkSize = Math.max(10000, Math.floor(gamesToRun / 20)); // Max 20 progress updates for speed
    let gamesCompleted = 0;
    let totalStats = {
      totalGames: 0,
      players: players.map(player => ({
        name: player.getName(),
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        blackjacks: 0,
        busts: 0,
        earnings: 0,
        totalBet: 0,
        expectedValue: 0
      }))
    };
    
    while (gamesCompleted < gamesToRun) {
      const remainingGames = gamesToRun - gamesCompleted;
      const currentChunkSize = Math.min(chunkSize, remainingGames);
      
      // Create fresh players for this chunk
      const chunkPlayers = createFreshPlayers();
      
      // Set up game for this chunk
      const params = new Parameters();
      params.times = currentChunkSize;
      params.decks = simulationParams.decks;
      
      const game = new Game(chunkPlayers, params);
      
      // Track detailed statistics for this chunk
      let chunkDetailedStats = {
        players: totalStats.players.map(() => ({
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          pushes: 0,
          blackjacks: 0,
          busts: 0,
          totalBet: 0
        }))
      };
      
      // Run this chunk
      const chunkResults = game.run(
        currentChunkSize,
        () => {}, // No progress callback for individual chunks
        (handData) => {
          // Track detailed hand statistics from actual game results
          if (handData && handData.players) {
            handData.players.forEach((player, playerIndex) => {
              if (player.hands && chunkDetailedStats.players[playerIndex]) {
                player.hands.forEach(hand => {
                  chunkDetailedStats.players[playerIndex].gamesPlayed++;
                  chunkDetailedStats.players[playerIndex].totalBet += hand.bet || 1;
                  
                  // Count actual hand outcomes from game results
                  if (hand.result === 'win') {
                    chunkDetailedStats.players[playerIndex].wins++;
                  } else if (hand.result === 'blackjack') {
                    chunkDetailedStats.players[playerIndex].wins++;
                    chunkDetailedStats.players[playerIndex].blackjacks++;
                  } else if (hand.result === 'loss') {
                    chunkDetailedStats.players[playerIndex].losses++;
                  } else if (hand.result === 'bust') {
                    chunkDetailedStats.players[playerIndex].losses++;
                    chunkDetailedStats.players[playerIndex].busts++;
                  } else if (hand.result === 'push') {
                    chunkDetailedStats.players[playerIndex].pushes++;
                  }
                });
              }
            });
          }
          
          // Only track hands if total games <= 1000 to avoid memory issues
          if (gamesToRun <= 1000) {
            setPlayedHands(prev => [...prev, handData]);
          }
        }
      );
      
      // Add this chunk's results to total
      totalStats.totalGames += currentChunkSize;
      totalStats.players.forEach((player, index) => {
        const chunkResult = chunkResults.players[index];
        const detailedStats = chunkDetailedStats.players[index];
        
        // Add statistics from detailed tracking
        player.earnings += chunkResult.earnings;
        player.gamesPlayed += detailedStats.gamesPlayed;
        player.wins += detailedStats.wins;
        player.losses += detailedStats.losses;
        player.pushes += detailedStats.pushes;
        player.blackjacks += detailedStats.blackjacks;
        player.busts += detailedStats.busts;
        player.totalBet += detailedStats.totalBet;
        
        // Calculate expected value
        player.expectedValue = totalStats.totalGames > 0 ? (player.earnings / totalStats.totalGames) * 100 : 0;
      });
      
      gamesCompleted += currentChunkSize;
      const progressPercent = (gamesCompleted / gamesToRun) * 100;
      
      // Update progress
      setProgress(progressPercent);
      
      // Only yield control for very large simulations to keep speed up
      if (gamesCompleted < gamesToRun && gamesToRun > 100000) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    const finalResults = {
      players: totalStats.players,
      totalGames: gamesToRun, // Ensure this matches exactly
      elapsedTime: 0 // Will be calculated below
    };
    
    const endTime = Date.now();
    const elapsedSeconds = (endTime - simulationStartTime) / 1000;
    
      setResults({
        ...finalResults,
        elapsedTime: elapsedSeconds
      });
      setIsRunning(false);
      console.log('🏁 Simulation completed successfully');
      
    } catch (error) {
      console.error('❌ ERROR in runSimulation:', error);
      setIsRunning(false);
      alert(`Simulation error: ${error.message}`);
    }
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
                    <span className="stat-label">Games:</span>
                    <span className="stat-value">{player.gamesPlayed.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Wins:</span>
                    <span className="stat-value">{player.wins.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Losses:</span>
                    <span className="stat-value">{player.losses.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Pushes:</span>
                    <span className="stat-value">{player.pushes.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Blackjacks:</span>
                    <span className="stat-value">{player.blackjacks.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Busts:</span>
                    <span className="stat-value">{player.busts.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Win Rate:</span>
                    <span className="stat-value">
                      {player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Earnings:</span>
                    <span className={`stat-value ${player.earnings >= 0 ? 'positive' : 'negative'}`}>
                      ${player.earnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Total Bet:</span>
                    <span className="stat-value">${player.totalBet.toFixed(2)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Return:</span>
                    <span className={`stat-value ${((player.totalBet + player.earnings) / player.totalBet * 100) >= 100 ? 'positive' : 'negative'}`}>
                      {player.totalBet > 0 ? (((player.totalBet + player.earnings) / player.totalBet) * 100).toFixed(1) : '0.0'}%
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

          {(isRunning || progress > 0) && (simulationParams.games === 'custom' ? parseInt(customGames) || 0 : simulationParams.games) > 1000 && (
            <div className={`simulation-progress ${!isRunning ? 'completed' : ''}`}>
              <div className="progress-header">
                <div className="progress-status">
                  <span className={`status-icon ${!isRunning ? 'no-animation' : ''}`}>
                    {isRunning ? '⚡' : '✅'}
                  </span>
                  <span className="status-text">
                    {isRunning ? 'Simulation Running...' : 'Simulation Complete'}
                  </span>
                </div>
                <div className="progress-percentage">{progress.toFixed(1)}%</div>
              </div>
              
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${!isRunning ? 'no-animation' : ''}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="progress-details">
                <span className="games-info">
                  {isRunning ? 'Processing' : 'Processed'} {(simulationParams.games === 'custom' ? parseInt(customGames) || 0 : simulationParams.games).toLocaleString()} games
                </span>
                <span className="estimated-time">
                  {isRunning ? (
                    progress > 5 && startTime ? 
                      `Est. ${Math.max(0, ((100 - progress) / progress * (Date.now() - startTime) / 1000 / 60).toFixed(1))} min remaining` : 
                      'Calculating...'
                  ) : (
                    results ? `Completed in ${results.elapsedTime.toFixed(2)} seconds` : 'Complete'
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;