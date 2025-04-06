import React, { useState, useEffect } from 'react';
import TokenList from './TokenList';

const NewTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/tokens/recent');
      const data = await response.json();
      setTokens(data.slice(0, 230)); // Keep max 230 tokens
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="p-6 bg-black border border-gray-800 rounded-lg text-center">
          <div className="inline-block">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-gray-400 font-retro text-sm">SCANNING NETWORK</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <TokenList tokens={tokens} />
    </div>
  );
};

export default NewTokens;