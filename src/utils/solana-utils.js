import * as web3 from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import axios from 'axios';

const TOKEN_MAPPING = {
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
    name: 'Bonk',
    symbol: 'BONK',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.svg'
  },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    name: 'USD Coin',
    symbol: 'USDC',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr': {
    name: 'USD Coin (Devnet)',
    symbol: 'USDCdev',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  }
};

export const getSolanaConnection = (() => {
  let connection = null;
  const HELIUS_DEVNET_RPC_URL = 'https://devnet.helius-rpc.com/?api-key=0546db15-e030-4ca1-b1b3-18b5578c953c';

  return () => {
    if (!connection) {
      console.log("Creating Solana connection to:", HELIUS_DEVNET_RPC_URL);
      connection = new web3.Connection(HELIUS_DEVNET_RPC_URL, 'confirmed');
    }
    return connection;
  };
})();

export const trackNewTokens = async (connection, callback) => {
  console.warn("trackNewTokens is using placeholder logic and will not find new tokens.");
  const checkInterval = 60000;
  const checkForNewTokens = async () => { };
  const intervalId = setInterval(checkForNewTokens, checkInterval);
  return () => clearInterval(intervalId);
};

const fetchRecentTokenMints = async (connection) => {
  return [];
};

const enrichTokenData = (token) => {
  if (!token || typeof token.mint !== 'string') {
    console.error("enrichTokenData received invalid token:", token);
    return {
      ...token,
      mint: token?.mint || 'UnknownMint',
      name: 'Invalid Token Data',
      symbol: 'ERR',
      logo: `https://ui-avatars.com/api/?name=ERR&background=ff0000`,
      volume: 0, marketCap: 0, price: '0.00', change: '0.00', category: 'error',
      timestamp: token?.timestamp || new Date().toISOString()
    };
  }
  const knownToken = TOKEN_MAPPING[token.mint];
  return {
    ...token,
    name: knownToken?.name || 'Unknown Token',
    symbol: knownToken?.symbol || token.mint.slice(0, 4),
    logo: knownToken?.logo || `https://ui-avatars.com/api/?name=${token.mint.slice(0, 4)}&background=${Math.floor(Math.random()*16777215).toString(16)}`,
    volume: Math.floor(Math.random() * 100000),
    marketCap: Math.floor(Math.random() * 1000000),
    price: (Math.random() * 0.1).toFixed(4),
    change: (Math.random() * 20 - 10).toFixed(2),
    category: categorizeToken(token)
  };
};

const categorizeToken = (token) => {
  if (!token || !token.timestamp || isNaN(new Date(token.timestamp).getTime())) {
    console.warn("Invalid timestamp for categorization:", token);
    return 'unknown';
  }
  const now = new Date();
  const tokenTime = new Date(token.timestamp);
  const timeDiff = now.getTime() - tokenTime.getTime();
  const minutesDiff = timeDiff / (1000 * 60);
  if (minutesDiff < 15) return 'newly-created';
  if (minutesDiff < 60) return 'about-to-graduate';
  return 'graduated';
};

export const findRaydiumPool = async (tokenMint) => {
  console.warn(`findRaydiumPool called for ${tokenMint}, returning placeholder pool address.`);
  if (tokenMint === 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263') {
    return 'BonkrVJavzx5AuKV6s16KFkEUGzwjYMGJ1KJ6CUvhpuD';
  }
  if (tokenMint === 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr') {
    return '3ucNos4NbumPLZNWztqGHNFFgkHeRMBQAVemeeomsUxv';
  }
  console.log(`No hardcoded pool found for ${tokenMint}. Returning null.`);
  return null;
};

export const trackTokenMigrations = async (connection, callback) => {
  console.warn("trackTokenMigrations is using placeholder logic and will simulate migrations.");
  const checkInterval = 30000;
  const checkMigrations = () => {
    if (Math.random() < 0.1) {
      console.log("Simulating a token migration event...");
      const mockMigration = {
        tokenMint: web3.Keypair.generate().publicKey.toBase58(),
        poolAddress: web3.Keypair.generate().publicKey.toBase58(),
        timestamp: new Date().toISOString()
      };
      callback(enrichTokenData(mockMigration));
    }
  };
  const intervalId = setInterval(checkMigrations, checkInterval);
  return () => {
    console.log("Stopping simulated migration tracking.");
    clearInterval(intervalId);
  };
};

export const parseRaydiumPoolData = (data) => {
  console.log("Attempting to parse AMM V4 pool data using offsets 16 & 48...");
  try {
    const minLength = 48 + 32;
    if (!data || data.length < minLength) {
      console.error(`Invalid or insufficient pool data length (${data?.length}). Need at least ${minLength} bytes.`);
      return null;
    }

    const coinVaultAddressBytes = data.slice(16, 48);
    const coinVaultAddress = new PublicKey(coinVaultAddressBytes);
    console.log("Parsed Coin Vault Address (Offset 16):", coinVaultAddress.toBase58());

    const pcVaultAddressBytes = data.slice(48, 80);
    const pcVaultAddress = new PublicKey(pcVaultAddressBytes);
    console.log("Parsed PC Vault Address (Offset 48):", pcVaultAddress.toBase58());

    return {
      coinVault: coinVaultAddress,
      pcVault: pcVaultAddress,
      baseDecimals: 6,
      quoteDecimals: 9
    };

  } catch (error) {
    console.error('Error parsing pool data using offsets 16 & 48:', error);
    return null;
  }
};

export const calculateTokenPrice = (
  baseReserve,
  quoteReserve,
  baseDecimals,
  quoteDecimals,
  quoteTokenPriceUSD = 150
) => {
  if (baseReserve === undefined || quoteReserve === undefined || baseReserve === 0 ||
    baseDecimals === undefined || quoteDecimals === undefined) {
    console.warn("Invalid reserves/decimals for price calculation", { baseReserve, quoteReserve, baseDecimals, quoteDecimals });
    return 0;
  }

  try {
    const adjustedBaseReserve = baseReserve / (10 ** baseDecimals);
    const adjustedQuoteReserve = quoteReserve / (10 ** quoteDecimals);

    const priceOfCoinInPc = adjustedBaseReserve / adjustedQuoteReserve;
    const priceOfCoinInUSD = priceOfCoinInPc * 1.0;

    if (isNaN(priceOfCoinInUSD) || !isFinite(priceOfCoinInUSD)) {
      console.warn("Calculated price is NaN or Infinite");
      return 0;
    }

    return priceOfCoinInUSD;

  } catch (error) {
    console.error('Error calculating token price:', error);
    return 0;
  }
};

export { enrichTokenData };
