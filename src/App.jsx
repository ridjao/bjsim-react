import React, { useState, useRef, useEffect } from 'react';
import Simulator from './components/Simulator.jsx';
import GameBoard from './components/GameBoard.jsx';
import CommonParameters from './components/CommonParameters.jsx';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('simulator');
  const [showParameters, setShowParameters] = useState(false);
  const [commonParameters, setCommonParameters] = useState({
    players: 1,
    games: 100000,
    strategy: 'basic',
    decks: 6,
    continuousShuffle: false,
    countBasedBetting: true
  });
  const [playerStrategies, setPlayerStrategies] = useState([]);
  const [customGames, setCustomGames] = useState('');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [devModeState, setDevModeState] = useState({
    enabled: false,
    cards: []
  });
  const [userShowStatistics, setUserShowStatistics] = useState(null); // null means use default
  const [interactiveGame, setInteractiveGame] = useState(null);
  const simulatorRef = useRef(null);
  const gameBoardRef = useRef(null);

  // Compute effective showStatistics value
  const showStatistics = userShowStatistics !== null 
    ? userShowStatistics 
    : (currentView === 'simulator');

  // Utility function to get strategy for a specific player
  const getPlayerStrategy = (playerIndex) => {
    if (playerStrategies.length > playerIndex && playerStrategies[playerIndex]) {
      return playerStrategies[playerIndex];
    }
    return commonParameters.strategy; // Fallback to default strategy
  };

  // Utility function to update player strategies when player count changes
  const updatePlayerStrategiesForPlayerCount = (newPlayerCount) => {
    setPlayerStrategies(prev => {
      const newStrategies = [...prev];
      
      // If we have fewer strategies than players, fill with default strategy
      while (newStrategies.length < newPlayerCount) {
        newStrategies.push(commonParameters.strategy);
      }
      
      // If we have more strategies than players, trim the array
      if (newStrategies.length > newPlayerCount) {
        newStrategies.splice(newPlayerCount);
      }
      
      return newStrategies;
    });
  };

  const handleParameterChange = (param, value) => {
    setCommonParameters(prev => ({
      ...prev,
      [param]: value
    }));
    
    // When player count changes, update player strategies
    if (param === 'players') {
      updatePlayerStrategiesForPlayerCount(value);
    }
    
    // When default strategy changes, update all player strategies that are not explicitly set
    if (param === 'strategy') {
      setPlayerStrategies(prev => {
        if (prev.length === 0) return []; // If no per-player strategies set, keep empty
        return prev.map(strategy => strategy || value); // Update any unset strategies
      });
    }
  };

  const handlePlayerStrategyChange = (playerIndex, strategy) => {
    setPlayerStrategies(prev => {
      const newStrategies = [...prev];
      // Ensure the array is long enough
      while (newStrategies.length <= playerIndex) {
        newStrategies.push(commonParameters.strategy);
      }
      newStrategies[playerIndex] = strategy;
      return newStrategies;
    });
  };

  const handleRunSimulation = () => {
    if (simulatorRef.current && currentView === 'simulator') {
      simulatorRef.current.runSimulation();
    }
  };

  const handleDevCardsChanged = (cards) => {
    setDevModeState(prev => ({
      ...prev,
      cards
    }));
  };

  const handleDevModeToggle = (enabled) => {
    setDevModeState(prev => ({
      ...prev,
      enabled
    }));
  };

  const handleShowStatisticsChange = (value) => {
    setUserShowStatistics(value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-main">
          <div className="nav-container">
            <button 
              className={`run-simulation-header ${currentView === 'interactive' ? 'invisible' : ''}`}
              onClick={handleRunSimulation}
              disabled={currentView === 'interactive'}
              title={currentView === 'simulator' ? "Run Simulation" : ""}
            >
              <div className="play-icon"></div>
            </button>
            <nav className="nav-tabs">
              <button 
                className={`nav-tab ${currentView === 'simulator' ? 'active' : ''}`}
                onClick={() => setCurrentView('simulator')}
              >
                Simulator
              </button>
              <button 
                className={`nav-tab ${currentView === 'interactive' ? 'active' : ''}`}
                onClick={() => setCurrentView('interactive')}
              >
                Interactive
              </button>
            </nav>
            <button 
              className={`parameters-toggle ${showParameters ? 'active' : ''} ${isSimulationRunning ? 'disabled' : ''}`}
              onClick={() => !isSimulationRunning && setShowParameters(!showParameters)}
              disabled={isSimulationRunning}
              title={isSimulationRunning ? "Settings disabled during simulation" : "Toggle settings"}
            >
              <div className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
        
        {showParameters && (
          <div className="parameters-accordion">
            <CommonParameters
              parameters={commonParameters}
              onParameterChange={handleParameterChange}
              currentView={currentView}
              customGames={customGames}
              onCustomGamesChange={setCustomGames}
              disabled={isSimulationRunning}
              game={interactiveGame}
              onDevCardsChanged={handleDevCardsChanged}
              onDevModeToggle={handleDevModeToggle}
              devModeState={devModeState}
              showStatistics={showStatistics}
              onShowStatisticsChange={setUserShowStatistics}
              playerStrategies={playerStrategies}
              onPlayerStrategyChange={handlePlayerStrategyChange}
              getPlayerStrategy={getPlayerStrategy}
            />
          </div>
        )}
      </header>
      
      <main className="App-main">
        {currentView === 'simulator' ? (
          <Simulator 
            ref={simulatorRef}
            commonParameters={commonParameters} 
            customGames={customGames}
            setCustomGames={setCustomGames}
            onRunningStateChange={setIsSimulationRunning}
            showStatistics={showStatistics}
            playerStrategies={playerStrategies}
            getPlayerStrategy={getPlayerStrategy}
          />
        ) : (
          <GameBoard 
            ref={gameBoardRef}
            commonParameters={commonParameters} 
            devModeState={devModeState}
            onGameChange={setInteractiveGame}
            showStatistics={showStatistics}
            playerStrategies={playerStrategies}
            getPlayerStrategy={getPlayerStrategy}
          />
        )}
      </main>
    </div>
  );
}

export default App;
