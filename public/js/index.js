// Array to hold all logged requests
let requests = JSON.parse(window.localStorage.getItem("requests")) ?? [];

/**
 * Logs a new request and updates the request history sidebar.
 * @param {Object} requestData - The request data.
 */
function logRequest(requests) {
  const historyList = document.getElementById("history-list");
  requests.forEach((requestData, i)=>{
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.textContent = `Request ${i+1}: ${requestData.method} ${requestData.url}`;
    entry.addEventListener("click", () => showDetails(requestData));
    historyList.prepend(entry);
  })

  // Display the first logged request by default.
  showDetails(requests[0]);
}

/**
 * Updates the Raw JSON and Table View sections with the selected request details.
 * @param {Object} requestData - The selected request.
 */
function showDetails(requestData) {
  // Update Raw JSON section
  document.getElementById("raw-json-display").textContent = JSON.stringify(
    requestData,
    null,
    2
  );

  // Update Table View section
  const tbody = document.getElementById("json-table-body");
  tbody.innerHTML = ""; // Clear previous content

  for (const key in requestData) {
    if (requestData.hasOwnProperty(key)) {
      const row = document.createElement("tr");
      const cellKey = document.createElement("td");
      cellKey.textContent = key;
      const cellValue = document.createElement("td");
      let value = requestData[key];
      // Convert object values to string
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      cellValue.textContent = value;
      row.appendChild(cellKey);
      row.appendChild(cellValue);
      tbody.appendChild(row);
    }
  }
}

// Simulate logging a POST request after a short delay
setTimeout(() => {
  logRequest(requests);
}, 1000);
