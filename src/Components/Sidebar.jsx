import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletConnectButton from './WalletConnectButton';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-800' : '';
  };
  
  return (
    <div className={`sidebar fixed left-0 top-0 h-screen transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-20' : 'w-60'
    } relative overflow-hidden`}>
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
      
      {/* Sidebar content */}
      <div className="relative z-10">
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!isCollapsed && (
            <h1 className="font-pixel text-xl text-gray-100">METARAMA</h1>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav className="flex-1 mt-8">
          <ul className="space-y-2 px-2">
            <li>
              <Link 
                to="/tokens" 
                className={`flex items-center p-3 rounded-lg hover:bg-gray-800 text-gray-300 ${isActive('/tokens')}`}
              >
                <span className="material-icons mr-3">token</span>
                {!isCollapsed && <span>My Tokens</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/new" 
                className={`flex items-center p-3 rounded-lg hover:bg-gray-800 text-gray-300 ${isActive('/new')}`}
              >
                <span className="material-icons mr-3">new_releases</span>
                {!isCollapsed && <span>New Tokens</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/create" 
                className={`flex items-center p-3 rounded-lg hover:bg-gray-800 text-gray-300 ${isActive('/create')}`}
              >
                <span className="material-icons mr-3">add_circle</span>
                {!isCollapsed && <span>Create Token</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-gray-700">
          <div className={`wallet-container ${isCollapsed ? 'wallet-collapsed' : ''}`}>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 