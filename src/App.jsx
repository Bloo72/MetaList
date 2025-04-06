import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CreateToken from './Components/CreateToken';
import NewTokens from './Components/NewTokens';
import TokenList from './Components/TokenList';
import { AuthProvider } from './Context/AuthContext';

function addRandomGlitches() {
  // Add occasional tracking line glitches
  setInterval(() => {
    if (Math.random() > 0.97) { // Very rare
      const rows = document.querySelectorAll('tr');
      if (rows.length > 0) {
        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        randomRow.classList.add('tracking-glitch');
        setTimeout(() => randomRow.classList.remove('tracking-glitch'), 200);
      }
    }
  }, 3000);
}

function AppContent() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    addRandomGlitches();
  }, []);

  return (
    <div className="flex min-h-screen bg-black overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`flex-1 transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-60'
      }`}>
        <Routes>
          <Route path="/" element={<NewTokens />} />
          <Route path="/tokens" element={<TokenList />} />
          <Route path="/create" element={<CreateToken />} />
          <Route path="/new" element={<NewTokens />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;