import React from 'react';
import { useLocation } from 'react-router-dom';

const RetroHeader = ({ color = 'bg-gray-800' }) => {
  const location = useLocation();
  const path = location.pathname;
  const title = path === '/' ? 'New Tokens' :
               path === '/create' ? 'Create Token' :
               path === '/tokens' ? 'My Tokens' : 'Channel Not Found';

  return (
    <div className={`w-full ${color} border-b border-gray-800 transition-colors duration-300`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 bg-red-500 animate-pulse rounded-full"></div>
          <span className="font-retro text-red-400 uppercase text-xs">REC</span>
          <span className="font-retro text-gray-400 text-xs">SIGNAL-7X</span>
        </div>
        
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-white font-retro tracking-wider">{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="font-retro text-xs text-gray-400">CH-420</span>
            <div className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="ml-1 font-retro text-green-400 text-xs">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroHeader; 