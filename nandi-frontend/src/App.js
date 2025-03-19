import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Home from './components/Home/Home';
import KarmaCafe from './components/KarmaCafe/KarmaCafe';
import SoulQuest from './components/SoulQuest/SoulQuest';
import WisdomPets from './components/WisdomPets/WisdomPets';
import Navbar from './components/Layout/Navbar';
import { logEnvConfig } from './utils/envConfig';

// Log environment configuration in development mode
if (process.env.NODE_ENV === 'development') {
  logEnvConfig();
}

function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/karma" element={<KarmaCafe />} />
          <Route path="/karma/:avatarId" element={<KarmaCafe />} />
          <Route path="/soul/*" element={<SoulQuest />} />
          <Route path="/pets/*" element={<WisdomPets />} />
        </Routes>
      </main>

      <Navbar />
    </div>
  );
}

export default App; 