import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TokenList from './TokenList';

const NewTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try the debug endpoint
        const debugResponse = await axios.get('/api/debug/tokens', {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log('Debug response:', debugResponse.data);
        console.log('Sample token:', debugResponse.data.sample);
        
        // Then fetch the actual tokens
        const response = await axios.get('/api/tokens/recent?limit=230', {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        
        if (response.data && Array.isArray(response.data.tokens)) {
          // Sanitize tokens before setting state
          const sanitizedTokens = response.data.tokens.map(token => ({
            name: token.name || 'Unknown Token',
            mint: token.mint || token.signature || 'unknown',
            timestamp: token.timestamp || new Date().toISOString(),
            signature: token.signature || token.mint || 'unknown'
          }));
          
          console.log('Sanitized tokens:', sanitizedTokens);
          console.log('First token:', sanitizedTokens[0]);
          
          setTokens(sanitizedTokens);
        } else {
          console.error('Unexpected response format:', response.data);
          setTokens([]);
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 15000);
    return () => clearInterval(interval);
  }, []);

  // If there's an error, display it as part of the retro TV aesthetic
  if (error) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        {/* TV-style header */}
        <div className="w-full bg-black p-4 border-b border-gray-800 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-red-500 animate-pulse rounded-full"></div>
              <span className="font-mono text-red-400 uppercase text-xs">ERROR</span>
              <span className="font-mono text-gray-400 text-xs">SIGNAL-7X</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-3 bg-yellow-400 mx-0.5"></div>
              <div className="w-6 h-3 bg-cyan-400 mx-0.5"></div>
              <div className="w-6 h-3 bg-green-400 mx-0.5"></div>
              <div className="w-6 h-3 bg-purple-400 mx-0.5"></div>
              <div className="w-6 h-3 bg-red-400 mx-0.5"></div>
              <div className="w-6 h-3 bg-blue-400 mx-0.5"></div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 font-mono">CH-420</span>
              <div className="ml-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="ml-1 text-red-400 text-xs font-mono">OFFLINE</span>
            </div>
          </div>
        </div>
        
        <div className="static-noise p-10 rounded-lg border border-red-900">
          <div className="text-center">
            <h2 className="text-xl font-mono text-red-500 mb-4 glitching">SIGNAL LOST</h2>
            <p className="text-gray-400 font-mono mb-6">CONNECTION ERROR: API UNAVAILABLE</p>
            <div className="bg-gray-900 p-4 rounded text-left text-xs font-mono text-gray-400 max-w-lg mx-auto">
              {error}
              <div className="mt-4 border-t border-gray-800 pt-4">
                <p className="mb-2">TROUBLESHOOTING:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check if webhook server is running</li>
                  <li>Verify API endpoint URL is correct</li>
                  <li>Ensure CORS is properly configured on server</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* TV-style header */}
      <div className="w-full bg-black p-4 border-b border-gray-800 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-4 w-4 bg-red-500 animate-pulse rounded-full"></div>
            <span className="font-mono text-red-400 uppercase text-xs">REC</span>
            <span className="font-mono text-gray-400 text-xs">SIGNAL-7X</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-3 bg-yellow-400 mx-0.5"></div>
            <div className="w-6 h-3 bg-cyan-400 mx-0.5"></div>
            <div className="w-6 h-3 bg-green-400 mx-0.5"></div>
            <div className="w-6 h-3 bg-purple-400 mx-0.5"></div>
            <div className="w-6 h-3 bg-red-400 mx-0.5"></div>
            <div className="w-6 h-3 bg-blue-400 mx-0.5"></div>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-400 font-mono">CH-420</span>
            <div className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="ml-1 text-green-400 text-xs font-mono">LIVE</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <h2 className="text-xl font-bold text-white uppercase font-mono tracking-wider">UNDERGROUND_TOKENS</h2>
            <div className="absolute -bottom-1 left-0 w-full h-px bg-blue-400/50"></div>
          </div>
          <div className="flex items-center text-right">
            <div className="text-sm font-mono text-gray-400">{currentTime}</div>
          </div>
        </div>
        
        {/* Debug output */}
        {tokens.length > 0 && (
          <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <h2 className="text-sm font-mono text-gray-400 mb-2">Debug: First Token</h2>
            <pre className="text-xs font-mono text-gray-300 overflow-auto">
              {JSON.stringify(tokens[0], null, 2)}
            </pre>
          </div>
        )}
        
        {error ? (
          <div className="text-center py-10">
            <div className="inline-block p-6 bg-red-900/20 border border-red-800 rounded-lg">
              <h2 className="text-xl font-bold text-red-400 mb-2 font-mono tracking-error">ERROR</h2>
              <p className="text-red-300 font-mono">{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-10">
            <div className="inline-block p-6 bg-gray-900/20 border border-gray-800 rounded-lg">
              <h2 className="text-xl font-bold text-gray-400 mb-2 font-mono tracking-error">LOADING</h2>
              <p className="text-gray-300 font-mono">Fetching tokens...</p>
            </div>
          </div>
        ) : (
          <TokenList tokens={tokens} />
        )}
      </div>
    </div>
  );
};

export default NewTokens;