import React, { useState } from 'react';
import Simulator from './components/Simulator';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('simulator');

  return (
    <div className="App">
      <header className="App-header">
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
        </nav>
      </header>
      
      <main className="App-main">
        {currentView === 'simulator' ? <Simulator /> : <GameBoard />}
      </main>
    </div>
  );
}

export default App;
