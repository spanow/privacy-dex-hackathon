import React, { useState } from 'react';
import PrivacyDashboard from '../components/PrivacyDashboard/PrivacyDashboard';

const JudgeDemoPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Determine privacy states for each step
  const getPrivacyState = () => {
    switch(currentStep) {
      case 1:
        return { 
          identityProtected: false, 
          amountsHidden: false, 
          historyPrivate: false, 
          mevProtected: false 
        };
      case 2:
        return { 
          identityProtected: true, 
          amountsHidden: false, 
          historyPrivate: false, 
          mevProtected: false 
        };
      case 3:
        return { 
          identityProtected: true, 
          amountsHidden: true, 
          historyPrivate: false, 
          mevProtected: false 
        };
      case 4:
        return { 
          identityProtected: true, 
          amountsHidden: true, 
          historyPrivate: true, 
          mevProtected: false 
        };
      case 5:
        return { 
          identityProtected: true, 
          amountsHidden: true, 
          historyPrivate: true, 
          mevProtected: true 
        };
      default:
        return { 
          identityProtected: false, 
          amountsHidden: false, 
          historyPrivate: false, 
          mevProtected: false 
        };
    }
  };

  // Content for each step
  const getStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 1: Traditional DEX</h2>
            <p className="mb-4">
              A traditional DEX exposes all transaction data:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Participant identities (blockchain addresses)</li>
              <li>Exchange amounts</li>
              <li>Complete transaction history</li>
              <li>Vulnerability to front-running (MEV)</li>
            </ul>
            <div className="bg-gray-900 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Example of publicly visible transaction:</h3>
              <div className="font-mono text-sm bg-gray-800 p-3 rounded overflow-x-auto">
                <p>Address: 0x7a16ff8270133f063aab6c9977183d9e72835428</p>
                <p>Exchange: 2.5 BTC ➝ 45.3 ETH</p>
                <p>Timestamp: 2025-04-07 14:32:15</p>
                <p>TX Hash: 0x3d7b3c7afe4f14c8786c8f42732d45a8e7c0e8abc845287acbaf77a836a11f9a</p>
              </div>
            </div>
            <p>
              This information allows tracking user activities, their wallets,
              and can be exploited by malicious actors.
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 2: Identity Protection</h2>
            <p className="mb-4">
              Our first layer of privacy masks participant identities:
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 border border-red-700 rounded bg-opacity-20 bg-red-900">
                <h4 className="font-bold mb-2">Traditional DEX</h4>
                <p className="font-mono text-sm">Address: 0x7a16...5428</p>
              </div>
              <div className="p-3 border border-green-700 rounded bg-opacity-20 bg-green-900">
                <h4 className="font-bold mb-2">PrivacyDEX</h4>
                <p className="font-mono text-sm">Identity: ZK-Proof {"{...}"}</p>
              </div>
            </div>
            <p className="mb-4">
              We use ZK-SNARKs to prove fund ownership without revealing wallet addresses:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Generation of cryptographic proof of ownership</li>
              <li>Verification possible without knowing the original address</li>
              <li>Breaking the link between transactions and identities</li>
            </ul>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-bold mb-2">ZK circuit for identity protection:</h3>
              <div className="text-center p-8 border border-dashed border-gray-600 rounded">
                ZK circuit visualization to be implemented
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 3: Amount Hiding</h2>
            <p className="mb-4">
              Our second privacy layer hides the exchanged amounts:
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 border border-red-700 rounded bg-opacity-20 bg-red-900">
                <h4 className="font-bold mb-2">Traditional DEX</h4>
                <p className="font-mono text-sm">Amount: 2.5 BTC ➝ 45.3 ETH</p>
              </div>
              <div className="p-3 border border-green-700 rounded bg-opacity-20 bg-green-900">
                <h4 className="font-bold mb-2">PrivacyDEX</h4>
                <p className="font-mono text-sm">Amount: Confidential [ZK-Proof]</p>
              </div>
            </div>
            <p className="mb-4">
              Benefits of amount hiding:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Protection against financial flow analysis</li>
              <li>Preservation of trading strategies</li>
              <li>Assets confidentiality</li>
              <li>Cryptographic proof that amounts respect the rules</li>
            </ul>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-bold mb-2">How it works</h3>
              <p className="mb-2">The system uses cryptographic commitments:</p>
              <div className="font-mono text-sm bg-gray-800 p-3 rounded overflow-x-auto mb-4">
                <p>Commitment = Hash(amount || random_salt)</p>
                <p>ZK-Proof verifies: "I know an amount that, hashed with this salt, yields this commitment"</p>
              </div>
              <p>Amounts are thus hidden while proving their validity.</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 4: History Privacy</h2>
            <p className="mb-4">
              Our third layer breaks links between transactions:
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 border border-red-700 rounded bg-opacity-20 bg-red-900">
                <h4 className="font-bold mb-2">Traditional DEX</h4>
                <p className="font-mono text-sm">History: All tx are linked to the address</p>
              </div>
              <div className="p-3 border border-green-700 rounded bg-opacity-20 bg-green-900">
                <h4 className="font-bold mb-2">PrivacyDEX</h4>
                <p className="font-mono text-sm">History: Uncorrelatable transactions</p>
              </div>
            </div>
            <p className="mb-4">
              To ensure history privacy, we implement:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>A system inspired by Zcash's "Shielded Pools"</li>
              <li>Single-use addresses for each transaction</li>
              <li>Cryptographic transaction mixing</li>
            </ul>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Benefits for users:</h3>
              <p className="mb-2">An observer cannot:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Link multiple transactions to the same user</li>
                <li>Deduce trading habits or strategies</li>
                <li>Establish a financial profile of users</li>
              </ul>
              <div className="text-center p-6 border border-dashed border-gray-600 rounded">
                Transaction anonymity visualization to be implemented
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 5: Anti-MEV Protection</h2>
            <p className="mb-4">
              Our final layer protects against miner extractable value (MEV):
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 border border-red-700 rounded bg-opacity-20 bg-red-900">
                <h4 className="font-bold mb-2">Traditional DEX</h4>
                <p className="font-mono text-sm">MEV: Vulnerable to front-running, sandwich attacks</p>
              </div>
              <div className="p-3 border border-green-700 rounded bg-opacity-20 bg-green-900">
                <h4 className="font-bold mb-2">PrivacyDEX</h4>
                <p className="font-mono text-sm">MEV: Protected by commit-reveal + random timing</p>
              </div>
            </div>
            <p className="mb-4">
              Our anti-MEV solution works in two phases:
            </p>
            <ol className="list-decimal pl-5 mb-6 space-y-2">
              <li>
                <strong>Commit phase:</strong> User sends an encrypted transaction
                containing their exchange intention
              </li>
              <li>
                <strong>Reveal phase:</strong> After a random delay, the key to decrypt
                the intention is published, revealing transaction details
              </li>
            </ol>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Transaction flow comparison:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-center mb-2">Without protection</h4>
                  <div className="space-y-2 text-sm">
                    <p className="bg-gray-800 p-2 rounded">1. User sends tx</p>
                    <p className="bg-gray-800 p-2 rounded">2. MEV bot sees intention</p>
                    <p className="bg-red-900 bg-opacity-40 p-2 rounded">3. Front-running</p>
                    <p className="bg-gray-800 p-2 rounded">4. User tx executed at a loss</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-center mb-2">With our protection</h4>
                  <div className="space-y-2 text-sm">
                    <p className="bg-gray-800 p-2 rounded">1. User sends encrypted tx</p>
                    <p className="bg-gray-800 p-2 rounded">2. MEV bot cannot read intention</p>
                    <p className="bg-green-900 bg-opacity-40 p-2 rounded">3. Random delay</p>
                    <p className="bg-gray-800 p-2 rounded">4. User tx executed fairly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Content not available</div>;
    }
  };

  const privacyState = getPrivacyState();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Hackathon Judge Demo</h1>
      
      <div className="mb-8">
        <PrivacyDashboard 
          identityProtected={privacyState.identityProtected}
          amountsHidden={privacyState.amountsHidden}
          historyPrivate={privacyState.historyPrivate}
          mevProtected={privacyState.mevProtected}
        />
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Progressive Privacy Building</h2>
          <div className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        {getStepContent()}
        
        <div className="flex justify-between mt-8">
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            Previous Step
          </button>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNextStep}
            disabled={currentStep === totalSteps}
          >
            Next Step
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Presentation Notes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Complete demo: 5-7 minutes</li>
          <li>Emphasize privacy innovation</li>
          <li>Show ZK circuit code</li>
          <li>Explain cross-chain mechanism</li>
          <li>Highlight intuitive UX despite technical complexity</li>
        </ul>
      </div>
    </div>
  );
};

export default JudgeDemoPage;