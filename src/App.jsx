import React, { useState } from 'react';
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
  const [customGames, setCustomGames] = useState('');

  const handleParameterChange = (param, value) => {
    setCommonParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-main">
          <h1>Blackjack Simulator</h1>
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
            <button 
              className={`parameters-toggle ${showParameters ? 'active' : ''}`}
              onClick={() => setShowParameters(!showParameters)}
              title="Toggle common parameters"
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>
        
        {showParameters && (
          <div className="parameters-accordion">
            <CommonParameters
              parameters={commonParameters}
              onParameterChange={handleParameterChange}
              currentView={currentView}
              customGames={customGames}
              onCustomGamesChange={setCustomGames}
            />
          </div>
        )}
      </header>
      
      <main className="App-main">
        {currentView === 'simulator' ? (
          <Simulator 
            commonParameters={commonParameters} 
            customGames={customGames}
            setCustomGames={setCustomGames}
          />
        ) : (
          <GameBoard commonParameters={commonParameters} />
        )}
      </main>
    </div>
  );
}

export default App;
