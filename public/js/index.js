// Webhook URL constant
var { hostname, pathname, port, protocol } = window.location;
const webhookURL = `${protocol}//${hostname}${
  port ? ":" + port : ""
}${pathname}`;

// Array to hold all logged requests
let requests = JSON.parse(window.localStorage.getItem("requests")) || [];
// let requests = [
//   {
//     "url": "/a08ef9df-d84b-4fae-be84-9d4ef6ae0d58",
//     "method": "POST",
//     "headers": {
//       "host": "localhost:3000",
//       "user-agent": "curl/7.81.0",
//       "accept": "*/*",
//       "content-type": "application/json",
//       "content-length": "26"
//     },
//     "body": {
//       "name": "Hello.....\\\\"
//     }
//   },
//   {
//     "url": "/a08ef9df-d84b-4fae-be84-9d4ef6ae0d58",
//     "method": "POST",
//     "headers": {
//       "host": "localhost:3000",
//       "user-agent": "curl/7.81.0",
//       "accept": "*/*",
//       "content-type": "application/json",
//       "content-length": "22"
//     },
//     "body": {
//       "name": "Hello....."
//     }
//   }
// ]

let selectedRequest = null;

/**
 * Logs a new request and updates the request history sidebar.
 * @param {Object[]} requests - The request data.
 */
function logRequest(requests) {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  requests.forEach((requestData, index) => {
    const entry = createRequestEntry(requestData, index);
    historyList.prepend(entry);
  });

  // Display the latest request by default
  if (requests.length > 0) {
    showDetails(requests[requests.length - 1]);
  }
}

/**
 * Creates a request entry element.
 * @param {Object} requestData - The request data.
 * @param {number} index - The index of the request.
 * @returns {HTMLElement} - The created entry element.
 */
function createRequestEntry(requestData, index) {
  const entry = document.createElement("div");
  entry.className = "log-entry";

  // Container for method label and request info
  const infoContainer = document.createElement("div");
  infoContainer.className = "entry-info";

  // Create request info text
  const textSpan = document.createElement("span");
  textSpan.textContent = ` # ${index+1}: ${requestData.url}`;
  infoContainer.appendChild(textSpan);

  // Create colored method label based on HTTP method
  const methodLabel = document.createElement("span");
  methodLabel.className =
    "method-label method-" + requestData.method.toUpperCase();
  methodLabel.textContent = requestData.method.toUpperCase();
  infoContainer.appendChild(methodLabel);

  entry.appendChild(infoContainer);

  // Individual delete button with basket (trash can) icon
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = "&#128465;"; // Trash can icon
  deleteBtn.title = "Delete";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this request?")) {
      deleteRequest(index);
    }
  });
  entry.appendChild(deleteBtn);

  // Click event to show details of this request
  entry.addEventListener("click", () => {
    showDetails(requestData);
  });

  return entry;
}

/**
 * Updates the Raw JSON and Table View sections with the selected request details.
 * @param {Object} requestData - The selected request.
 */
function showDetails(requestData) {
  selectedRequest = requestData;
  updateRawJsonDisplay(requestData);
  updateTableView(requestData);
}

/**
 * Updates the Raw JSON section.
 * @param {Object} requestData - The request data to display.
 */
function updateRawJsonDisplay(requestData) {
  document.getElementById("raw-json-display").textContent = JSON.stringify(
    requestData,
    null,
    2
  );
}

/**
 * Updates the Table View section.
 * @param {Object} requestData - The request data to display.
 */
function updateTableView(requestData) {
  const tbody = document.getElementById("json-table-body");
  tbody.innerHTML = "";

  for (const key in requestData) {
    if (requestData.hasOwnProperty(key)) {
      const row = document.createElement("tr");
      const cellKey = document.createElement("td");
      cellKey.textContent = key;
      const cellValue = document.createElement("td");
      let value = requestData[key];
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

/**
 * Deletes a request from the history.
 * @param {number|null} requestIndex - The index of the request to delete, or null to delete all.
 */
function deleteRequest(requestIndex = null) {
  if (requestIndex === null) {
    requests = [];
  } else {
    requests.splice(requestIndex, 1);
  }
  clearDetails();
  saveRequestsToLocalStorage();
  logRequest(requests);
}

/**
 * Clears the Raw JSON and Table View sections.
 */
function clearDetails() {
  document.getElementById("raw-json-display").textContent = "";
  document.getElementById("json-table-body").innerHTML = "";
  selectedRequest = null;
}

/**
 * Saves the requests array to localStorage.
 */
function saveRequestsToLocalStorage() {
  try {
    window.localStorage.setItem("requests", JSON.stringify(requests));
  } catch (error) {
    console.error("Failed to save requests to localStorage:", error);
  }
}

// Delete All functionality for the history
const deleteAllBtn = document.getElementById("delete-all-btn");
deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all requests?")) {
    deleteRequest();
  }
});

// Copy Webhook URL functionality (assumes a copy button with ID "copy-webhook-btn" exists)
const copyWebhookBtn = document.getElementById("copy-webhook-btn");
if (copyWebhookBtn) {
  copyWebhookBtn.addEventListener("click", () => {
    navigator.clipboard
      .writeText(webhookURL)
      .then(() => {
        alert("Webhook URL copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy: " + err);
      });
  });
}

// Simulate logging a POST request after a short delay
setTimeout(() => {
  logRequest(requests);
}, 1000);
