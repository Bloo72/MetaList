import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnectButton from './WalletConnectButton';

const Sidebar = ({ onRouteChange, routeColors }) => {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || '';
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : '';

  const NavItem = ({ to, color, children, channelNumber }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `
        relative flex items-center px-4 py-3 text-gray-300 hover:text-white group
        ${isActive ? 'bg-gray-800/50 text-white' : ''}
      `}
      onClick={() => onRouteChange(color)}
    >
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 ${color} transition-colors duration-300 group-hover:w-2`} />
      <div className="ml-4 flex-1">
        <div className="font-retro text-xs">{children}</div>
        <div className="text-[10px] text-gray-500 mt-1 font-retro">CH-{channelNumber.toString().padStart(2, '0')}</div>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-green-500/50 animate-pulse mr-2"></div>
    </NavLink>
  );

  return (
    <div className="h-full bg-black border-r border-gray-800 flex flex-col relative overflow-hidden">
      {/* Scan line animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-40 bg-gradient-to-b from-white/[0.02] to-transparent animate-scan"></div>
      </div>

      <div className="p-4 border-b border-gray-800 relative">
        <h1 className="text-2xl font-retro text-white tracking-widest leading-relaxed glow-text">
          META<br />RAMA
        </h1>
      </div>

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

        {walletAddress && (
          <div className="px-4 py-3 mt-4 border-t border-gray-800">
            <div className="font-retro text-xs text-gray-500">CONNECTED</div>
            <div className="font-retro text-xs text-gray-300 mt-1">{shortAddress}</div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default Sidebar; 