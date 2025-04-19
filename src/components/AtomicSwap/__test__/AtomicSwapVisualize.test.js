import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AtomicSwapVisualizer from '../AtomicSwapVisualizer';
import '@testing-library/jest-dom';

describe('AtomicSwapVisualizer Component', () => {
  test('renders the main title', () => {
    render(<AtomicSwapVisualizer />);
    const titleElement = screen.getByText(/Cross-Chain Atomic Swap Visualization/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('initially shows the setup step', () => {
    render(<AtomicSwapVisualizer />);
    // Check for more specific elements to avoid multiple matches
    expect(screen.getByRole('heading', { name: /Alice/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Bob/i })).toBeInTheDocument();
    expect(screen.getByText(/Bitcoin Blockchain/i)).toBeInTheDocument();
    expect(screen.getByText(/Ethereum Blockchain/i)).toBeInTheDocument();
  });

  test('can navigate through the steps', () => {
    render(<AtomicSwapVisualizer />);
    
    // Click the next button
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Should show the secret generation step
    expect(screen.getByText(/Secret Generation/i)).toBeInTheDocument();
    
    // Click next again
    fireEvent.click(nextButton);
    
    // Should show the HTLC step
    expect(screen.getByText(/HTLC Smart Contract Deployment/i)).toBeInTheDocument();
  });

  test('disables previous button on first step', () => {
    render(<AtomicSwapVisualizer />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });
});