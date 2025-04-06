// 📁 File: src/components/TokenList.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

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
        <tr>
          <td colSpan="4" className="px-6 py-4 text-center text-red-400 bg-red-900/20">
            SIGNAL LOST
          </td>
        </tr>
      );
    }

    return this.props.children;
  }
}

// Individual token row component
const TokenRow = ({ token }) => {
  // More lenient token validation
  const isValidToken = token && typeof token === 'object';
  
  // Always provide fallback values for required fields
  const mint = isValidToken ? (token.mint || token.signature || 'unknown') : 'unknown';
  const name = isValidToken ? (token.name || 'Unknown Token') : 'Unknown Token';
  const timestamp = isValidToken ? (token.timestamp || new Date().toISOString()) : new Date().toISOString();

  
  const formatTimestamp = (ts) => {
    if (!ts) return 'Unknown';
    try {
      return formatDistanceToNow(new Date(ts), { addSuffix: true });
    } catch (e) {
      console.error('Error formatting timestamp:', e);
      return 'Invalid date';
    }
  };

  // Format mint address safely
  const formatMintAddress = (addr) => {
    if (!addr || typeof addr !== 'string') {
      return 'Invalid address';
    }
    return addr.length >= 16 ? `${addr.slice(0, 8)}...${addr.slice(-8)}` : addr;
  };

  // Get color based on first letter of token name
  const getColorClass = () => {
    const letter = name.charAt(0).toUpperCase();
    const colors = {
      'A': 'bg-yellow-400', 'B': 'bg-cyan-400', 'C': 'bg-green-400',
      'D': 'bg-purple-400', 'E': 'bg-red-400', 'F': 'bg-blue-400',
      'G': 'bg-yellow-400', 'H': 'bg-cyan-400', 'I': 'bg-green-400',
      'J': 'bg-purple-400', 'K': 'bg-red-400', 'L': 'bg-blue-400',
      'M': 'bg-yellow-400', 'N': 'bg-cyan-400', 'O': 'bg-green-400',
      'P': 'bg-purple-400', 'Q': 'bg-red-400', 'R': 'bg-blue-400',
      'S': 'bg-yellow-400', 'T': 'bg-cyan-400', 'U': 'bg-green-400',
      'V': 'bg-purple-400', 'W': 'bg-red-400', 'X': 'bg-blue-400',
      'Y': 'bg-yellow-400', 'Z': 'bg-cyan-400'
    };
    return colors[letter] || 'bg-gray-400';
  };

  return (
    <tr className="hover:bg-gray-800/50 border-b border-gray-800/50 vhs-glitch tracking-error">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-8 w-8 ${getColorClass()} rounded-sm flex items-center justify-center border border-gray-700`}>
            <span className="text-gray-900 font-bold font-mono">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white font-mono tracking-wide">{name}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm text-gray-300 font-mono">{formatMintAddress(mint)}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm text-gray-300 font-mono">{formatTimestamp(timestamp)}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        <a
          href={`https://solscan.io/token/${mint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300 rounded font-mono text-xs uppercase tracking-wider border border-gray-700 inline-flex items-center"
        >
          <span className="mr-1">●</span> View
        </a>
      </td>
    </tr>
  );
};

// Main TokenList component
const TokenList = ({ tokens }) => {
  console.log('TokenList received tokens:', tokens);
  
  if (!Array.isArray(tokens)) {
    console.error('TokenList received non-array tokens:', tokens);
    return (
      <div className="text-center text-gray-400 py-10 font-mono static-noise">
        NO SIGNAL DETECTED
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10 font-mono static-noise">
        SCANNING FOR TOKENS...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-gray-800 static-noise">
      {/* Debug output */}
      <pre className="text-xs text-gray-500 font-mono overflow-auto max-h-64 p-2 bg-gray-900/30">
        {JSON.stringify(tokens[0], null, 2)}
      </pre>
      
      <table className="min-w-full">
        <thead className="bg-black sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">TOKEN</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">MINT ADDRESS</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">CREATED</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-mono">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900/50 divide-y divide-gray-800">
          {tokens.map((token, index) => (
            <TokenRowErrorBoundary key={token?.mint || token?.signature || `token-${index}`}>
              <TokenRow token={token} />
            </TokenRowErrorBoundary>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenList;