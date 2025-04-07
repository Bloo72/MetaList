import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnectButton from './WalletConnectButton';

const Sidebar = ({ onRouteChange, routeColors, isCollapsed, onToggleCollapse }) => {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || '';
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : '';

  // Vibrant channel colors - no opacity or filters
  const channelColors = {
    '/tokens': 'bg-[#00FF00]',    // Bright Green
    '/create': 'bg-[#FFFF00]',    // Bright Yellow
    '/': 'bg-[#00FFFF]',          // Bright Cyan
    '/watchlist': 'bg-[#00FF66]', // Bright Mint
    '/alerts': 'bg-[#FF00FF]',    // Bright Fuchsia
    '/wallet': 'bg-[#FF0033]',    // Bright Red
    '/settings': 'bg-[#3399FF]',  // Bright Blue
  };

  const NavItem = ({ to, color, children, channelNumber }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `
        relative flex items-center ${isCollapsed ? 'h-12 justify-center' : 'px-4 py-3'} 
        text-gray-300 hover:text-white group
        ${isActive ? 'bg-gray-800/50 text-white' : ''}
        transition-all duration-300
      `}
      onClick={() => onRouteChange(color)}
    >
      {!isCollapsed && (
        <>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 ${channelColors[to] || 'bg-gray-500'}`} />
          <div className="ml-4 flex-1">
            <div className="font-retro text-xs">{children}</div>
            <div className="text-[10px] text-gray-500 mt-1 font-retro">CH-{channelNumber.toString().padStart(2, '0')}</div>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
        </>
      )}
    </NavLink>
  );

  return (
    <div className={`h-full bg-black border-r border-gray-800 flex flex-col relative overflow-visible transition-all duration-300 ${isCollapsed ? 'w-8' : 'w-56'}`}>
      {/* Scan line animation - only show when expanded */}
      {!isCollapsed && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-40 bg-gradient-to-b from-white/[0.02] to-transparent animate-scan"></div>
        </div>
      )}

      {/* Header - only show when expanded */}
      {!isCollapsed && (
        <div className="px-3 pt-4 pb-2 border-b border-gray-800 relative">
          <h1 className="text-white text-2xl font-bold tracking-widest font-retro text-center whitespace-nowrap">METARAMA</h1>
        </div>
      )}

      {/* Navigation - only show when expanded */}
      {!isCollapsed && (
        <nav className="flex-1 py-4 space-y-1">
          <NavItem to="/tokens" color={routeColors['/tokens']} channelNumber={1}>
            My Tokens
          </NavItem>
          
          <NavItem to="/create" color={routeColors['/create']} channelNumber={2}>
            Create Token
          </NavItem>
          
          <NavItem to="/" color={routeColors['/']} channelNumber={3}>
            New Tokens
          </NavItem>

          <NavItem to="/watchlist" color={routeColors['/watchlist']} channelNumber={4}>
            Watchlist
          </NavItem>

          <NavItem to="/alerts" color={routeColors['/alerts']} channelNumber={5}>
            Alerts
          </NavItem>

          <NavItem to="/wallet" color={routeColors['/wallet']} channelNumber={6}>
            Wallet
          </NavItem>

          <NavItem to="/settings" color={routeColors['/settings']} channelNumber={7}>
            Settings
          </NavItem>
        </nav>
      )}

      {/* Wallet section - only show when expanded */}
      {!isCollapsed && (
        <>
          {walletAddress && (
            <div className="px-4 py-3 border-t border-gray-800">
              <div className="font-retro text-xs text-gray-500">CONNECTED</div>
              <div className="font-retro text-xs text-gray-300 mt-1">{shortAddress}</div>
            </div>
          )}
          <div className="p-4 border-t border-gray-800">
            <WalletConnectButton />
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar; 