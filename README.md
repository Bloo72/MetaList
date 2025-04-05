# Metarama - Solana Token Tracker

Metarama is a real-time Solana token tracker that uses Helius webhooks to monitor new token creations and display them in a beautiful, responsive UI.

## Architecture

The system consists of three main components:

1. **Webhook Listener** (`metarama-webhook/`): Receives webhook events from Helius, processes them, and stores token data in SQLite.
2. **Frontend** (`Metarama/`): A React application that displays tokens in real-time with smooth animations.
3. **Database** (`token_indexer.db`): SQLite database that stores token information.

## Setup and Running

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Helius API key (already configured)

### Webhook Listener

The webhook listener is deployed at `https://meta-webhook-0bky.onrender.com` and is configured to receive webhook events from Helius.

To run the webhook listener locally:

```bash
cd metarama-webhook
npm install
node webhook_listener.js
```

### Frontend

To run the frontend locally:

```bash
cd Metarama
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Testing the System

To test the webhook with a fake token mint:

```bash
cd metarama-webhook
node test-webhook.js
```

This will send a fake token creation event to the webhook and verify that it was added to the database.

## Helius Webhook Configuration

The webhook is configured to receive events from Helius at:

```
https://meta-webhook-0bky.onrender.com/api/webhook
```

Helius API Key: `6e029d96-9249-4ef7-84a6-a5f5d045df4b`

## Features

- Real-time token tracking using Helius webhooks
- Beautiful UI with smooth animations using Framer Motion
- Automatic timestamp updates
- Token age color coding
- Responsive design
- Efficient database management (keeps only the latest 230 tokens)

## Troubleshooting

If you encounter issues:

1. Check the webhook logs for errors
2. Verify that the Helius API key is correct
3. Ensure the database is properly initialized
4. Check the frontend console for API errors

## License

MIT
