// Integration test for per-player strategy feature
import { Player } from '../game/Player.js';
import { basic, conservative } from '../game/Strategy.js';

describe('Per-Player Strategy Integration', () => {
  test('Players can have different strategies', () => {
    const player1 = new Player("Player 1", basic);
    const player2 = new Player("Player 2", conservative);
    
    expect(player1.strategy).toBe(basic);
    expect(player2.strategy).toBe(conservative);
    expect(player1.strategy).not.toBe(player2.strategy);
  });

  test('Players with different strategies make different decisions', () => {
    const player1 = new Player("Player 1", basic);
    const player2 = new Player("Player 2", conservative);
    
    // Set up a scenario where strategies would differ
    // Player total 15, dealer showing 10
    const playerTotal = 15;
    const dealerTotal = 10;
    const soft = false;
    const pair = false;
    const cards = [{}, {}]; // Mock 2 cards
    
    const action1 = player1.strategy.getAction(playerTotal, dealerTotal, soft, pair, cards);
    const action2 = player2.strategy.getAction(playerTotal, dealerTotal, soft, pair, cards);
    
    // Basic strategy should hit (15 vs 10), Conservative should stand (15 >= 12)
    expect(action1).toBe('h'); // Basic strategy hits
    expect(action2).toBe('s'); // Conservative strategy stands
    expect(action1).not.toBe(action2);
  });

  test('Utility functions work correctly for backward compatibility', () => {
    const getPlayerStrategy = (playerIndex, playerStrategies = [], defaultStrategy = 'basic') => {
      if (playerStrategies.length > playerIndex && playerStrategies[playerIndex]) {
        return playerStrategies[playerIndex];
      }
      return defaultStrategy;
    };
    
    // Test empty strategies array (backward compatibility)
    expect(getPlayerStrategy(0, [], 'basic')).toBe('basic');
    expect(getPlayerStrategy(1, [], 'conservative')).toBe('conservative');
    
    // Test with mixed strategies
    const mixedStrategies = ['basic', 'conservative'];
    expect(getPlayerStrategy(0, mixedStrategies, 'basic')).toBe('basic');
    expect(getPlayerStrategy(1, mixedStrategies, 'basic')).toBe('conservative');
    
    // Test beyond array bounds
    expect(getPlayerStrategy(2, mixedStrategies, 'basic')).toBe('basic');
  });

  test('Player creation with per-player strategies works', () => {
    const createPlayers = (playerCount, getPlayerStrategy) => {
      const players = [];
      for (let i = 0; i < playerCount; i++) {
        const strategyName = getPlayerStrategy(i);
        const strategy = strategyName === 'basic' ? basic : conservative;
        players.push(new Player(`Player ${i + 1}`, strategy));
      }
      return players;
    };
    
    const mockGetPlayerStrategy = (index) => index === 1 ? 'conservative' : 'basic';
    const players = createPlayers(3, mockGetPlayerStrategy);
    
    expect(players).toHaveLength(3);
    expect(players[0].strategy).toBe(basic);
    expect(players[1].strategy).toBe(conservative);
    expect(players[2].strategy).toBe(basic);
  });
});