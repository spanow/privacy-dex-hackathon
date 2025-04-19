import React, { useState } from 'react';
import ZKCircuitVisualizer from '../components/ZKVisualization/ZKCircuitVisualizer';
import ZKProofDemo from '../components/ZKVisualization/ZKProofDemo';
import AtomicSwapVisualizer from '../components/AtomicSwap/AtomicSwapVisualizer';

const PrivacyLearnPage = () => {
  const [activeTab, setActiveTab] = useState('zkp');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Privacy Technologies</h1>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'zkp' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('zkp')}
          >
            Zero-Knowledge Proofs
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'atomic' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('atomic')}
          >
            Atomic Swaps
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'mev' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('mev')}
          >
            Anti-MEV Protection
          </button>
        </div>
      </div>
      
      {activeTab === 'zkp' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Zero-Knowledge Proofs (ZKP)</h2>
            
            <p className="mb-4">
              Zero-Knowledge Proofs are cryptographic methods that allow one party (the prover)
              to prove to another party (the verifier) that a statement is true, without revealing
              any information beyond the validity of the statement itself.
            </p>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">In our DEX</h3>
              <p>
                We use ZKPs to prove:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>That you own the funds you want to exchange, without revealing your identity</li>
                <li>That the amounts match the agreed rates, without revealing them publicly</li>
                <li>That the contract conditions are met, without exposing the details</li>
              </ul>
            </div>
          </div>
          
          <ZKProofDemo />
          
          <ZKCircuitVisualizer />
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-3">Technical Implementation</h3>
            <p className="mb-4">Our privacy-preserving DEX uses circom and snarkjs to implement Zero-Knowledge proofs:</p>
            
            <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm overflow-auto max-h-64">
              <pre className="text-gray-300">
{`// Example of how we integrate ZK proofs with Ethereum

// 1. User generates proof off-chain
const { proof, publicSignals } = await snarkjs.groth16.fullProve(
  { amount: 2.5, salt: "0x123..." },  // private inputs
  "amount-privacy.wasm",              // compiled circuit
  "amount-privacy.zkey"               // proving key
);

// 2. Prepare proof for the smart contract
const proofForContract = [
  [proof.pi_a[0], proof.pi_a[1]],
  [
    [proof.pi_b[0][0], proof.pi_b[0][1]],
    [proof.pi_b[1][0], proof.pi_b[1][1]]
  ],
  [proof.pi_c[0], proof.pi_c[1]]
];

// 3. Call the smart contract with the proof
const result = await privacyHTLC.createSwap(
  recipient,
  hashlock,
  timelock,
  publicSignals[0], // commitment
  proofForContract,
  { value: ethers.utils.parseEther("45.3") }
);`}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'atomic' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Atomic Swaps</h2>
            
            <p className="mb-4">
              Atomic swaps allow for exchanging cryptocurrencies across different blockchains
              without the need for a trusted third party. The exchange either completes entirely
              or not at all, ensuring that no party can be cheated.
            </p>
            
            <div className="mt-6 mb-8">
              <h3 className="text-xl font-bold mb-3">How it Works</h3>
              <p>
                Our DEX uses Hashed Timelock Contracts (HTLCs) to coordinate exchanges
                between Bitcoin and Ethereum. Here are the key steps:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Alice wants to exchange BTC for ETH with Bob</li>
                <li>A cryptographic secret is generated</li>
                <li>Timelock contracts are created on both blockchains</li>
                <li>Funds are locked in these contracts</li>
                <li>When the secret is revealed, both parties can claim their funds</li>
                <li>If the exchange doesn't happen within the timeframe, funds are returned</li>
              </ol>
            </div>
          </div>
          
          <AtomicSwapVisualizer />
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-3">Smart Contract Implementation</h3>
            <p className="mb-4">
              Our Ethereum HTLC smart contract uses the following key functions:
            </p>
            
            <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm overflow-auto max-h-64">
              <pre className="text-gray-300">
{`// Key functions in our Ethereum HTLC contract

// Function to create a new swap
function createSwap(
    address _participant,
    bytes32 _hashlock,
    uint256 _timelock,
    bytes32 _commitment,
    bytes calldata _zkProof
) external payable returns (bytes32 swapId);

// Function to claim funds by revealing the secret
function withdraw(
    bytes32 _swapId,
    bytes32 _preimage,
    bytes calldata _zkProof
) external;

// Function to refund after timelock expiry
function refund(bytes32 _swapId) external;

// The Bitcoin script uses a similar structure with:
// 1. OP_HASH256 to verify the preimage hash
// 2. OP_CHECKSEQUENCEVERIFY for timelock
// 3. OP_CHECKSIG to verify signatures`}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'mev' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Anti-MEV Protection</h2>
            
            <p className="mb-4">
              Miner Extractable Value (MEV) is the value that miners/validators can
              extract by manipulating the order of transactions. This can lead to front-running,
              sandwich attacks, and other manipulations harmful to users.
            </p>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">Our Solution</h3>
              <p>
                Our DEX integrates several mechanisms to protect against MEV:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  <strong>Commit-reveal:</strong> Swap intentions are first submitted in 
                  encrypted form, then revealed after a random delay
                </li>
                <li>
                  <strong>Encrypted Mempool:</strong> Simulation of an encrypted mempool where
                  transaction details are not visible before confirmation
                </li>
                <li>
                  <strong>Randomized delays:</strong> Introduction of unpredictability in transaction timing
                </li>
              </ul>
            </div>
            
            <div className="mt-8 bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Comparison</h3>
              <div className="border border-gray-700 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-red-700 rounded bg-opacity-20 bg-red-900">
                    <h4 className="font-bold mb-2">Without Protection</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Transactions visible in mempool</li>
                      <li>Vulnerable to front-running</li>
                      <li>Possible sandwich attacks</li>
                      <li>Potential user losses</li>
                    </ul>
                  </div>
                  <div className="p-3 border border-green-700 rounded bg-opacity-20 bg-green-900">
                    <h4 className="font-bold mb-2">With our Protection</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Masked swap intentions</li>
                      <li>Unpredictable timing</li>
                      <li>Cryptographically protected details</li>
                      <li>Guaranteed fair transaction</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3">Implementation</h3>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm overflow-auto max-h-64">
                <pre className="text-gray-300">
{`// Anti-MEV Implementation

// 1. Commit Phase
// User submits encrypted swap intention
async function commitSwapIntention(swapDetails) {
  // Generate a random key
  const randomKey = crypto.randomBytes(32);
  
  // Encrypt the swap details
  const encrypted = encrypt(swapDetails, randomKey);
  
  // Create a commitment
  const commitment = keccak256(encrypted);
  
  // Submit the commitment on-chain
  await privacyDEX.commitSwapIntention(commitment);
  
  return { encrypted, randomKey };
}

// 2. Reveal Phase (after random delay)
// User reveals the encrypted data and key
async function revealSwapIntention(encrypted, randomKey) {
  // Apply random delay
  const delay = 5000 + Math.random() * 10000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Reveal the encrypted data and key
  await privacyDEX.revealSwapIntention(encrypted, randomKey);
}

// 3. Contract verifies and executes
function revealSwapIntention(bytes memory _encrypted, bytes32 _key) external {
  // Recalculate commitment to verify
  bytes32 commitment = keccak256(_encrypted);
  require(commitments[msg.sender] == commitment, "Invalid commitment");
  
  // Decrypt and execute
  SwapDetails memory details = decrypt(_encrypted, _key);
  executeSwap(details);
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyLearnPage;