import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletConnectButton from './WalletConnectButton';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-700' : '';
  };
  
  return (
    <div className={`sidebar ${collapsed ? 'w-20' : 'w-64'} bg-gray-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="font-pixel text-xl">METARAMA</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="flex-1 mt-8">
        <ul className="space-y-2 px-2">
          <li>
            <Link 
              to="/tokens" 
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 ${isActive('/tokens')}`}
            >
              <span className="material-icons mr-3">token</span>
              {!collapsed && <span>My Tokens</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/new" 
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 ${isActive('/new')}`}
            >
              <span className="material-icons mr-3">new_releases</span>
              {!collapsed && <span>New Tokens</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/create" 
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 ${isActive('/create')}`}
            >
              <span className="material-icons mr-3">add_circle</span>
              {!collapsed && <span>Create Token</span>}
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default Sidebar; 