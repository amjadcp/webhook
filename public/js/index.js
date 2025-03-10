// Array to hold all logged requests
let requests = JSON.parse(window.localStorage.getItem("requests")) || [];
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

  const label = document.createElement("span");
  label.textContent = `Request ${index + 1}: ${requestData.method} ${requestData.url}`;
  entry.appendChild(label);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this request?")) {
      deleteRequest(index);
    }
  });

  entry.appendChild(deleteBtn);
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
  document.getElementById("raw-json-display").textContent = JSON.stringify(requestData, null, 2);
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

// Simulate logging a POST request after a short delay
setTimeout(() => {
  logRequest(requests);
}, 1000);