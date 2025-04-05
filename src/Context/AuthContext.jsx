import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';

// Define Helius RPC URL (Consistent with App.jsx and solana-utils.js)
const HELIUS_RPC_URL = 'https://devnet.helius-rpc.com/?api-key=0546db15-e030-4ca1-b1b3-18b5578c953c';
// Or use environment variable if properly configured in Vite (import.meta.env)
// const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || HELIUS_RPC_URL;
const SOLANA_RPC_URL = HELIUS_RPC_URL; // Use Helius URL directly for now

// Create a context with default values
const AuthContext = createContext({
  userAddress: null,
  userBalance: null,
  isConnected: false,
  isConnecting: false,
  connectionStatus: { status: 'idle', error: null },
  disconnectWallet: () => {},
});

export function AuthProvider({ children }) {
  const {
    publicKey,
    connected,
    connecting,
    disconnect
  } = useWallet();

  const [userAddress, setUserAddress] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({
    status: 'idle',
    error: null
  });

  // Fetch wallet balance using consistent RPC URL
  const fetchBalance = async (pk) => { // Use 'pk' to avoid shadowing outer 'publicKey'
    if (!pk) return null; // Add check if publicKey might be null
    try {
      // Use the defined RPC URL
      const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
      const balance = await connection.getBalance(pk);
      return balance / 1_000_000_000; // Convert lamports to SOL
    } catch (error) {
      console.error('Balance fetch error:', error);
      // Set error state specific to balance fetching if desired
      // setConnectionStatus(prev => ({ ...prev, error: 'Failed to fetch balance' }));
      return null;
    }
  };

  // Verify connection with backend
  const verifyConnection = async (address) => {
     try {
       setConnectionStatus({ status: 'connecting', error: null });
       // Use import.meta.env for Vite environment variables
       const apiUrl = import.meta.env.VITE_API_URL || '/api';
       const response = await axios.post(
         `${apiUrl}/connect/verify`,
         { publicKey: address }
       );
       if (response.data?.success) {
         setConnectionStatus({ status: 'connected', error: null });
         return response.data.data.balance; // Assuming backend returns balance
       } else {
         throw new Error(response.data?.message || 'Verification failed');
       }
     } catch (error) {
       console.error('Wallet verification error:', error);
       setConnectionStatus({
         status: 'error',
         error: error.message || 'Failed to verify wallet connection'
       });
       return null;
     }
  };

  // Main connection effect
  useEffect(() => {
    const handleConnection = async () => {
      if (!connected || !publicKey) {
        setUserAddress(null);
        setUserBalance(null);
        // Don't reset connectionStatus here if an error occurred previously
        // Only reset to idle if truly disconnected without error
        if (connectionStatus.status !== 'error') {
             setConnectionStatus({ status: 'idle', error: null });
        }
        return;
      }

      try {
        const address = publicKey.toString();
        setUserAddress(address);

        const localBalance = await fetchBalance(publicKey);
        setUserBalance(localBalance); // Set balance initially

        // Verify with backend only after successful connection and balance fetch
        if (localBalance !== null) {
            const verifiedBalance = await verifyConnection(address);
            if (verifiedBalance !== null) {
               console.log("Backend verification successful.");
               // Optionally update balance if backend is source of truth
               // setUserBalance(verifiedBalance);
            } else {
                console.warn("Backend verification failed, using locally fetched balance.");
                // Keep existing status ('connected' if verification request succeeded but logic failed)
                // Or update status based on verifyConnection's internal state setting
            }
        } else {
             // Handle case where initial balance fetch failed
              setConnectionStatus({ status: 'error', error: 'Failed to fetch initial balance' });
        }

      } catch (error) {
        // Catch errors from toString(), fetchBalance(), verifyConnection()
        console.error('Connection handling error:', error);
        setConnectionStatus({
          status: 'error',
          error: error.message || 'Failed to establish connection'
        });
        // Clear user data on error
         setUserAddress(null);
         setUserBalance(null);
      }
    };

    handleConnection();
  }, [publicKey, connected]); // Dependencies are correct

  // Disconnect wallet
  const disconnectWallet = () => {
      if (disconnect) {
       disconnect().catch(err => console.error("Error during disconnect:", err)); // Add catch block
     }
     // Reset state immediately on user action
     setUserAddress(null);
     setUserBalance(null);
     setConnectionStatus({ status: 'idle', error: null });
  };

  // Prepare context value
  const value = {
    userAddress,
    userBalance,
    // isConnected should reflect the adapter's state primarily
    isConnected: connected && !!publicKey, // Check adapter status directly
    isConnecting: connecting,
    connectionStatus, // Provide status for UI feedback
    disconnectWallet,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
     throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
}