import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import CreateToken from './Components/CreateToken';
import NewTokens from './Components/NewTokens';
import TokenList from './Components/TokenList';
import RetroHeader from './Components/RetroHeader';
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

// Color mapping for routes - TV signal colors
const routeColors = {
  '/tokens': 'bg-[#d3d3d3]',    // Gray - CH-01
  '/create': 'bg-[#ffeb3b]',    // Yellow - CH-02
  '/': 'bg-[#00e5ff]',          // Cyan - CH-03
  '/watchlist': 'bg-[#00e676]', // Green - CH-04
  '/alerts': 'bg-[#d500f9]',    // Magenta - CH-05
  '/wallet': 'bg-[#ff1744]',    // Red - CH-06
  '/settings': 'bg-[#2979ff]',  // Blue - CH-07
  'default': 'bg-[#d3d3d3]'     // Default to gray
};

function AppContent() {
  const [headerColor, setHeaderColor] = useState(routeColors['/']);
  const location = useLocation();

  useEffect(() => {
    addRandomGlitches();
  }, []);

  useEffect(() => {
    // Add a quick flicker effect when changing routes
    const newColor = routeColors[location.pathname] || routeColors.default;
    setHeaderColor('bg-black'); // Brief blackout
    setTimeout(() => setHeaderColor(newColor), 50); // Quick flicker to new color
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="fixed top-0 left-0 h-screen w-60 z-50">
        <Sidebar onRouteChange={setHeaderColor} routeColors={routeColors} />
      </aside>

      <div className="ml-60 flex flex-col w-[calc(100%-15rem)]">
        <RetroHeader color={headerColor} />
        <div className="px-4 py-6">
          <Routes>
            <Route path="/" element={<NewTokens />} />
            <Route path="/tokens" element={<TokenList />} />
            <Route path="/create" element={<CreateToken />} />
            <Route path="/watchlist" element={<div>Coming Soon</div>} />
            <Route path="/alerts" element={<div>Coming Soon</div>} />
            <Route path="/wallet" element={<div>Coming Soon</div>} />
            <Route path="/settings" element={<div>Coming Soon</div>} />
          </Routes>
        </div>
      </div>
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