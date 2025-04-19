import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ZKCircuitVisualizer from '../ZKCircuitVisualizer';
import '@testing-library/jest-dom';

describe('ZKCircuitVisualizer Component', () => {
  test('renders the main title', () => {
    render(<ZKCircuitVisualizer />);
    const titleElement = screen.getByText(/Zero-Knowledge Proof Visualization/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('initially shows the setup step', () => {
    render(<ZKCircuitVisualizer />);
    expect(screen.getByText(/Step 1: Setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Private inputs/i)).toBeInTheDocument();
  });

  test('can navigate to the next step', () => {
    render(<ZKCircuitVisualizer />);
    
    // Click the next button
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Should show the commitment step
    expect(screen.getByText(/Step 2: Commitment/i)).toBeInTheDocument();
  });

  test('disables previous button on first step', () => {
    render(<ZKCircuitVisualizer />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });
});