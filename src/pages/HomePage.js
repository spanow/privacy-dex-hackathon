import React from 'react';
import { Link } from 'react-router-dom';
import PrivacyDashboard from '../components/PrivacyDashboard/PrivacyDashboard';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          Bitcoin ↔ Ethereum DEX with Privacy
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Exchange cryptocurrencies between Bitcoin and Ethereum with complete privacy
          using Zero-Knowledge Proofs
        </p>
        
        <div className="mb-8">
          <PrivacyDashboard />
        </div>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/swap"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Try Swapping
          </Link>
          <Link 
            to="/learn"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Explore Technology
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <FeatureCard 
          title="Complete Privacy" 
          description="Protection of identity and amounts using Zero-Knowledge Proofs"
          icon="🔒"
        />
        <FeatureCard 
          title="Atomic Swaps" 
          description="Secure cross-chain exchanges without trusted intermediaries"
          icon="⚛️"
        />
        <FeatureCard 
          title="Anti-MEV Protection" 
          description="Prevent your transactions from being exploited by value extractors"
          icon="🛡️"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default HomePage;