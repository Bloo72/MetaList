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

const AppContent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeColor, setActiveColor] = useState('#00FFFF'); // Default cyan color
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleRouteChange = (color) => {
    setActiveColor(color);
  };

  // Channel colors mapping - vibrant retro TV colors
  const routeColors = {
    '/tokens': '#00FF00', // Bright Green
    '/create': '#FFFF00', // Bright Yellow
    '/': '#00FFFF',       // Bright Cyan
    '/watchlist': '#00FF66', // Bright Mint
    '/alerts': '#FF00FF', // Bright Fuchsia
    '/wallet': '#FF0033', // Bright Red
    '/settings': '#3399FF', // Bright Blue
  };

  useEffect(() => {
    addRandomGlitches();
  }, []);

  useEffect(() => {
    // Update active color when route changes
    const path = location.pathname;
    setActiveColor(routeColors[path] || '#00FFFF');
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar 
        onRouteChange={handleRouteChange} 
        routeColors={routeColors}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <RetroHeader 
          color={activeColor} 
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <main className="flex-1 overflow-auto transition-all duration-300">
          <div className={`w-full h-full transition-all duration-300 ${isCollapsed ? 'pl-0' : 'pl-0'}`}>
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
        </main>
      </div>
    </div>
  );
};

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