import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SwapPage from './pages/SwapPage';
import PrivacyLearnPage from './pages/PrivacyLearnPage';
import JudgeDemoPage from './pages/JudgeDemoPage';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/swap" element={<SwapPage />} />
          <Route path="/learn" element={<PrivacyLearnPage />} />
          <Route path="/demo" element={<JudgeDemoPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;