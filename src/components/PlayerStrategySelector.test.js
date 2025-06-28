import { render, screen } from '@testing-library/react';
import PlayerStrategySelector from '../components/PlayerStrategySelector.jsx';

// Test that the PlayerStrategySelector component renders correctly
test('renders PlayerStrategySelector with multiple players', () => {
  const mockProps = {
    playerCount: 3,
    playerStrategies: ['basic', 'conservative', 'basic'],
    onPlayerStrategyChange: jest.fn(),
    getPlayerStrategy: (index) => ['basic', 'conservative', 'basic'][index] || 'basic',
    disabled: false
  };

  render(<PlayerStrategySelector {...mockProps} />);
  
  // Check that player labels are rendered
  expect(screen.getByText('Player 1:')).toBeInTheDocument();
  expect(screen.getByText('Player 2:')).toBeInTheDocument();
  expect(screen.getByText('Player 3:')).toBeInTheDocument();
  
  // Check that strategy dropdowns are rendered
  const selects = screen.getAllByRole('combobox');
  expect(selects).toHaveLength(3);
});

test('does not render for single player', () => {
  const mockProps = {
    playerCount: 1,
    playerStrategies: ['basic'],
    onPlayerStrategyChange: jest.fn(),
    getPlayerStrategy: () => 'basic',
    disabled: false
  };

  const { container } = render(<PlayerStrategySelector {...mockProps} />);
  expect(container.firstChild).toBeNull();
});

test('renders with correct strategy values', () => {
  const mockProps = {
    playerCount: 2,
    playerStrategies: ['basic', 'conservative'],
    onPlayerStrategyChange: jest.fn(),
    getPlayerStrategy: (index) => ['basic', 'conservative'][index] || 'basic',
    disabled: false
  };

  render(<PlayerStrategySelector {...mockProps} />);
  
  const selects = screen.getAllByRole('combobox');
  expect(selects[0]).toHaveValue('basic');
  expect(selects[1]).toHaveValue('conservative');
});