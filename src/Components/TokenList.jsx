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
        <tr className="bg-red-900/20">
          <td colSpan="4" className="px-6 py-4 text-center text-red-400">
            Error displaying token data
          </td>
        </tr>
      );
    }

    return this.props.children;
  }
}

// Individual token row component
const TokenRow = ({ token }) => {
  // Validate token data
  const isValidToken = token && typeof token === 'object' && token.mint;
  const mint = isValidToken ? token.mint : null;
  const name = isValidToken && token.name ? token.name : 'Unknown Token';
  const timestamp = isValidToken && token.timestamp ? token.timestamp : null;
  
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
    if (!addr || typeof addr !== 'string' || addr.length < 16) {
      return 'Invalid address';
    }
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  return (
    <tr className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-300 font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">{name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
        {formatMintAddress(mint)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {formatTimestamp(timestamp)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {isValidToken ? (
          <a
            href={`https://solscan.io/token/${mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            View on Solscan
          </a>
        ) : (
          <span className="text-gray-500">Unavailable</span>
        )}
      </td>
    </tr>
  );
};

// Main TokenList component
const TokenList = ({ tokens }) => {
  if (!Array.isArray(tokens)) {
    return (
      <div className="text-center text-gray-400 py-10">
        No tokens to display.
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        No tokens found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mint Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {tokens.map((token, index) => (
            <TokenRowErrorBoundary key={token?.mint || `token-${index}`}>
              <TokenRow token={token} />
            </TokenRowErrorBoundary>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenList;
