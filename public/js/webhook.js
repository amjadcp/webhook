const { hostname, pathname, port } = window.location;
const wsUri = `ws://${hostname}:${port}${pathname}`;
const websocket = new WebSocket(wsUri);

function sendMessage(message) {
  websocket.send(message);
}

websocket.onopen = (e) => {
  sendMessage("ping");
  //   pingInterval = setInterval(() => {
  //     sendMessage("ping");
  //   }, 1000);
};

websocket.onclose = (e) => {
  // clearInterval(pingInterval);
};

websocket.onmessage = (e) => {
  console.log(e);
  
  const { event, data } = JSON.parse(e.data);

  switch (event) {
    case "requestData":
      const requests =
        JSON.parse(window.localStorage.getItem("requests")) ?? [];
      requests.push(data);
      window.localStorage.setItem("requests", JSON.stringify(requests));
      break;
    default:
      break;
  }
};

websocket.onerror = (e) => {
  console.log(e);
};

// window.localStorage.setItem(
//   "requests",
//   JSON.stringify([
//     {
//       url: "/webhook",
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "User-Agent": "WebhookTester/1.0",
//       },
//       body: {
//         message: "Hello, webhook!",
//         timestamp: new Date().toISOString(),
//       },
//     },
//     {
//       url: "/webhook2",
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "User-Agent": "WebhookTester/1.0",
//       },
//       body: {
//         message: "Hello, webhook?????",
//         timestamp: new Date().toISOString(),
//       },
//     },
//   ])
// );
