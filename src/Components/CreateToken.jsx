// 📁 File: src/components/CreateToken.jsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios'; // Assuming you have axios installed

const CreateToken = ({ goToTokenList }) => {
  // Use useWallet to get publicKey for the creator address
  const { publicKey } = useWallet();
  // Use useAuth to check connection status
  const { isConnected } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: 9,
    initialSupply: 1000000
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // Store mint address on success, not just tx signature if backend returns it
  const [newTokenMint, setNewTokenMint] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      // Ensure numeric fields are stored as numbers
      [name]: (name === 'decimals' || name === 'initialSupply') ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);
    setNewTokenMint('');

    try {
      // Get API URL from environment variables or use default
      const apiUrl = import.meta.env.VITE_API_URL || '/api';

      // --- CHANGED LINE HERE ---
      // Send request to backend, using 'creatorPublicKey' instead of 'owner'
      const response = await axios.post(`${apiUrl}/tokens/create`, {
        creatorPublicKey: publicKey.toString(), // <-- Use correct field name
        ...formData // Include name, symbol, decimals, initialSupply from form state
      });
      // --- END CHANGED LINE ---

      if (!response.data.success) {
        // Throw error with message from backend if available
        throw new Error(response.data.message || 'Failed to create token on backend');
      }

      // Assuming backend confirms creation and returns the new mint address
      console.log("Backend response:", response.data);
      setNewTokenMint(response.data.mint || 'N/A'); // Store the mint address from response
      setSuccess(true);

    } catch (err) {
      console.error('Token creation error:', err);
      // Handle specific Axios error structure if possible
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
        setError(`Error ${err.response.status}: ${err.response.data?.message || err.message}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request:", err.request);
        setError('No response received from server. Is the backend running?');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        setError(err.message || 'Failed to send token creation request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render message if wallet is not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">You need to connect your wallet to create tokens.</p>
            <p>Please connect using the button in the header.</p>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Token</h1>

        {success ? (
          // Success Message Display
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Token Created Successfully!</p>
            <p className="mb-4">Your new token mint address:</p>

            {newTokenMint && newTokenMint !== 'N/A' && (
              <div className="bg-white p-3 rounded border border-green-200 mb-4 break-all">
                <p className="text-sm text-gray-600 mb-1">Mint Address:</p>
                <a
                  href={`https://solscan.io/token/${newTokenMint}?cluster=devnet`} // Use Solscan link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-babyBlue-600 hover:underline text-sm font-mono"
                >
                  {newTokenMint}
                </a>
              </div>
            )}
             {newTokenMint === 'N/A' && (
                 <p className="text-sm text-gray-600 mb-4">Mint address not returned by backend.</p>
             )}

            <button
              onClick={goToTokenList}
              className="mt-2 bg-babyBlue-500 hover:bg-babyBlue-600 text-white px-4 py-2 rounded"
            >
              Back to Token List
            </button>
          </div>
        ) : (
          // Token Creation Form
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              {/* Token Name Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Token Name
                </label>
                <input
                  id="name" name="name" type="text"
                  value={formData.name} onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required placeholder="e.g., My Solana Token"
                />
                <p className="text-gray-600 text-xs mt-1">Give your token a descriptive name</p>
              </div>

              {/* Token Symbol Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symbol">
                  Token Symbol
                </label>
                <input
                  id="symbol" name="symbol" type="text"
                  value={formData.symbol} onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required placeholder="e.g., MST" maxLength={10}
                />
                <p className="text-gray-600 text-xs mt-1">Short symbol for your token (max 10 characters)</p>
              </div>

              {/* Decimals Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="decimals">
                  Decimals
                </label>
                <input
                  id="decimals" name="decimals" type="number"
                  min="0" max="9" step="1"
                  value={formData.decimals} onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                <p className="text-gray-600 text-xs mt-1">Standard is 9 for Solana tokens (maximum divisibility)</p>
              </div>

              {/* Initial Supply Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="initialSupply">
                  Initial Supply
                </label>
                <input
                  id="initialSupply" name="initialSupply" type="number"
                  min="1" step="1"
                  value={formData.initialSupply} onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                <p className="text-gray-600 text-xs mt-1">Total number of tokens to create initially</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToTokenList}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-babyBlue-500 hover:bg-babyBlue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Token'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateToken;