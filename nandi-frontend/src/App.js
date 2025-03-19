import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Home from './components/Home/Home';
import SoulQuest from './components/SoulQuest/SoulQuest';
import WisdomPets from './components/WisdomPets/WisdomPets';
import DharmaPath from './components/DharmaPath/DharmaPath';
import KarmaCafe from './components/KarmaCafe/KarmaCafe';
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
          <Route path="/soul/*" element={<SoulQuest />} />
          <Route path="/pets/*" element={<WisdomPets />} />
          <Route path="/dharma" element={<DharmaPath />} />
          <Route path="/karma" element={<KarmaCafe />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 