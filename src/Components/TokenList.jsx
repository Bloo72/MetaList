// 📁 File: src/components/TokenList.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const TokenList = ({ tokens }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  if (!tokens || tokens.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tokens found
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
          {tokens.map((token) => (
            <tr key={token.mint} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">
                  {token.name || 'Unknown Token'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatTimestamp(token.timestamp)}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenList;
