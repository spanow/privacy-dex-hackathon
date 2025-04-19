import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivacyDashboard from '../../components/PrivacyDashboard/PrivacyDashboard';
import '@testing-library/jest-dom';

describe('PrivacyDashboard', () => {
  test('renders the privacy shield title', () => {
    render(<PrivacyDashboard />);
    const titleElement = screen.getByText(/PRIVACY SHIELD/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders all four privacy indicators', () => {
    render(<PrivacyDashboard />);
    expect(screen.getByText(/Identity/i)).toBeInTheDocument();
    expect(screen.getByText(/Amounts/i)).toBeInTheDocument();
    expect(screen.getByText(/History/i)).toBeInTheDocument();
    expect(screen.getByText(/Protection/i)).toBeInTheDocument();
  });

  test('displays correct status text when features are active', () => {
    render(<PrivacyDashboard />);
    expect(screen.getByText(/Protected/i)).toBeInTheDocument();
    expect(screen.getByText(/Hidden/i)).toBeInTheDocument();
    expect(screen.getByText(/Private/i)).toBeInTheDocument();
    expect(screen.getByText(/Anti-MEV/i)).toBeInTheDocument();
  });

  test('displays correct status text when features are inactive', () => {
    render(
      <PrivacyDashboard
        identityProtected={false}
        amountsHidden={false}
        historyPrivate={false}
        mevProtected={false}
      />
    );
    expect(screen.getByText(/Exposed/i)).toBeInTheDocument();
    expect(screen.getByText(/Visible/i)).toBeInTheDocument();
    expect(screen.getByText(/Public/i)).toBeInTheDocument();
    expect(screen.getByText(/Vulnerable/i)).toBeInTheDocument();
  });
});