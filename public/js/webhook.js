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
      window.location.reload()
      break;
    default:
      break;
  }
};

websocket.onerror = (e) => {
  console.log(e);
};