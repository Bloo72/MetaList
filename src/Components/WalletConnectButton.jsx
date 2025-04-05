// 📁 File: src/components/WalletConnectButton.jsx
import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../Context/AuthContext';

const WalletConnectButton = () => {
  const { publicKey, connected, wallet, disconnect } = useWallet();
  const { userBalance, isConnected, connectionStatus } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.wallet-dropdown')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  
  // Format public key for display
  const formatPublicKey = (key) => {
    if (!key) return '';
    const keyStr = key.toString();
    return `${keyStr.substring(0, 6)}...${keyStr.substring(keyStr.length - 4)}`;
  };
  
  // Custom display for connected wallet
  const ConnectedWallet = () => (
    <div className="wallet-dropdown relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-babyBlue-600 hover:bg-babyBlue-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        {/* Wallet icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8.414l-2-2L16 6h-3.172L12 4H4zm0 2h8v2H8v2h8v6H4V6z" clipRule="evenodd" />
        </svg>
        
        <span className="font-medium">{formatPublicKey(publicKey)}</span>
        
        {/* Dropdown arrow */}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-500">Connected with {wallet?.adapter?.name || 'Wallet'}</p>
            <p className="text-sm font-mono text-gray-700 mt-1">{publicKey?.toString()}</p>
          </div>
          
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Balance</span>
              <span className="font-medium text-babyBlue-700">
                {userBalance !== null ? `${userBalance.toFixed(4)} SOL` : 'Loading...'}
              </span>
            </div>
          </div>
          
          <div className="px-4 py-2">
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="wallet-connect">
      {connected && isConnected ? (
        <ConnectedWallet />
      ) : (
        <WalletMultiButton 
          className="!bg-babyBlue-600 hover:!bg-babyBlue-700 transition-colors"
        />
      )}
      
      {/* Connection status indicator */}
      {connectionStatus.status === 'connecting' && (
        <div className="text-xs text-babyBlue-500 animate-pulse mt-1 text-center">
          Connecting...
        </div>
      )}
      {connectionStatus.status === 'error' && (
        <div className="text-xs text-red-500 mt-1 text-center">
          {connectionStatus.error}
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;