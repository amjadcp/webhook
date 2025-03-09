const express = require("express");
const http = require("http");
const crypto = require("crypto");
const { createWebSocketFrame, parseWebSocketFrame } = require("./utils/socket.util");
const { log } = require("console");
const { decode } = require("querystring");

const app = express();
app.set("view engine", "ejs");

const clients = new Map();

app.use(
  express.json({
    type: ["application/json", "text/plain"],
  }),
);
app.use(express.urlencoded({ extended: true }));

app.get("/:id", (req, res) => {
  log(req.protocol + "://" + req.get("host") + req.originalUrl);
  res.render("index", { wsUri: "ws://" + req.get("host") + req.originalUrl });
});

app.post("/:id", (req, res) => {
  const id = req.params.id;
  const socket = clients.get(id);
  const message = JSON.stringify(req.body);
  const frame = createWebSocketFrame(message);

  if (socket) socket.write(frame);
  res.status(200).json({ data: null });
});

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
  const clientId = req.url.slice(1); // Extract ID from URL path
  const key = req.headers["sec-websocket-key"];

  if (!key) {
    socket.destroy();
    return;
  }

  // Generate accept key
  const acceptKey = crypto
    .createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64");

  // Complete handshake
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`,
  );

  // Store WebSocket connection
  clients.set(clientId, socket);

  // Handle WebSocket messages
  socket.on("data", (data) => {
    const message = parseWebSocketFrame(data)
    console.log("Received:", message);
    // Send response using proper WebSocket framing
    const response = createWebSocketFrame(`You said: ${message}`);
    log(response)
    socket.write(response);
  });

  // Cleanup on disconnect
  socket.on("close", () => {
    clients.delete(clientId);
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
