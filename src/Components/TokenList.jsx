// 📁 File: src/components/TokenList.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

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

// Main TokenList component
const TokenList = ({ tokens }) => {
  console.log('TOTAL Tokens received:', tokens?.length);
  console.log('FIRST 10 Tokens:', tokens?.slice(0, 10));

  if (!Array.isArray(tokens)) {
    console.error('TokenList received invalid tokens:', tokens);
    return (
      <div className="p-4 bg-black border border-gray-800 rounded-lg">
        <p className="text-gray-400 font-retro text-sm">No tokens detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tokens.map((token, index) => (
        <TokenRowErrorBoundary key={token?.mint || token?.signature || `token-${index}`}>
          <TokenRow token={token} />
        </TokenRowErrorBoundary>
      ))}
    </div>
  );
};

export default TokenList;