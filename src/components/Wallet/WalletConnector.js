import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnector = ({ onConnect }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected, error
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  const checkIfMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      if (!checkIfMetaMaskInstalled()) {
        setStatus('error');
        setError('MetaMask is not installed. Please install it to use this app.');
        return;
      }

      setStatus('connecting');
      
      // Request account access
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        setStatus('error');
        setError('No accounts found. Please connect to MetaMask.');
        return;
      }
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const network = await provider.getNetwork();
      
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setStatus('connected');
      
      // Call the onConnect callback if provided
      if (onConnect) {
        onConnect({
          account: accounts[0],
          chainId: network.chainId,
          provider
        });
      }
      
      // Setup listeners for account and chain changes
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setStatus('error');
      setError(error.message || 'Failed to connect to wallet');
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User has disconnected all accounts
      setStatus('disconnected');
      setAccount(null);
      return;
    }
    
    setAccount(accounts[0]);
  };

  // Handle chain changes
  const handleChainChanged = (chainId) => {
    // Force refresh on chain change as recommended by MetaMask
    window.location.reload();
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setStatus('disconnected');
    setError(null);
    
    // Remove listeners
    const { ethereum } = window;
    if (ethereum) {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  // Format account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get network name based on chainId
  const getNetworkName = (id) => {
    switch (id) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      default:
        return 'Unknown Network';
    }
  };

  // Render different content based on connection status
  const renderContent = () => {
    switch (status) {
      case 'connected':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-green-800 bg-opacity-30 px-3 py-1 rounded-full text-green-400 text-xs font-medium mb-2">
              Connected
            </div>
            <p className="font-mono text-sm mb-1">{formatAddress(account)}</p>
            <p className="text-xs text-gray-400 mb-4">{getNetworkName(chainId)}</p>
            <button
              onClick={disconnectWallet}
              className="text-xs text-gray-400 hover:text-white"
            >
              Disconnect
            </button>
          </div>
        );
        
      case 'connecting':
        return (
          <div className="flex flex-col items-center">
            <div className="animate-pulse mb-2">
              <div className="h-5 w-20 bg-gray-600 rounded-full"></div>
            </div>
            <p className="text-sm">Connecting...</p>
          </div>
        );
        
      case 'error':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-red-800 bg-opacity-30 px-3 py-1 rounded-full text-red-400 text-xs font-medium mb-2">
              Error
            </div>
            <p className="text-sm text-red-400 mb-3" data-testid="error-message">{error}</p>
            <button
              onClick={connectWallet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        );
        
      default: // disconnected
        return (
          <div className="flex flex-col items-center">
            <p className="text-sm mb-4">Connect your wallet to use the DEX</p>
            <button
              onClick={connectWallet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Connect Wallet
            </button>
          </div>
        );
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold mb-4 text-center">Wallet</h3>
      {renderContent()}
    </div>
  );
};

export default WalletConnector;