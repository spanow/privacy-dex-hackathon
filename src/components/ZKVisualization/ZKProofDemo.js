import React, { useState, useEffect } from 'react';
import ZKProofService from '../../services/ZKProofService';

const ZKProofDemo = () => {
  const [amount, setAmount] = useState(1.5);
  const [salt, setSalt] = useState('');
  const [commitment, setCommitment] = useState('');
  const [proof, setProof] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  
  // Fixed parameters for demo
  const exchangeRate = 18120; // ETH/BTC * 1000
  const maxAmount = 10; // BTC
  
  // Initialize the service
  useEffect(() => {
    const init = async () => {
      try {
        await ZKProofService.initialize();
        // Generate a random salt on load
        const randomSalt = ZKProofService.generateRandomSalt();
        setSalt(randomSalt);
      } catch (err) {
        setError('Failed to initialize ZK service');
        console.error(err);
      }
    };
    
    init();
  }, []);
  
  // Generate commitment when amount or salt changes
  useEffect(() => {
    const generateCommitment = async () => {
      if (!salt) return;
      
      try {
        const newCommitment = await ZKProofService.generateAmountCommitment(amount, salt);
        setCommitment(newCommitment);
      } catch (err) {
        console.error('Error generating commitment:', err);
      }
    };
    
    generateCommitment();
  }, [amount, salt]);
  
  // Handle generating a new salt
  const handleNewSalt = () => {
    const randomSalt = ZKProofService.generateRandomSalt();
    setSalt(randomSalt);
  };
  
  // Handle amount change
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0 && value <= maxAmount) {
      setAmount(value);
    }
  };
  
  // Generate ZK proof
  const handleGenerateProof = async () => {
    setLoading(true);
    setError(null);
    setProof(null);
    setVerificationResult(null);
    
    try {
      const proofResult = await ZKProofService.generateAmountProof({
        amount,
        salt,
        exchangeRate,
        maxAmount
      });
      
      setProof(proofResult);
      setStep(2);
    } catch (err) {
      setError('Failed to generate proof: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Verify ZK proof
  const handleVerifyProof = async () => {
    if (!proof) return;
    
    setLoading(true);
    setVerificationResult(null);
    
    try {
      const verified = await ZKProofService.verifyProof(
        proof.proof,
        proof.publicSignals
      );
      
      setVerificationResult(verified);
      setStep(3);
    } catch (err) {
      setError('Failed to verify proof: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset everything
  const handleReset = () => {
    setProof(null);
    setVerificationResult(null);
    setStep(1);
    handleNewSalt();
  };
  
  // Format hex string for display
  const formatHex = (hex, length = 10) => {
    if (!hex) return '';
    if (hex.startsWith('0x')) {
      return `${hex.substring(0, length + 2)}...${hex.substring(hex.length - 4)}`;
    }
    return `${hex.substring(0, length)}...${hex.substring(hex.length - 4)}`;
  };
  
  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Step 1: Create Private Data & Commitment</h3>
            <p className="mb-4">
              Enter your private amount and we'll generate a cryptographic commitment.
              This commitment hides the amount but can be verified later.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (BTC)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  min="0.001"
                  max={maxAmount}
                  step="0.001"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Maximum amount: {maxAmount} BTC
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-300">
                    Random Salt (for privacy)
                  </label>
                  <button
                    onClick={handleNewSalt}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Generate New
                  </button>
                </div>
                <input
                  type="text"
                  value={formatHex(salt, 20)}
                  readOnly
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white font-mono text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  The salt ensures that your commitment is unique and private
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Generated Commitment
                </label>
                <div className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-indigo-400 font-mono text-sm">
                  {formatHex(commitment, 20)}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  This is what will be published on the blockchain
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleGenerateProof}
                  disabled={loading || !commitment}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate ZK Proof'}
                </button>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Step 2: ZK Proof Generated</h3>
            <p className="mb-4">
              Your Zero-Knowledge proof has been generated. This proof allows verification
              of your amount's validity without revealing the actual amount.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Private Inputs (not shared)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Amount</div>
                    <div className="font-mono text-green-400">{amount} BTC</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Salt</div>
                    <div className="font-mono text-green-400 text-xs break-all">
                      {formatHex(salt, 10)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Public Inputs (shared on-chain)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Commitment</div>
                    <div className="font-mono text-indigo-400 text-xs break-all">
                      {formatHex(commitment, 10)}
                    </div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Exchange Rate</div>
                    <div className="font-mono text-indigo-400">
                      {(exchangeRate / 1000).toFixed(3)} ETH/BTC
                    </div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Max Amount</div>
                    <div className="font-mono text-indigo-400">
                      {maxAmount} BTC
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Generated ZK Proof</h4>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-xs font-mono text-indigo-400 break-all max-h-32 overflow-y-auto">
                    {JSON.stringify(proof?.proof, null, 2)}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  This cryptographic proof allows anyone to verify your claims without seeing the private data
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleVerifyProof}
                  disabled={loading || !proof}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify ZK Proof'}
                </button>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Step 3: Verification Result</h3>
            <p className="mb-4">
              The proof has been verified! This means we've confirmed your claims without 
              revealing your private information.
            </p>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${verificationResult ? 'bg-green-900 bg-opacity-30 border border-green-700' : 'bg-red-900 bg-opacity-30 border border-red-700'}`}>
                <div className="flex items-center">
                  {verificationResult ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`font-bold ${verificationResult ? 'text-green-400' : 'text-red-400'}`}>
                    {verificationResult ? 'Verification Successful!' : 'Verification Failed!'}
                  </span>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm font-medium mb-2">What's been verified:</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>The amount is within allowed range (0 - {maxAmount} BTC)</li>
                    <li>The amount commitment is valid</li>
                    <li>The prover knows the original amount and salt</li>
                    <li>The exchange rate calculation is correct</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-800">
                <h4 className="font-medium text-blue-400 mb-2">Privacy Benefits</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Your exact amount remains private</li>
                  <li>Only the commitment is stored on-chain</li>
                  <li>No one can determine your balance from the proof</li>
                  <li>The exchange is verified without revealing sensitive details</li>
                </ul>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Try Again with New Values
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Interactive ZK Proof Generator</h2>
      
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>Create Commitment</span>
          <span>Generate Proof</span>
          <span>Verify</span>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-900 bg-opacity-30 border border-red-700 p-3 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      <div className="min-h-[400px] bg-gray-900 rounded-lg p-6 mb-6">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default ZKProofDemo;