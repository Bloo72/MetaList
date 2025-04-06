import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TokenList from './TokenList';

const NewTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('https://meta-webhook-0bky.onrender.com/api/tokens/recent?limit=230');
        setTokens(response.data.tokens || []);
      } catch (err) {
        console.error('❌ Failed to fetch tokens:', err.message);
        setTokens([]); // Ensure tokens is always an array even on error
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();

    // Optional: Refresh every 15 seconds
    const interval = setInterval(fetchTokens, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-white">🆕 Newest Tokens on Pump.fun</h2>
      {loading ? (
        <p className="text-gray-400">Loading tokens...</p>
      ) : (
        <TokenList tokens={tokens || []} />
      )}
    </div>
  );
};

export default NewTokens;