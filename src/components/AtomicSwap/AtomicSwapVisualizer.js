import React, { useState, useEffect } from 'react';

const AtomicSwapVisualizer = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000); // milliseconds
  
  const totalSteps = 6;
  
  // Auto-play logic
  useEffect(() => {
    let timer;
    if (playing) {
      timer = setInterval(() => {
        setStep((prevStep) => {
          const nextStep = prevStep + 1;
          if (nextStep >= totalSteps) {
            setPlaying(false);
            return 0;
          }
          return nextStep;
        });
      }, speed);
    }
    
    return () => clearInterval(timer);
  }, [playing, speed]);
  
  const handlePlayPause = () => {
    setPlaying(!playing);
  };
  
  const handlePrevStep = () => {
    setPlaying(false);
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };
  
  const handleNextStep = () => {
    setPlaying(false);
    setStep((prevStep) => (prevStep < totalSteps - 1 ? prevStep + 1 : prevStep));
  };
  
  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };
  
  // Helper to render blockchain connections
  const Connection = ({ active, direction = 'down' }) => {
    const getPathData = () => {
      if (direction === 'down') {
        return "M20,0 L20,80";
      } else {
        return "M0,40 L100,40";
      }
    };
    
    return (
      <div className={`relative ${direction === 'down' ? 'h-20' : 'h-10'} flex items-center justify-center`}>
        <svg width={direction === 'down' ? 40 : 100} height={direction === 'down' ? 80 : 40} className="absolute">
          <path
            d={getPathData()}
            stroke={active ? "#6366f1" : "#374151"}
            strokeWidth="2"
            strokeDasharray={active ? "none" : "5,5"}
            fill="none"
          />
          {active && direction === 'down' && (
            <polygon 
              points="20,80 15,70 25,70" 
              fill="#6366f1"
            />
          )}
          {active && direction === 'right' && (
            <polygon 
              points="100,40 90,35 90,45" 
              fill="#6366f1"
            />
          )}
        </svg>
      </div>
    );
  };
  
  // Render the specific step content
  const renderSwapStep = () => {
    switch (step) {
      case 0:
        return renderSetup();
      case 1:
        return renderSecretGeneration();
      case 2:
        return renderHTLCDeployment();
      case 3:
        return renderBitcoinLock();
      case 4:
        return renderEthereumClaim();
      case 5:
        return renderBitcoinClaim();
      default:
        return null;
    }
  };
  
  const renderSetup = () => (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="mb-4 bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-800">
          <h3 className="font-bold text-blue-400 mb-2">Alice</h3>
          <div className="space-y-2">
            <p className="text-sm">Has: <span className="font-mono">2.5 BTC</span></p>
            <p className="text-sm">Wants: <span className="font-mono">45.3 ETH</span></p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023" alt="Bitcoin" className="w-6 h-6 mr-2" />
              <span>Bitcoin Blockchain</span>
            </div>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">Testnet</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <p className="text-xs font-mono mb-1">Alice's BTC Address:</p>
            <p className="text-xs font-mono truncate">bc1q2c3v4b5n6m7a8s9d0f...</p>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 bg-purple-900 bg-opacity-20 p-4 rounded-lg border border-purple-800">
          <h3 className="font-bold text-purple-400 mb-2">Bob</h3>
          <div className="space-y-2">
            <p className="text-sm">Has: <span className="font-mono">45.3 ETH</span></p>
            <p className="text-sm">Wants: <span className="font-mono">2.5 BTC</span></p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023" alt="Ethereum" className="w-6 h-6 mr-2" />
              <span>Ethereum Blockchain</span>
            </div>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">Sepolia</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <p className="text-xs font-mono mb-1">Bob's ETH Address:</p>
            <p className="text-xs font-mono truncate">0x7a3b4c5d6e7f8g9h0i1j2k3...</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 bg-indigo-900 bg-opacity-20 p-4 rounded-lg border border-indigo-800 mt-4">
        <h3 className="text-center font-bold mb-2">The Challenge</h3>
        <p className="text-sm text-center">
          Alice and Bob want to swap assets across different blockchains.<br/>
          They don't trust each other and there's no central authority they both trust.
        </p>
      </div>
    </div>
  );
  
  const renderSecretGeneration = () => (
    <div className="space-y-6">
      <div className="bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-800">
        <h3 className="font-bold text-blue-400 mb-2">Step 1: Secret Generation</h3>
        <p className="text-sm mb-4">
          Alice generates a random secret and its hash. The secret will be used to claim funds later.
        </p>
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-xs font-mono mb-1 text-green-400">// Alice generates a random secret</p>
            <p className="font-mono">Secret: "f7d9a8b2c1e0d3f4a5b6c7d8e9f0a1b2"</p>
          </div>
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-xs font-mono mb-1 text-yellow-400">// Alice computes the hash of the secret</p>
            <p className="font-mono">Hash: "0x8c7e6d5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9"</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023" alt="Bitcoin" className="w-6 h-6 mr-2" />
              <span>Bitcoin Chain</span>
            </div>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">Not yet used</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900 opacity-50">
            <p className="text-xs">No Bitcoin transactions yet</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023" alt="Ethereum" className="w-6 h-6 mr-2" />
              <span>Ethereum Chain</span>
            </div>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">Not yet used</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900 opacity-50">
            <p className="text-xs">No Ethereum transactions yet</p>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900 bg-opacity-20 p-4 rounded-lg border border-indigo-800">
        <h3 className="text-center font-bold mb-2">Key Insight</h3>
        <p className="text-sm text-center">
          The hash is shared with Bob, but the original secret is kept private by Alice.<br/>
          This secret will be the "key" that unlocks both sides of the swap.
        </p>
      </div>
    </div>
  );
  
  const renderHTLCDeployment = () => (
    <div className="space-y-6">
      <div className="bg-purple-900 bg-opacity-20 p-4 rounded-lg border border-purple-800">
        <h3 className="font-bold text-purple-400 mb-2">Step 2: HTLC Smart Contract Deployment</h3>
        <p className="text-sm mb-4">
          Bob deploys a Hashed Timelock Contract (HTLC) on Ethereum using the hash Alice provided.
        </p>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs font-mono mb-1 text-indigo-400">// Bob deploys the Ethereum HTLC</p>
          <div className="space-y-2 font-mono text-sm">
            <p>Contract: <span className="text-green-400">PrivacyHTLC</span> at 0x1a2b3c...</p>
            <p>Parameters:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recipient: <span className="text-blue-400">Alice's ETH address</span></li>
              <li>Hashlock: <span className="text-yellow-400">0x8c7e6d5f4a...</span></li>
              <li>Timelock: <span className="text-purple-400">24 hours</span></li>
              <li>Amount: <span className="text-green-400">45.3 ETH</span></li>
              <li>ZK Commitment: <span className="text-pink-400">0xab12cd3...</span></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023" alt="Bitcoin" className="w-6 h-6 mr-2" />
              <span>Bitcoin Chain</span>
            </div>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">Not yet used</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900 opacity-50">
            <p className="text-xs">No Bitcoin transactions yet</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023" alt="Ethereum" className="w-6 h-6 mr-2" />
              <span>Ethereum Chain</span>
            </div>
            <span className="text-xs bg-red-500 px-2 py-1 rounded">Active</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <div className="text-xs space-y-2">
              <p className="font-mono">Transaction: 0x5f4e3d2c1b0a...</p>
              <p className="flex justify-between">
                <span>From:</span>
                <span className="font-mono text-purple-400">Bob</span>
              </p>
              <p className="flex justify-between">
                <span>To:</span>
                <span className="font-mono">PrivacyHTLC Contract</span>
              </p>
              <p className="flex justify-between">
                <span>Value:</span>
                <span className="font-mono text-green-400">45.3 ETH</span>
              </p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400">Confirmed</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900 bg-opacity-20 p-4 rounded-lg border border-indigo-800">
        <h3 className="text-center font-bold mb-2">Contract Logic</h3>
        <p className="text-sm text-center">
          The ETH is now locked in the smart contract and can only be claimed by:<br/>
          1. Alice, if she reveals the secret that hashes to the hashlock<br/>
          2. Bob, if the timelock expires (refund path)
        </p>
      </div>
    </div>
  );
  
  const renderBitcoinLock = () => (
    <div className="space-y-6">
      <div className="bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-800">
        <h3 className="font-bold text-blue-400 mb-2">Step 3: Bitcoin HTLC Creation</h3>
        <p className="text-sm mb-4">
          After verifying Bob's Ethereum HTLC, Alice creates a Bitcoin HTLC using the same hashlock.
        </p>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs font-mono mb-1 text-indigo-400">// Alice creates Bitcoin P2SH HTLC</p>
          <div className="space-y-2 font-mono text-sm">
            <p>Bitcoin P2SH Address: <span className="text-green-400">bc1qht1c...</span></p>
            <p>Script Parameters:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recipient: <span className="text-purple-400">Bob's BTC address</span></li>
              <li>Hashlock: <span className="text-yellow-400">0x8c7e6d5f4a...</span> (same as ETH)</li>
              <li>Timelock: <span className="text-pink-400">48 hours</span> (longer than ETH)</li>
              <li>Amount: <span className="text-green-400">2.5 BTC</span></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023" alt="Bitcoin" className="w-6 h-6 mr-2" />
              <span>Bitcoin Chain</span>
            </div>
            <span className="text-xs bg-red-500 px-2 py-1 rounded">Active</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <div className="text-xs space-y-2">
              <p className="font-mono">Transaction: 6a7b8c9d0e1f...</p>
              <p className="flex justify-between">
                <span>From:</span>
                <span className="font-mono text-blue-400">Alice</span>
              </p>
              <p className="flex justify-between">
                <span>To:</span>
                <span className="font-mono">P2SH HTLC Address</span>
              </p>
              <p className="flex justify-between">
                <span>Value:</span>
                <span className="font-mono text-green-400">2.5 BTC</span>
              </p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400">Confirmed (3 blocks)</span>
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023" alt="Ethereum" className="w-6 h-6 mr-2" />
              <span>Ethereum Chain</span>
            </div>
            <span className="text-xs bg-green-500 px-2 py-1 rounded">Locked</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <div className="text-xs space-y-2">
              <p className="font-mono">Contract: 0x1a2b3c...</p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className="text-yellow-400">Waiting for claim</span>
              </p>
              <p className="flex justify-between">
                <span>Locked amount:</span>
                <span className="font-mono text-green-400">45.3 ETH</span>
              </p>
              <p className="flex justify-between">
                <span>Time remaining:</span>
                <span className="font-mono text-pink-400">23:12:45</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900 bg-opacity-20 p-4 rounded-lg border border-indigo-800">
        <h3 className="text-center font-bold mb-2">Cross-Chain Lock Established</h3>
        <p className="text-sm text-center">
          Now both assets are locked with the same hashlock.<br/>
          Whoever reveals the secret first can claim their asset, enabling the other party to claim theirs.
        </p>
      </div>
    </div>
  );
  
  const renderEthereumClaim = () => (
    <div className="space-y-6">
      <div className="bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-800">
        <h3 className="font-bold text-blue-400 mb-2">Step 4: Alice Claims ETH with Secret</h3>
        <p className="text-sm mb-4">
          Alice claims the ETH from the Ethereum HTLC by revealing the secret.
        </p>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs font-mono mb-1 text-indigo-400">// Alice calls the withdraw function</p>
          <div className="space-y-2 font-mono text-sm">
            <p>Function: <span className="text-green-400">withdraw()</span></p>
            <p>Parameters:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>SwapID: <span className="text-purple-400">0xdef012...</span></li>
              <li>Preimage: <span className="text-yellow-400">f7d9a8b2c1e0d3f4a5b6c7d8e9f0a1b2</span> (the secret!)</li>
              <li>ZK Proof: <span className="text-pink-400">{"{...proof data...}"}</span></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023" alt="Bitcoin" className="w-6 h-6 mr-2" />
              <span>Bitcoin Chain</span>
            </div>
            <span className="text-xs bg-green-500 px-2 py-1 rounded">Locked</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <div className="text-xs space-y-2">
              <p className="font-mono">P2SH HTLC Address: bc1qht1c...</p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className="text-yellow-400">Waiting for claim</span>
              </p>
              <p className="flex justify-between">
                <span>Locked amount:</span>
                <span className="font-mono text-green-400">2.5 BTC</span>
              </p>
              <p className="flex justify-between">
                <span>Time remaining:</span>
                <span className="font-mono text-pink-400">47:08:32</span>
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023" alt="Ethereum" className="w-6 h-6 mr-2" />
              <span>Ethereum Chain</span>
            </div>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded">Claimed</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <div className="text-xs space-y-2">
              <p className="font-mono">Transaction: 0x9a8b7c6d5e...</p>
              <p className="flex justify-between">
                <span>From:</span>
                <span className="font-mono text-blue-400">Alice</span>
              </p>
              <p className="flex justify-between">
                <span>To:</span>
                <span className="font-mono">PrivacyHTLC Contract</span>
              </p>
              <p className="flex justify-between">
                <span>Action:</span>
                <span className="font-mono text-green-400">withdraw()</span>
              </p>
              <p className="flex justify-between">
                <span>Result:</span>
                <span className="text-green-400">Success - 45.3 ETH to Alice</span>
              </p>
              <p className="flex justify-between">
                <span>Secret revealed:</span>
                <span className="font-mono text-yellow-400 truncate">f7d9a8b2...</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900 bg-opacity-20 p-4 rounded-lg border border-indigo-800">
        <h3 className="text-center font-bold mb-2">Secret Revealed On-Chain</h3>
        <p className="text-sm text-center">
          Alice has successfully claimed the ETH by revealing the secret.<br/>
          The secret is now publicly visible on the Ethereum blockchain!
        </p>
      </div>
    </div>
  );
  
  const renderBitcoinClaim = () => (
    <div className="space-y-6">
      <div className="bg-purple-900 bg-opacity-20 p-4 rounded-lg border border-purple-800">
        <h3 className="font-bold text-purple-400 mb-2">Step 5: Bob Claims BTC with the Revealed Secret</h3>
        <p className="text-sm mb-4">
          Bob extracts the secret from Ethereum blockchain and uses it to claim the Bitcoin.
        </p>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs font-mono mb-1 text-indigo-400">// Bob creates Bitcoin claim transaction</p>
          <div className="space-y-2 font-mono text-sm">
            <p>Transaction Type: <span className="text-green-400">P2SH Spend</span></p>
            <p>Parameters:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>HTLC Address: <span className="text-purple-400">bc1qht1c...</span></li>
              <li>Preimage: <span className="text-yellow-400">f7d9a8b2c1e0d3f4a5b6c7d8e9f0a1b2</span></li>
              <li>Recipient: <span className="text-blue-400">Bob's BTC address</span></li>
              <li>Amount: <span className="text-green-400">2.5 BTC (minus fees)</span></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023" alt="Bitcoin" className="w-6 h-6 mr-2" />
              <span>Bitcoin Chain</span>
            </div>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded">Claimed</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <div className="text-xs space-y-2">
              <p className="font-mono">Transaction: 1d2e3f4g5h6i...</p>
              <p className="flex justify-between">
                <span>From:</span>
                <span className="font-mono">P2SH HTLC Address</span>
              </p>
              <p className="flex justify-between">
                <span>To:</span>
                <span className="font-mono text-purple-400">Bob</span>
              </p>
              <p className="flex justify-between">
                <span>Value:</span>
                <span className="font-mono text-green-400">2.49 BTC (fees: 0.01)</span>
              </p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400">Confirmed (1 block)</span>
              </p>
              <p className="flex justify-between">
                <span>Secret used:</span>
                <span className="font-mono text-yellow-400 truncate">f7d9a8b2...</span>
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023" alt="Ethereum" className="w-6 h-6 mr-2" />
              <span>Ethereum Chain</span>
            </div>
            <span className="text-xs bg-gray-500 px-2 py-1 rounded">Completed</span>
          </div>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
            <div className="text-xs space-y-2">
              <p className="font-mono">Contract: 0x1a2b3c...</p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400">Completed</span>
              </p>
              <p className="flex justify-between">
                <span>Final state:</span>
                <span className="font-mono">45.3 ETH to Alice</span>
              </p>
              <p className="flex justify-between">
                <span>Secret:</span>
                <span className="font-mono text-yellow-400 truncate">f7d9a8b2...</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-800">
        <h3 className="text-center font-bold text-green-400 mb-2">Atomic Swap Complete!</h3>
        <p className="text-sm text-center">
          The cross-chain swap is successfully completed:<br/>
          • Alice has received 45.3 ETH<br/>
          • Bob has received 2.5 BTC<br/>
          • No trust was required between the parties
        </p>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Cross-Chain Atomic Swap Visualization</h2>
      
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="min-h-[500px] bg-gray-900 rounded-lg p-6 mb-6">
        {renderSwapStep()}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full disabled:opacity-50"
            onClick={handlePrevStep}
            disabled={step === 0}
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full"
            onClick={handlePlayPause}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full disabled:opacity-50"
            onClick={handleNextStep}
            disabled={step === totalSteps - 1}
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Speed:</span>
          <select 
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
            value={speed}
            onChange={handleSpeedChange}
          >
            <option value="4000">Slow</option>
            <option value="2000">Normal</option>
            <option value="1000">Fast</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AtomicSwapVisualizer;