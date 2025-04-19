import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PrivacyDashboard from '../components/PrivacyDashboard/PrivacyDashboard';
import WalletConnector from '../components/Wallet/WalletConnector';

const SwapPage = () => {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(18.12); // Mock exchange rate ETH/BTC
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [privacyLevel, setPrivacyLevel] = useState({
    identityProtected: true,
    amountsHidden: true,
    historyPrivate: true,
    mevProtected: true
  });

  // Function to swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Update the to amount when from amount or currency changes
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const calculatedAmount = parseFloat(fromAmount) * exchangeRate;
      setToAmount(calculatedAmount.toFixed(4));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency, exchangeRate]);

  // Function to update privacy level
  const updatePrivacyLevel = (key) => {
    setPrivacyLevel(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle wallet connection
  const handleWalletConnect = (walletData) => {
    setWalletConnected(true);
    setWalletInfo(walletData);
    console.log('Wallet connected:', walletData);
  };

  // Handle swap button click
  const handleSwap = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!fromAmount || isNaN(parseFloat(fromAmount)) || parseFloat(fromAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    try {
      // This is just a mock implementation for the hackathon
      // In a real implementation, we would:
      // 1. Generate ZK proof if privacy is enabled
      // 2. Call the appropriate contract method
      alert(`Initiating ${fromCurrency} to ${toCurrency} swap with the following privacy settings:
        - Identity Protection: ${privacyLevel.identityProtected ? 'On' : 'Off'}
        - Amount Hiding: ${privacyLevel.amountsHidden ? 'On' : 'Off'} 
        - History Privacy: ${privacyLevel.historyPrivate ? 'On' : 'Off'}
        - MEV Protection: ${privacyLevel.mevProtected ? 'On' : 'Off'}
      `);
      
      // For demo, let's simulate a swap with a timeout
      setTimeout(() => {
        alert('Swap successful!');
      }, 2000);
      
    } catch (error) {
      console.error('Swap error:', error);
      alert(`Swap failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Private Swap</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <PrivacyDashboard 
            identityProtected={privacyLevel.identityProtected}
            amountsHidden={privacyLevel.amountsHidden}
            historyPrivate={privacyLevel.historyPrivate}
            mevProtected={privacyLevel.mevProtected}
          />
        </div>
        <div>
          <WalletConnector onConnect={handleWalletConnect} />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="w-5/12">
            <label className="block text-gray-400 mb-2">From</label>
            <div className="flex items-center bg-gray-700 rounded-lg p-4">
              <select 
                className="bg-transparent flex-grow outline-none"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
              <input 
                type="number" 
                className="bg-transparent text-right w-1/2 outline-none"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full"
            onClick={handleSwapCurrencies}
          >
            ⇄
          </button>
          
          <div className="w-5/12">
            <label className="block text-gray-400 mb-2">To</label>
            <div className="flex items-center bg-gray-700 rounded-lg p-4">
              <select 
                className="bg-transparent flex-grow outline-none"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
              <input 
                type="number" 
                className="bg-transparent text-right w-1/2 outline-none"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                disabled
              />
            </div>
          </div>
        </div>
        
        <div className="text-right mb-4">
          <span className="text-sm text-gray-400">
            Exchange Rate: 1 BTC = {exchangeRate} ETH
          </span>
        </div>
        
        <button 
          onClick={handleSwap}
          className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-colors ${
            walletConnected
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
          disabled={!walletConnected}
        >
          {walletConnected ? 'Swap' : 'Connect Wallet to Start'}
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Identity Protection</span>
            <label className="relative inline-block w-12 h-6">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={privacyLevel.identityProtected}
                onChange={() => updatePrivacyLevel('identityProtected')}
              />
              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${privacyLevel.identityProtected ? 'bg-green-500' : 'bg-gray-600'}`}>
                <span className={`absolute h-4 w-4 rounded-full bg-white transition-transform ${privacyLevel.identityProtected ? 'transform translate-x-6' : 'transform translate-x-1'}`} style={{top: '4px'}}></span>
              </span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Amount Hiding</span>
            <label className="relative inline-block w-12 h-6">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={privacyLevel.amountsHidden}
                onChange={() => updatePrivacyLevel('amountsHidden')}
              />
              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${privacyLevel.amountsHidden ? 'bg-green-500' : 'bg-gray-600'}`}>
                <span className={`absolute h-4 w-4 rounded-full bg-white transition-transform ${privacyLevel.amountsHidden ? 'transform translate-x-6' : 'transform translate-x-1'}`} style={{top: '4px'}}></span>
              </span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Transaction History Privacy</span>
            <label className="relative inline-block w-12 h-6">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={privacyLevel.historyPrivate}
                onChange={() => updatePrivacyLevel('historyPrivate')}
              />
              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${privacyLevel.historyPrivate ? 'bg-green-500' : 'bg-gray-600'}`}>
                <span className={`absolute h-4 w-4 rounded-full bg-white transition-transform ${privacyLevel.historyPrivate ? 'transform translate-x-6' : 'transform translate-x-1'}`} style={{top: '4px'}}></span>
              </span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span>MEV Protection</span>
            <label className="relative inline-block w-12 h-6">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={privacyLevel.mevProtected}
                onChange={() => updatePrivacyLevel('mevProtected')}
              />
              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${privacyLevel.mevProtected ? 'bg-green-500' : 'bg-gray-600'}`}>
                <span className={`absolute h-4 w-4 rounded-full bg-white transition-transform ${privacyLevel.mevProtected ? 'transform translate-x-6' : 'transform translate-x-1'}`} style={{top: '4px'}}></span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;