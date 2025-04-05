import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';

import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';

import { clusterApiUrl } from '@solana/web3.js';

import { AuthProvider } from './Context/AuthContext';

import './index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

// Use Helius RPC for better performance and reliability
const HELIUS_RPC_URL = 'https://devnet.helius-rpc.com/?api-key=0546db15-e030-4ca1-b1b3-18b5578c953c';
const network = 'devnet';
const endpoint = HELIUS_RPC_URL || clusterApiUrl(network);

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new TorusWalletAdapter()
];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>
);