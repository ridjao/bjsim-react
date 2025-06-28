import { render, screen } from '@testing-library/react';
import App from './App';

test('renders blackjack simulator', () => {
  render(<App />);
  // Check that the simulator view is rendered by default
  const simulatorElements = screen.getAllByText(/simulator/i);
  expect(simulatorElements.length).toBeGreaterThan(0);
});

test('renders with default parameters', () => {
  render(<App />);
  // The app should render without crashing with default parameters
  expect(document.body).toBeInTheDocument();
});
