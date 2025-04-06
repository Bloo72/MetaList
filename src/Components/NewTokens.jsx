import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TokenList from './TokenList';

const NewTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const latestTimestampRef = useRef(null);

  // Initial load - get full list of recent tokens
  const initialFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/tokens/recent?limit=230', {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.data && Array.isArray(response.data.tokens)) {
        // Sanitize tokens before setting state
        const sanitizedTokens = response.data.tokens.map(token => ({
          name: token.name || 'Unknown Token',
          mint: token.mint || token.signature || 'unknown',
          timestamp: token.timestamp || new Date().toISOString(),
          signature: token.signature || token.mint || 'unknown'
        }));
        
        // Update latest timestamp reference
        if (sanitizedTokens.length > 0) {
          latestTimestampRef.current = sanitizedTokens[0].timestamp;
          console.log('Initial latest timestamp:', latestTimestampRef.current);
        }
        
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

  // Only fetch tokens newer than our latest timestamp
  const refreshFetch = async () => {
    try {
      if (!latestTimestampRef.current) {
        console.log('No timestamp reference, skipping refresh');
        return;
      }

      const response = await axios.get('/api/tokens/recent?limit=50', {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.data && Array.isArray(response.data.tokens)) {
        // Sanitize new tokens
        const newTokens = response.data.tokens
          .map(token => ({
            name: token.name || 'Unknown Token',
            mint: token.mint || token.signature || 'unknown',
            timestamp: token.timestamp || new Date().toISOString(),
            signature: token.signature || token.mint || 'unknown'
          }))
          // Only keep tokens newer than our latest timestamp
          .filter(token => new Date(token.timestamp) > new Date(latestTimestampRef.current));

        if (newTokens.length > 0) {
          console.log(`Found ${newTokens.length} new tokens since ${latestTimestampRef.current}`);
          // Update latest timestamp reference
          latestTimestampRef.current = newTokens[0].timestamp;
          console.log('New latest timestamp:', latestTimestampRef.current);
          
          // Merge new tokens with existing ones
          setTokens(prevTokens => {
            // Filter out duplicates
            const existingMints = new Set(prevTokens.map(t => t.mint));
            const uniqueNewTokens = newTokens.filter(t => !existingMints.has(t.mint));
            return [...uniqueNewTokens, ...prevTokens].slice(0, 230); // Keep list at 230 tokens
          });
        } else {
          console.log('No new tokens found since', latestTimestampRef.current);
        }
      }
    } catch (err) {
      console.error('Refresh error:', err);
      // Don't set error state for refresh failures to avoid disrupting the UI
    }
  };

  useEffect(() => {
    // Run initial fetch once
    initialFetch();

    // Set up refresh on a longer interval (60 seconds)
    const refreshInterval = setInterval(refreshFetch, 60000);
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Clean up intervals on unmount
    return () => {
      clearInterval(refreshInterval);
      clearInterval(timeInterval);
    };
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
    <div className="w-full">
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
      
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white font-mono tracking-error">UNDERGROUND_TOKENS</h1>
        <div className="text-sm text-gray-400 font-mono">{currentTime}</div>
      </div>
      
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
  );
};

export default NewTokens;