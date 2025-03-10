var { hostname, pathname, port } = window.location;

// Construct WebSocket URI
const wsUri = `ws://${hostname}${port ? ":" + port : ""}${pathname}`;
let websocket;

// Initialize WebSocket connection
function initializeWebSocket() {
  try {
    websocket = new WebSocket(wsUri);

    websocket.onopen = handleWebSocketOpen;
    websocket.onclose = handleWebSocketClose;
    websocket.onmessage = handleWebSocketMessage;
    websocket.onerror = handleWebSocketError;
  } catch (error) {
    console.error("Failed to initialize WebSocket:", error);
  }
}

// Handle WebSocket open event
function handleWebSocketOpen(event) {
  console.log("WebSocket connection established.");
  sendMessage("ping");

  // Uncomment to enable periodic ping
  // pingInterval = setInterval(() => sendMessage("ping"), 1000);
}

// Handle WebSocket close event
function handleWebSocketClose(event) {
  console.log("WebSocket connection closed.");
  // clearInterval(pingInterval);
}

// Handle WebSocket message event
function handleWebSocketMessage(event) {
  try {
    const message = JSON.parse(event.data);
    const { event: eventType, data } = message;

    switch (eventType) {
      case "requestData":
        handleRequestData(data);
        break;
      default:
        console.warn("Unknown event type received:", eventType);
        break;
    }
  } catch (error) {
    console.error("Failed to parse WebSocket message:", error);
  }
}

// Handle WebSocket error event
function handleWebSocketError(event) {
  console.error("WebSocket error:", event);
}

// Send a message over the WebSocket
function sendMessage(message) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(message);
  } else {
    console.warn("WebSocket is not open. Message not sent:", message);
  }
}

// Handle incoming request data
function handleRequestData(data) {
  try {
    const requests = JSON.parse(window.localStorage.getItem("requests")) || [];
    requests.push(data);
    window.localStorage.setItem("requests", JSON.stringify(requests));

    // Reload the page to reflect changes
    window.location.reload();
  } catch (error) {
    console.error("Failed to handle request data:", error);
  }
}

// Initialize WebSocket connection when the script loads
initializeWebSocket();