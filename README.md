# Webhook Tester Tool

A tool to test webhook functionality by generating unique URLs and capturing incoming HTTP requests in real-time. Built with Express and WebSocket.

## Features

- 🆔 **Unique Webhook URLs**: Automatically generates unique endpoints for testing.
- 🔄 **Real-Time Updates**: Uses WebSocket to push request data to the client instantly.
- 📝 **Detailed Request Logging**: Captures method, headers, body, and metadata for every request.
- 🛠️ **Custom WebSocket Implementation**: Low-level WebSocket frame handling for educational purposes.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/webhook.git
   cd webhook
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   Server will run at `http://localhost:3000`.

## Usage

1. Visit `http://localhost:3000` to get a unique webhook URL (e.g., `http://localhost:3000/abc123`).
2. Use the generated URL as your webhook endpoint in external applications.
3. View incoming requests in real-time on the web interface.

**Example Test:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"test":true}' http://localhost:3000/abc123
```

## Project Structure

```
├── index.js            # Main server entry point
├── public/             # Static assets
│   ├── css/           # Stylesheets
│   └── js/            # Client-side scripts
├── utils/             # WebSocket frame utilities
├── views/             # EJS templates
└── package.json       # Dependencies config
```

## WebSocket Implementation

### Key Components:
- **Handshake Handling**: Manual Sec-WebSocket-Accept key generation
- **Frame Parsing**: `parseWebSocketFrame` utility decodes incoming messages
- **Frame Creation**: `createWebSocketFrame` prepares WebSocket-compliant messages

### Flow:
1. Client connects via `ws://` URL
2. Server completes WebSocket handshake
3. Connection stored in memory using UUID
4. Incoming HTTP requests to webhook URL get forwarded via WebSocket

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push to branch (`git push origin feature/awesome`)
5. Open a Pull Request

## License

MIT License (see [LICENSE](LICENSE))

---

**Note**: This tool is intended for development/testing purposes. Do not use for production or sensitive data.