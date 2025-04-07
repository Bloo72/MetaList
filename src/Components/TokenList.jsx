// 📁 File: src/components/TokenList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ENDPOINTS, fetchAPI } from '../utils/api';

const formatCap = (cap) => {
  if (!cap) return 'N/A';
  if (cap >= 1000000) return `${(cap / 1000000).toFixed(2)}M`;
  if (cap >= 1000) return `${(cap / 1000).toFixed(2)}K`;
  return cap.toFixed(2);
};

// Error boundary component for individual token rows
class TokenRowErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Token row error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-black border border-red-800 rounded-lg">
          <p className="text-red-400 font-retro text-sm">Error displaying token</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Individual token row component
const TokenRow = ({ token }) => {
  // Mock data for demonstration
  const mockData = {
    marketcap: Math.random() * 2000000, // Random market cap between 0 and 2M
    description: "A revolutionary meme token bringing joy and profits to the community. Built on Solana with love and diamond hands. 💎🚀",
    ticker: token.name.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 5)
  };

  return (
    <div className="rounded-lg bg-black border border-gray-800 p-4 mb-4 hover:bg-gray-900/50 transition-colors vhs-glitch">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-retro tracking-widest">${mockData.ticker}</h2>
          <p className="text-gray-300 font-retro text-sm mt-1">{token.name}</p>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-retro text-sm">
            <span className="opacity-50">$</span>{formatCap(mockData.marketcap)}
          </p>
          <p className="text-gray-400 font-retro text-xs">
            {formatDistanceToNow(new Date(token.timestamp))} ago
          </p>
        </div>
      </div>
      <div className="mt-3 text-gray-400 font-retro text-xs italic line-clamp-2">
        {mockData.description}
      </div>
      <div className="flex justify-end mt-4">
        <a 
          href={`/tokens/${mockData.ticker}`} 
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded font-retro text-xs uppercase tracking-wider border border-gray-700 inline-flex items-center group transition-all duration-300"
        >
          <span className="mr-1 opacity-50 group-hover:opacity-100 transition-opacity">●</span> 
          View Details
        </a>
      </div>
    </div>
  );
};

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

// Main TokenList component
const TokenList = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchAPI(ENDPOINTS.ALL_TOKENS);
        
        // Handle both array responses and data.tokens object responses
        const tokensArray = Array.isArray(data) ? data : (data.tokens || []);
        
        if (!Array.isArray(tokensArray)) {
          console.error('Unexpected token format:', data);
          setTokens(FALLBACK_TOKENS);
          setError('Invalid data format received from API');
          return;
        }
        
        if (tokensArray.length === 0) {
          console.warn('No tokens returned from API, using fallback data');
          setTokens(FALLBACK_TOKENS);
        } else {
          setTokens(tokensArray.slice(0, 230));
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
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

export default TokenList;