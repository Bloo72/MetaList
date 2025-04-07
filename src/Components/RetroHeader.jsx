import React from 'react';
import { useLocation } from 'react-router-dom';

const RetroHeader = ({ color = '#00FFFF', isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const path = location.pathname;
  const title = path === '/' ? 'New Tokens' :
                path === '/create' ? 'Create Token' :
                path === '/tokens' ? 'My Tokens' : 'Channel Not Found';
  
  const channelNumber = path === '/' ? '03' : 
                       path === '/create' ? '02' :
                       path === '/tokens' ? '01' :
                       path === '/watchlist' ? '04' :
                       path === '/alerts' ? '05' :
                       path === '/wallet' ? '06' :
                       path === '/settings' ? '07' : '--';

  // Channel colors mapping - vibrant retro TV colors
  const channelColors = {
    '01': '#00FF00', // Bright Green
    '02': '#FFFF00', // Bright Yellow
    '03': '#00FFFF', // Bright Cyan
    '04': '#00FF66', // Bright Mint
    '05': '#FF00FF', // Bright Fuchsia
    '06': '#FF0033', // Bright Red
    '07': '#3399FF', // Bright Blue
  };

  // Get the current channel color
  const currentChannelColor = channelColors[channelNumber] || '#00FFFF';

  return (
    <div 
      className="w-full border-b border-gray-800 transition-colors duration-500" 
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onToggleCollapse} 
            className="mr-2 text-white hover:scale-110 transition-transform"
          >
            {isCollapsed ? '→' : '←'}
          </button>
          <div className="h-4 w-4 bg-red-500 animate-pulse rounded-full"></div>
          <span className="font-retro text-red-400 uppercase text-xs">REC</span>
          <span className="font-retro text-gray-400 text-xs">SIGNAL-7X</span>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-white font-retro tracking-wider">{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="font-retro text-xs text-gray-400">CH-{channelNumber}</span>
            <div className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="ml-1 font-retro text-green-400 text-xs">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroHeader; 