# Metarama Project Architecture Overview (Updated)

## 1. Directory Structure

### Frontend (Root Directory)
- **src/**: Main source code
  - **Components/**: React components (Sidebar, TokenList, CreateToken, NewTokens, WalletConnectButton)
  - **Context/**: React context providers (AuthContext)
  - **utils/**: Utility functions (apiClient, solana-utils)
  - **assets/**: Static assets
  - **App.jsx**: Main application component with routing
  - **main.jsx**: Entry point
  - **index.css**: Global styles including retro TV aesthetic
- **public/**: Static files served directly
- **package.json**: Frontend dependencies and scripts
- **vite.config.js**: Vite configuration with proxy settings
- **tailwind.config.js**: Tailwind CSS configuration with safelist for dynamic classes
- **.env**: Environment variables for frontend
- **index.html**: HTML template

### Webhook (metarama-webhook/)
- **webhook_listener.js**: Webhook server for token events using PumpPortal WebSocket
- **package.json**: Webhook dependencies and scripts
- **.env**: Environment variables for webhook
- **README.md**: Documentation for the webhook service
- **test-webhook.js**: Test script for the webhook

## 2. Key Files and Their Functions

### Frontend
- **src/App.jsx**: Main application component with routing setup and Sidebar integration
- **src/Components/Sidebar.jsx**: Fixed-width sidebar navigation with retro TV aesthetic
- **src/Components/TokenList.jsx**: Displays tokens with retro TV aesthetic and tracking error effects
- **src/Components/CreateToken.jsx**: Token creation interface
- **src/Components/NewTokens.jsx**: Displays newly created tokens with TV test pattern header
- **src/Components/WalletConnectButton.jsx**: Wallet connection component
- **src/Context/AuthContext.jsx**: Authentication state management
- **src/utils/apiClient.js**: API client for backend communication
- **src/utils/solana-utils.js**: Solana blockchain utilities

### Webhook
- **webhook_listener.js**: Listens for token events using PumpPortal WebSocket
  - Implements CORS middleware
  - Provides API endpoints for token data
  - Uses SQLite for data storage
  - Implements WebSocket subscription for real-time token updates
  - Includes comprehensive error handling and reconnection logic

## 3. Service Interactions

### Webhook Service
- The webhook service (`metarama-webhook`) listens for token events on the Solana blockchain using PumpPortal WebSocket
- It provides API endpoints for the frontend to fetch token data
- It uses SQLite for data storage
- It implements WebSocket subscription for real-time token updates with automatic reconnection

### Frontend Token Fetching and Display
- The frontend uses Axios to communicate with the webhook service
- The `NewTokens` component fetches tokens from the webhook's `/api/tokens/recent` endpoint
- The frontend components (TokenList, NewTokens) display the fetched tokens with a retro TV aesthetic

## 4. API Endpoints

### Webhook Service
- **GET /api/tokens/recent**: Fetches recent tokens with pagination
- **GET /api/debug/tokens**: Debug endpoint to check token data format
- **GET /**: Root endpoint with status message
- **GET /health**: Health check endpoint

## 5. Environment Variables

### Frontend
- **VITE_API_URL**: URL of the webhook service (defaults to 'https://metarama-webhook-g603.onrender.com')
- **VITE_SOLANA_NETWORK**: Solana network (mainnet)
- **VITE_SOLANA_RPC_URL**: Solana RPC URL
- **VITE_APP_NAME**: Application name (Metarama)

### Webhook
- **PORT**: Port on which the webhook service runs (defaults to 3001)
- **HOST**: Host address (0.0.0.0)
- **NODE_ENV**: Environment (production)
- **DB_PATH**: Path to the SQLite database

## 6. CORS Configuration

The webhook service implements a secure CORS middleware:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://metarama.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl/postman/server-side
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`❌ CORS blocked request from: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## 7. WebSocket Subscription

The webhook service uses PumpPortal WebSocket for real-time token updates:
```javascript
function connectPumpPortalWS() {
  const ws = new WebSocket('wss://pumpportal.fun/api/data');

  ws.on('open', () => {
    console.log('🌐 Connected to PumpPortal');
    ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
    console.log('📡 Subscribed to new token events');
  });

  ws.on('message', async (data) => {
    // Process token data
  });
}
```

## 8. Deployment

The webhook service is deployed on Render at https://metarama-webhook-g603.onrender.com.

### Render Configuration
- **Root Directory**: `metarama-webhook`
- **Start Command**: `node webhook_listener.js`
- **Node Version**: 18.x
- **Build Command**: `npm install`
- **Environment Variables**: 
  - PORT (optional)

## 9. Local Development Commands

### Frontend
```bash
npm run dev  # Starts Vite dev server on port 5173
```

### Webhook
```bash
cd metarama-webhook
npm start  # Starts webhook listener
```

## 10. UI Changes

### Retro TV Aesthetic
- Added VHS glitch effects with CSS animations
- Implemented tracking error effects on token rows
- Added TV test pattern header with recording indicator and color bars
- Added noise texture to the sidebar
- Used monospace fonts for the retro look

### Sidebar Component
- Simplified to a fixed-width sidebar (60px)
- Removed collapsible functionality for a cleaner interface
- Integrated the WalletConnectButton
- Used pixel font for the logo
- Added Material Icons for navigation

### Styling Updates
- Added retro TV aesthetic with noise texture and CRT-like curvature
- Added glitch effects and animations
- Updated color scheme to dark theme
- Added responsive styles for mobile devices

## 11. Performance Optimizations

### Token Data Optimization
- The webhook service trims token data to reduce bandwidth:
```javascript
const trimmed = tokens.map(t => ({
  name: t.name,
  mint: t.mint,
  timestamp: t.timestamp
  // Remove raw_json and other large fields
}));
```

### Smart Polling Strategy
- The NewTokens component now uses a timestamp-based polling strategy:
  - Initial load fetches 230 tokens
  - Tracks latest token timestamp for efficient updates
  - Periodic refresh only processes tokens newer than last timestamp
  - Updates every 60 seconds
  - Maintains list at 230 tokens while minimizing bandwidth usage

### UI Rendering Improvements
- Removed inner scrollbar from token list container
- Implemented proper content centering with dynamic width constraints
- Added sticky header for better navigation
- Improved error handling and loading states

## 12. Current Issues and Solutions

### Token Rendering Issue
- **Problem**: Tokens were not displaying despite successful API responses
- **Solution**: 
  - Added data sanitization to ensure all required fields have fallback values
  - Made token validation more lenient in the TokenList component
  - Added debug output to visualize token data
  - Implemented proper error handling for missing or invalid data

### CORS Configuration
- **Problem**: CORS issues were blocking API requests
- **Solution**:
  - Implemented a secure CORS configuration with explicit allowed origins
  - Added proper error handling for unauthorized origins
  - Configured the Vite proxy to handle API requests during development

### Layout Issues
- **Problem**: Content was being pushed to the bottom of the page
- **Solution**:
  - Removed App.css to eliminate conflicting styles
  - Updated App.jsx with proper flex layout:
    ```jsx
    <div className="flex min-h-screen bg-black overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex justify-center px-6 ml-60">
        <div className="w-full max-w-[1200px]">
          <Routes>...</Routes>
        </div>
      </main>
    </div>
    ```
  - Adjusted TokenList container to remove inner scrollbar

### Webhook URL Update
- **Problem**: The webhook service was moved to a new URL
- **Solution**:
  - Updated all references to the old webhook URL in the codebase
  - Updated the Vite proxy configuration
  - Updated environment variables and fallback URLs

### Tailwind Configuration
- **Problem**: Dynamic classes were not being generated
- **Solution**:
  - Added a safelist in tailwind.config.js for dynamic classes:
    ```javascript
    safelist: [
      'ml-20',
      'ml-60',
      'max-w-[calc(100%-5rem)]',
      'max-w-[calc(100%-15rem)]'
    ]
    ```
  - This ensures that Tailwind generates these classes even when applied dynamically

These updates ensure that the application now has a consistent retro TV aesthetic, improved token fetching strategy, and better layout handling, resulting in a more reliable and visually appealing user experience. 