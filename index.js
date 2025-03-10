const express = require("express");
const http = require("http");
const crypto = require("crypto");
const path = require("path");
const { createWebSocketFrame, parseWebSocketFrame } = require("./utils/socket.util");

const app = express();
const server = http.createServer(app);
const clients = new Map(); // Store WebSocket connections

// Middleware
app.set("view engine", "ejs");
app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  const id = crypto.randomUUID();
  return res.redirect(`/${id}`);
});

app.get("/:id", (req, res) => {
  return res.render("index", {
    wsUri: "ws://" + req.get("host") + req.originalUrl,
  });
});

app.post("/:id", (req, res) => {
  const id = req.params.id;
  const socket = clients.get(id);

  if (!socket) {
    return res.status(404).json({ error: "Client not found" });
  }

  const requestData = {
    url: req.originalUrl,
    method: req.method,
    headers: req.headers,
    body: req.body,
  };

  const message = JSON.stringify({
    data: requestData,
    event: "requestData",
  });

  const frame = createWebSocketFrame(message);
  socket.write(frame);

  console.log("Request data sent to client:", requestData);
  res.status(200).json({ data: null });
});

// WebSocket Upgrade Handler
server.on("upgrade", (req, socket, head) => {
  const clientId = req.url.slice(1); // Extract ID from URL path
  const key = req.headers["sec-websocket-key"];

  if (!key || !clientId) {
    socket.destroy();
    return;
  }

  // Generate WebSocket accept key
  const acceptKey = crypto
    .createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64");

  // Complete WebSocket handshake
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`
  );

  // Store WebSocket connection
  clients.set(clientId, socket);
  console.log(`Client connected: ${clientId}`);

  // Handle WebSocket messages
  socket.on("data", (data) => {
    try {
      const message = parseWebSocketFrame(data);
      console.log("Received from client:", message);

      // Send a response back to the client
      const response = createWebSocketFrame(`You said: ${message}`);
      socket.write(response);
    } catch (error) {
      console.error("Error parsing WebSocket frame:", error);
    }
  });

  // Handle client disconnection
  socket.on("close", () => {
    clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  });

  // Handle socket errors
  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(clientId);
    socket.destroy();
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});