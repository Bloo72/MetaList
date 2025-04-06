# Metarama Project Architecture Overview (Latest)

## 1. Directory Structure

### Frontend (Root Directory)
- **src/**: Main source code
  - **Components/**: React components (Sidebar, TokenList, CreateToken, NewTokens, WalletConnectButton)
  - **Context/**: React context providers (AuthContext)
  - **utils/**: Utility functions (apiClient, solana-utils)
  - **assets/**: Static assets
  - **App.jsx**: Main application component with flex layout and routing
  - **main.jsx**: Entry point
  - **index.css**: Global styles including retro TV aesthetic
- **public/**: Static files served directly
- **package.json**: Frontend dependencies and scripts
- **vite.config.js**: Vite configuration with updated proxy settings
- **tailwind.config.js**: Tailwind CSS configuration
- **.env**: Environment variables for frontend

### Webhook (metarama-webhook/)
- **webhook_listener.js**: Webhook server for token events using PumpPortal WebSocket
- **package.json**: Webhook dependencies and scripts
- **.env**: Environment variables for webhook
- **README.md**: Documentation for the webhook service
- **test-webhook.js**: Test script for the webhook

## 2. Key Files and Their Functions

### Frontend
- **src/App.jsx**: Main application component with flex layout and proper content centering
```jsx
<div className="flex min-h-screen bg-black overflow-hidden">
  <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
  <main className={`flex-1 transition-all duration-300 flex justify-center px-6 ${
    isCollapsed ? 'ml-20' : 'ml-60'
  }`}>
    <div className="w-full max-w-[1200px]">
      <Routes>
        <Route path="/" element={<NewTokens />} />
        <Route path="/tokens" element={<TokenList />} />
        <Route path="/create" element={<CreateToken />} />
        <Route path="/new" element={<NewTokens />} />
      </Routes>
    </div>
  </main>
</div>
```

- **src/Components/NewTokens.jsx**: Smart token fetching with timestamp tracking
```javascript
const NewTokens = () => {
  const [tokens, setTokens] = useState([]);
  const latestTimestampRef = useRef(null);

  // Initial fetch gets 230 tokens
  const initialFetch = async () => {
    const response = await axios.get('/api/tokens/recent?limit=230');
    if (response.data.tokens.length > 0) {
      latestTimestampRef.current = response.data.tokens[0].timestamp;
    }
  };

  // Refresh only fetches new tokens
  const refreshFetch = async () => {
    if (!latestTimestampRef.current) return;
    // Only process tokens newer than our latest timestamp
    const newTokens = tokens.filter(token => 
      new Date(token.timestamp) > new Date(latestTimestampRef.current)
    );
  };
};
```

- **src/Components/TokenList.jsx**: Optimized token display with proper height constraints
```jsx
<div className="h-[calc(100vh-26rem)] max-h-[800px] overflow-y-auto rounded-lg border border-gray-800 static-noise">
  <table className="min-w-full">
    <thead className="bg-black sticky top-0 z-10">
      {/* ... */}
    </thead>
    <tbody className="bg-gray-900/50 divide-y divide-gray-800">
      {tokens.map(token => (
        <TokenRow key={token.mint} token={token} />
      ))}
    </tbody>
  </table>
</div>
```

## 3. Service Interactions

### Webhook Service
- Provides trimmed token data to reduce bandwidth
- Implements secure CORS with explicit allowed origins
- Uses SQLite for efficient data storage
- Maintains WebSocket connection to PumpPortal

### Frontend Token Fetching
- Initial load: Fetches 230 tokens
- Refresh strategy:
  - Tracks latest token timestamp
  - Only processes truly new tokens
  - Updates every 60 seconds
  - Maintains max 230 tokens in view

## 4. API Endpoints

### Webhook Service (https://metarama-webhook-g603.onrender.com)
- **GET /api/tokens/recent**: Fetches recent tokens with optimized response
```javascript
// Response format
{
  tokens: [{
    name: string,
    mint: string,
    timestamp: string
  }]
}
```
- **GET /api/debug/tokens**: Debug endpoint (development only)
- **GET /health**: Health check endpoint

## 5. Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://metarama-webhook-g603.onrender.com
VITE_SOLANA_NETWORK=mainnet
VITE_APP_NAME=Metarama
```

### Webhook (.env)
```
PORT=3001
HOST=0.0.0.0
NODE_ENV=production
```

## 6. CORS Configuration

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://metarama.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`❌ CORS blocked request from: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 7. Performance Optimizations

### Token Fetching Strategy
- Initial load: 230 tokens (one-time cost)
- Refresh mechanism:
  - Uses timestamp tracking
  - Only processes new tokens
  - 60-second refresh interval
  - Maintains token limit while minimizing bandwidth

### Layout Optimization
- Proper content centering using flex layout
- Efficient height constraints for token list
- Removed unnecessary padding and margins
- Optimized for both desktop and mobile views

### Data Efficiency
- Trimmed token response format
- Timestamp-based filtering
- Duplicate prevention
- Proper error handling and fallbacks

## 8. UI Components

### Token Display
- Retro TV aesthetic
- Proper height constraints
- Sticky header
- Responsive layout
- Error boundaries for individual tokens

### Navigation
- Collapsible sidebar
- Wallet integration
- Real-time status indicators
- Smooth transitions

## 9. Current State

### Working Features
- Token fetching and display
- Bandwidth-efficient updates
- Proper layout and centering
- Retro TV aesthetic
- Error handling
- Loading states

### Recent Improvements
- Timestamp-based token tracking
- Layout centering fixes
- Removed debug outputs
- Optimized refresh strategy
- Improved error handling

### Next Steps
1. Monitor bandwidth usage
2. Consider WebSocket implementation
3. Add search/filter functionality
4. Implement token analytics

## 10. Development Commands

### Frontend
```bash
npm run dev  # Starts Vite dev server
```

### Webhook
```bash
cd metarama-webhook
npm start    # Starts webhook listener
```

## 11. Deployment

### Frontend
- Platform: Render
- Build Command: `npm run build`
- Start Command: `npm run preview`

### Webhook
- Platform: Render
- URL: https://metarama-webhook-g603.onrender.com
- Build Command: `npm install`
- Start Command: `node webhook_listener.js`
