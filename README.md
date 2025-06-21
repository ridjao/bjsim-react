# Blackjack Simulator React

A comprehensive React-based blackjack simulator that provides both interactive gameplay and statistical simulation capabilities. This application allows users to play blackjack hands interactively or run large-scale simulations to analyze different strategies and scenarios.

## Features

### 🎮 Interactive Mode
- **Play blackjack hands** with full game mechanics (hit, stand, double, split, surrender)
- **Real-time statistics** tracking wins, losses, pushes, blackjacks, busts, earnings, and win rates
- **Developer mode** for testing specific card scenarios
- **Basic strategy hints** to help improve gameplay
- **Hand history** showing detailed results of each hand played

### 📊 Simulator Mode
- **Large-scale simulations** supporting up to 10 million hands
- **Multiple strategies** including Basic Strategy and Conservative Strategy
- **Comprehensive statistics** matching interactive mode metrics
- **Progress indicator** with real-time updates for long-running simulations
- **Detailed hand tracking** for smaller simulations (≤1000 hands)
- **Configurable parameters** for number of players, decks, and game count

### 🎯 Game Features
- **Accurate blackjack rules** including proper payouts (3:2 for blackjacks)
- **Multiple deck support** (1, 2, 4, 6, or 8 decks)
- **Split hands support** with independent play of each hand
- **Double down** functionality with proper betting mechanics
- **Surrender option** for strategic play
- **Card counting simulation** with variable betting based on count

## Screenshots

### Interactive Mode
Features live gameplay with strategy hints and comprehensive statistics tracking.

### Simulator Mode
Provides detailed statistical analysis with progress tracking for large simulations.

## Getting Started

### Prerequisites
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ridjao/bjsim-react.git
   cd bjsim-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Interactive Mode
1. Click the **"Interactive"** tab to switch to interactive gameplay
2. Click **"Deal New Hand"** to start a new round
3. Use the action buttons (Hit, Stand, Double, Split, Surrender) to play your hand
4. View real-time statistics in the side panel
5. Enable **Developer Mode** to test specific card scenarios

### Simulator Mode
1. Click the **"Simulator"** tab for statistical analysis
2. Configure simulation parameters:
   - **Number of Players**: 1-6 players
   - **Number of Games**: From 10 to 10 million hands
   - **Number of Decks**: 1, 2, 4, 6, or 8 decks
   - **Strategy**: Basic Strategy or Conservative Strategy
3. Click **"Run Simulation"** to start
4. Monitor progress with the real-time progress indicator
5. Review comprehensive statistics when complete

## Game Statistics

Both modes track detailed statistics including:
- **Games**: Total hands played
- **Wins/Losses/Pushes**: Outcome breakdown
- **Blackjacks**: Natural 21s dealt
- **Busts**: Times player exceeded 21
- **Win Rate**: Percentage of hands won
- **Earnings**: Net monetary result
- **Total Bet**: Amount wagered
- **Return**: Return on investment percentage

## Available Scripts

### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000).
The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.
The build is optimized and minified for best performance.

### `npm run eject`
**Note: This is a one-way operation!**
Removes the single build dependency and copies all configuration files.

## Project Structure

```
src/
├── components/           # React components
│   ├── GameBoard.js     # Interactive mode component
│   ├── Simulator.js     # Simulator mode component
│   ├── Player.js        # Player hand display
│   ├── Hand.js          # Card hand visualization
│   └── *.css           # Component styles
├── game/                # Game logic
│   ├── Game.js         # Main game engine
│   ├── Player.js       # Player class
│   ├── Hand.js         # Hand management
│   ├── Card.js         # Card representation
│   ├── Shoe.js         # Deck management
│   └── Strategy.js     # Playing strategies
└── App.js              # Main application component
```

## Strategies

### Basic Strategy
Implements mathematically optimal blackjack basic strategy based on:
- Player hand total (hard/soft)
- Dealer up card
- Pair splitting opportunities
- Double down situations

### Conservative Strategy
A more cautious approach with:
- Less aggressive doubling
- Conservative splitting
- Earlier standing on borderline hands

## Technologies Used

- **React 19** - Frontend framework
- **JavaScript ES6+** - Core programming language
- **CSS3** - Styling and animations
- **Create React App** - Build tooling and development server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Based on standard blackjack rules and optimal basic strategy
- Inspired by casino blackjack games and statistical analysis tools
- Built with modern React best practices and responsive design principles