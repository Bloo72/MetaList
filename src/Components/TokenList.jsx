// 📁 File: src/components/TokenList.jsx
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../Context/AuthContext';
import { getSolanaConnection, enrichTokenData } from '../utils/solana-utils';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { formatDistanceToNow } from 'date-fns';

const TokenList = ({ tokens }) => {
  const { publicKey, connected } = useWallet();
  const { isConnected } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  useEffect(() => {
    const fetchTokens = async () => {
      if (!isConnected || !publicKey) {
        setTokens([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get connection
        const connection = getSolanaConnection();

        // Fetch token accounts owned by user
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        // Process token accounts
        const tokenList = tokenAccounts.value
          .map(item => {
            const accountData = item.account.data.parsed.info;
            return {
              mint: accountData.mint,
              balance: accountData.tokenAmount.uiAmount,
              decimals: accountData.tokenAmount.decimals,
              updatedAt: new Date().toLocaleTimeString(),
            };
          })
          .filter(token => token.balance > 0);

        // Enrich with additional token data
        const enrichedTokens = tokenList.map(token => enrichTokenData(token));
        
        // If no tokens found, add a dummy token for demonstration
        if (enrichedTokens.length === 0) {
          enrichedTokens.push({
            name: 'BONK',
            symbol: 'BONK',
            mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
            balance: 1000000,
            updatedAt: new Date().toLocaleTimeString(),
            price: 0.0000021,
            logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.svg'
          });
        }
        
        setTokens(enrichedTokens);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to load tokens. Please try again later.');
        setIsLoading(false);
        
        // Set dummy token on error for demonstration
        setTokens([
          {
            name: 'BONK',
            symbol: 'BONK',
            mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
            balance: 1000000,
            updatedAt: new Date().toLocaleTimeString(),
            price: 0.0000021,
            logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.svg'
          }
        ]);
      }
    };

    fetchTokens();
  }, [publicKey, isConnected]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredTokens = tokens.filter(token => {
    const searchTerm = searchInput.toLowerCase();
    return (
      token.name?.toLowerCase().includes(searchTerm) ||
      token.symbol?.toLowerCase().includes(searchTerm) ||
      token.mint.toLowerCase().includes(searchTerm)
    );
  });

  if (!isConnected) {
    return (
      <main className="bg-blue-50 min-h-screen pt-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md px-8 py-6 min-h-[70vh] flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-babyBlue-600 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">Connect your wallet to see your tokens</p>
          </div>
        </div>
      </main>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tokens found
      </div>
    );
  }

  return (
    <main className="bg-blue-50 min-h-screen pt-6">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md px-8 py-6 min-h-[70vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-babyBlue-600">
              Your Token Portfolio
            </h2>
            <div className="flex gap-3">
              <button className="bg-babyBlue-500 hover:bg-babyBlue-600 text-white text-sm px-4 py-2 rounded">
                Track New Token
              </button>
              <button className="bg-babyBlue-500 hover:bg-babyBlue-600 text-white text-sm px-4 py-2 rounded">
                Create Token
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, symbol, or mint address..."
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-babyBlue-400"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-babyBlue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 text-babyBlue-500 hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Token
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Mint Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {filteredTokens.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-text-secondary">
                        {searchInput 
                          ? "No tokens match your search criteria." 
                          : "No tokens found in your wallet."}
                      </td>
                    </tr>
                  ) : (
                    filteredTokens.map((token) => (
                      <tr key={token.mint} className="hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-gray-300 font-bold">
                                {token.name ? token.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {token.name || 'Unknown Token'}
                              </div>
                              <div className="text-sm text-gray-400">
                                {token.symbol || 'No Symbol'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300 font-mono">
                            {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {formatTimestamp(token.updatedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a
                            href={`https://solscan.io/token/${token.mint}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View on Solscan
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TokenList;