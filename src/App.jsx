import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CreateToken from './Components/CreateToken';
import NewTokens from './Components/NewTokens';
import TokenList from './Components/TokenList';
import { AuthProvider } from './Context/AuthContext';

function AppContent() {
  return (
    <div className="min-h-screen bg-background-primary">
      <Sidebar />
      <div className="ml-64 p-6">
        <Routes>
          <Route 
            path="/" 
            element={<TokenList />} 
          />
          <Route 
            path="/tokens" 
            element={<TokenList />} 
          />
          <Route 
            path="/create" 
            element={<CreateToken />} 
          />
          <Route 
            path="/new" 
            element={<NewTokens />} 
          />
        </Routes>
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