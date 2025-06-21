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
- **Node.js** (version 18 or higher)
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
   
   The Vite development server will start in under 200ms with instant Hot Module Replacement.

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
Features lightning-fast startup (~200ms) and instant Hot Module Replacement with Vite.

### `npm run build`
Builds the app for production to the `dist` folder.  
Creates optimized bundles with tree-shaking and modern JavaScript features.

### `npm run preview`
Serves the production build locally on [http://localhost:4173](http://localhost:4173).  
Perfect for testing the production build before deployment.

## Project Structure

```
├── index.html           # Main HTML template (Vite entry point)
├── vite.config.js       # Vite configuration
├── src/
│   ├── components/      # React components
│   │   ├── GameBoard.jsx    # Interactive mode component
│   │   ├── Simulator.jsx    # Simulator mode component
│   │   ├── Player.jsx       # Player hand display
│   │   ├── Hand.jsx         # Card hand visualization
│   │   ├── Card.jsx         # Individual card component
│   │   ├── GameControls.jsx # Game control buttons
│   │   ├── DevMode.jsx      # Developer mode component
│   │   └── *.css           # Component styles
│   ├── game/            # Game logic (vanilla JavaScript)
│   │   ├── Game.js      # Main game engine
│   │   ├── Player.js    # Player class
│   │   ├── Hand.js      # Hand management
│   │   ├── Card.js      # Card representation
│   │   ├── Shoe.js      # Deck management
│   │   └── Strategy.js  # Playing strategies
│   ├── App.jsx          # Main application component
│   └── index.jsx        # Application entry point
└── public/              # Static assets
    ├── favicon.ico
    └── manifest.json
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

- **React 19** - Frontend framework with latest features
- **Vite** - Lightning-fast build tool and development server
- **JavaScript ES6+** - Modern JavaScript with JSX
- **CSS3** - Styling and animations
- **esbuild** - Ultra-fast JavaScript bundler (via Vite)

## Performance & Development Experience

This project has been migrated from Create React App to Vite for superior performance:

### 🚀 **Development Speed**
- **Dev server startup**: ~200ms (10x faster than CRA)
- **Hot Module Replacement**: Instant updates
- **Build time**: ~700ms for production builds

### 🔧 **Modern Tooling**
- **Zero configuration** required for most use cases
- **Tree shaking** for optimal bundle sizes
- **Native ES modules** in development
- **Optimized production builds** with automatic code splitting

### 📦 **Bundle Optimization**
- Smaller bundle sizes with better compression
- Modern JavaScript output for supported browsers
- Automatic vendor chunk splitting

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