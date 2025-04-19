import React, { useState, useEffect } from 'react';

const ZKCircuitVisualizer = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000); // milliseconds
  
  const totalSteps = 5;
  
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
  
  // Render different visualization steps
  const renderVisualization = () => {
    switch (step) {
      case 0:
        return renderSetup();
      case 1:
        return renderCommitment();
      case 2:
        return renderCircuit();
      case 3:
        return renderProofGeneration();
      case 4:
        return renderVerification();
      default:
        return null;
    }
  };
  
  const renderSetup = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Step 1: Setup</h3>
      <p>In this step, we prepare the private data for our ZK proof:</p>
      
      <div className="bg-gray-700 p-4 rounded-md">
        <div className="mb-4">
          <span className="font-mono text-green-400">// Private inputs (only known to the user)</span>
          <div className="flex items-center space-x-4 mt-2">
            <div className="font-mono bg-green-900 bg-opacity-50 p-2 rounded">
              amount = 2.5 BTC
            </div>
            <div className="font-mono bg-green-900 bg-opacity-50 p-2 rounded">
              salt = "r4nd0m8yt3s..."
            </div>
          </div>
        </div>
        
        <div>
          <span className="font-mono text-blue-400">// Public parameters (known to everyone)</span>
          <div className="flex items-center space-x-4 mt-2">
            <div className="font-mono bg-blue-900 bg-opacity-50 p-2 rounded">
              exchangeRate = 18.12 ETH/BTC
            </div>
            <div className="font-mono bg-blue-900 bg-opacity-50 p-2 rounded">
              maxAmount = 10 BTC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderCommitment = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Step 2: Commitment</h3>
      <p>The user generates a cryptographic commitment to hide the amount:</p>
      
      <div className="flex items-center justify-center my-8">
        <div className="flex items-center space-x-2 font-mono">
          <div className="bg-green-900 bg-opacity-50 p-2 rounded">amount = 2.5 BTC</div>
          <span>+</span>
          <div className="bg-green-900 bg-opacity-50 p-2 rounded">salt = "r4nd0m8yt3s..."</div>
          <span>→</span>
          <div className="bg-indigo-600 p-2 rounded">Poseidon Hash</div>
          <span>→</span>
          <div className="bg-yellow-700 bg-opacity-50 p-2 rounded break-all max-w-xs">
            commitment = "0x7a41..."
          </div>
        </div>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-md">
        <p className="font-mono">
          <span className="text-purple-400">// The commitment is the only part shared publicly</span><br/>
          <span className="text-green-400">// Neither the amount nor the salt is revealed</span>
        </p>
      </div>
    </div>
  );
  
  const renderCircuit = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Step 3: ZK Circuit</h3>
      <p>The ZK circuit defines what we want to prove without revealing:</p>
      
      <div className="bg-gray-700 p-4 rounded-md font-mono text-sm overflow-auto max-h-64">
        <pre className="text-gray-300">
{`template AmountPrivacy() {
    // Public inputs
    signal input commitment;
    signal input exchangeRate;
    signal input maxAmount;
    
    // Private inputs
    signal input amount;
    signal input salt;
    
    // Ensure amount is positive and within limits
    component rangeCheck = LessThan(64);
    rangeCheck.in[0] <== amount;
    rangeCheck.in[1] <== maxAmount;
    rangeCheck.out === 1;
    
    // Compute the commitment hash
    component hasher = Poseidon(2);
    hasher.inputs[0] <== amount;
    hasher.inputs[1] <== salt;
    
    // Verify the commitment matches
    commitment === hasher.out;
    
    // Calculate expected output amount
    signal exchangedAmount <-- (amount * exchangeRate) \\ 1000;
    exchangedAmount * 1000 === amount * exchangeRate;
}`}
        </pre>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="bg-indigo-600 bg-opacity-30 border border-indigo-500 p-3 rounded-md">
          <p className="text-center text-sm">
            The circuit encodes our <strong>knowledge claim</strong>:<br/>
            "I know an amount and salt that hash to this commitment,<br/>
            and the amount is within valid range."
          </p>
        </div>
      </div>
    </div>
  );
  
  const renderProofGeneration = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Step 4: Proof Generation</h3>
      <p>The circuit is compiled into a cryptographic proof:</p>
      
      <div className="flex flex-col items-center space-y-6 my-8">
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="bg-gray-700 p-4 rounded-md">
            <h4 className="font-bold mb-2 text-green-400">Private Inputs</h4>
            <ul className="space-y-2 font-mono">
              <li>amount = 2.5 BTC</li>
              <li>salt = "r4nd0m8yt3s..."</li>
            </ul>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md">
            <h4 className="font-bold mb-2 text-blue-400">Public Inputs</h4>
            <ul className="space-y-2 font-mono">
              <li>commitment = "0x7a41..."</li>
              <li>exchangeRate = 18120</li>
              <li>maxAmount = 10000000000</li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 flex items-center justify-center bg-indigo-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-md w-full">
          <h4 className="font-bold mb-2 text-yellow-400">Generated Proof</h4>
          <div className="font-mono text-xs break-all">
            {"{ proof: { pi_a: [\"123...\", \"456...\"], pi_b: [[\"789...\", \"012...\"], [\"345...\", \"678...\"]], pi_c: [\"901...\", \"234...\"] }, publicSignals: [\"0x7a41...\", \"18120\", \"10000000000\"] }"}
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-600 bg-opacity-30 border border-indigo-500 p-3 rounded-md">
        <p className="text-center text-sm">
          The proof contains cryptographic elements that can verify our claims<br/>
          <strong>without revealing</strong> the private amount or salt.
        </p>
      </div>
    </div>
  );
  
  const renderVerification = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Step 5: Verification</h3>
      <p>Anyone can verify the proof without learning the private inputs:</p>
      
      <div className="flex flex-col items-center space-y-6 my-8">
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="bg-gray-700 p-4 rounded-md">
            <h4 className="font-bold mb-2 text-yellow-400">ZK Proof</h4>
            <div className="font-mono text-xs break-all">
              {"{ proof: { pi_a: [...], pi_b: [[...]], pi_c: [...] }, publicSignals: [...] }"}
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md">
            <h4 className="font-bold mb-2 text-blue-400">Verification Key</h4>
            <div className="font-mono text-xs break-all">
              {"{ vk_alpha_1: [...], vk_beta_2: [...], vk_gamma_2: [...], vk_delta_2: [...], IC: [...] }"}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 flex items-center justify-center bg-indigo-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <div className="bg-green-700 bg-opacity-40 p-4 rounded-md w-full">
          <h4 className="font-bold mb-2 text-green-400">Verification Result</h4>
          <div className="font-mono text-center">
            {"{ verified: true }"}
          </div>
          <p className="mt-4 text-center">
            ✅ Amount is within valid range<br/>
            ✅ Commitment matches the private inputs<br/>
            ✅ Exchange rate calculation is correct
          </p>
        </div>
      </div>
      
      <div className="bg-indigo-600 bg-opacity-30 border border-indigo-500 p-3 rounded-md">
        <p className="text-center text-sm">
          The HTLC contract can verify this proof on-chain,<br/>
          ensuring the transaction is valid without revealing sensitive details.
        </p>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Zero-Knowledge Proof Visualization</h2>
      
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="min-h-[400px] bg-gray-900 rounded-lg p-6 mb-6">
        {renderVisualization()}
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

export default ZKCircuitVisualizer;