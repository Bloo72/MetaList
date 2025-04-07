import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ENDPOINTS, fetchAPI } from '../utils/api';

// Fallback data for when API is not available
const FALLBACK_TOKENS = [
  {
    address: 'fallback1',
    ticker: 'DEMO',
    name: 'Demo Token',
    marketCap: 1000000,
    description: 'This is a demo token shown when the API is not available.',
    timestamp: new Date().toISOString(),
  },
  {
    address: 'fallback2',
    ticker: 'TEST',
    name: 'Test Token',
    marketCap: 500000,
    description: 'Another demo token for testing purposes.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    address: 'fallback3',
    ticker: 'META',
    name: 'Metarama Token',
    marketCap: 2000000,
    description: 'The official Metarama token for the platform.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  }
];

const NewTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching tokens from:', ENDPOINTS.NEW_TOKENS);
        const data = await fetchAPI(ENDPOINTS.NEW_TOKENS);
        
        // Handle both array responses and data.tokens object responses
        const tokensArray = Array.isArray(data) ? data : (data.tokens || []);
        
        if (!Array.isArray(tokensArray)) {
          console.error('Unexpected token format:', data);
          throw new Error('Invalid data format received from API');
        }
        
        // Only use fallback if the API call fails, not if it returns an empty array
        if (tokensArray.length === 0) {
          console.log('No tokens returned from API, but this is valid - just showing empty state');
          setTokens([]);
        } else {
          console.log(`Successfully fetched ${tokensArray.length} tokens from API`);
          setTokens(tokensArray.slice(0, 50));
        }
      } catch (error) {
        console.error('Error fetching new tokens:', error);
        setTokens(FALLBACK_TOKENS);
        setError('Failed to connect to API. Using demo data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleCardClick = (token) => {
    navigate(`/token/${token.address}`);
  };

  const handleShare = (e, token) => {
    e.stopPropagation();
    const url = `${window.location.origin}/token/${token.address}`;
    navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="font-retro text-2xl text-cyan-400 mb-4">SCANNING NETWORK</div>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-400 font-retro">{error}</p>
        </div>
      )}
      
      {tokens.length === 0 && !error && (
        <div className="mb-6 p-4 bg-gray-900/30 border border-gray-800 rounded-lg">
          <p className="text-gray-400 font-retro">No tokens found. Check back later for new tokens.</p>
        </div>
      )}
      
      <div className="space-y-4">
        {tokens.map((token, index) => (
          <div 
            key={token.address || index}
            className="token-card cursor-pointer hover:bg-gray-800/60 transition-all duration-300"
            onClick={() => handleCardClick(token)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-white font-retro">{token.ticker || 'UNKNOWN'}</h2>
                <p className="text-gray-400 text-sm font-retro">{token.name || 'Unnamed Token'}</p>
              </div>
              <div className="text-right">
                <div className="text-cyan-400 font-retro">${token.marketCap ? token.marketCap.toLocaleString() : '0'}</div>
                <div className="text-gray-500 text-xs font-retro">
                  {token.timestamp ? formatDistanceToNow(new Date(token.timestamp), { addSuffix: true }) : 'Unknown time'}
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 line-clamp-2">{token.description || 'No description available.'}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors">
                  <span>👍</span>
                  <span className="text-xs font-retro">{Math.floor(Math.random() * 100)}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
                  <span>👎</span>
                  <span className="text-xs font-retro">{Math.floor(Math.random() * 50)}</span>
                </button>
              </div>
              <button 
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                onClick={(e) => handleShare(e, token)}
              >
                🔁
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewTokens;