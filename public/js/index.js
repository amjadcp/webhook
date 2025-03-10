// Array to hold all logged requests
let requests = JSON.parse(window.localStorage.getItem("requests")) ?? [];
let selectedRequest = null;
// let requests = [
//   {
//     url: "/9aa57324-a50a-4f0d-aca5-0f84b83c0f2b",
//     method: "POST",
//     headers: {
//       host: "localhost:3000",
//       "user-agent": "curl/7.81.0",
//       accept: "*/*",
//       "content-type": "application/json",
//       "content-length": "22",
//     },
//     body: {
//       name: "Hello.....",
//     },
//   },
//   {
//     url: "/9aa57324-a50a-4f0d-aca5-0f84b83c0f2b",
//     method: "GET",
//     headers: {
//       host: "localhost:3000",
//       "user-agent": "curl/7.81.0",
//       accept: "*/*",
//       "content-type": "application/json",
//       "content-length": "22",
//     },
//     body: {
//       name: "Hello.....",
//     },
//   },
// ];
/**
 * Logs a new request and updates the request history sidebar.
 * @param {Object[]} requests - The request data.
 * Each entry includes a delete button to remove the request.
 */
function logRequest(requests) {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";
  // Loop over requests and create an entry for each
  requests.forEach((requestData, index) => {
    const entry = document.createElement("div");
    entry.className = "log-entry";

    // Label for the request
    const label = document.createElement("span");
    label.textContent = `Request ${index + 1}: ${requestData.method} ${
      requestData.url
    }`;
    entry.appendChild(label);

    // Delete button for this request
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering the entry's click event
      if (confirm("Are you sure you want to delete this request?")) {
        deleteRequest(index)
      }
    });

    entry.appendChild(deleteBtn);
    // Click event to show details of this request
    entry.addEventListener("click", () => {
      showDetails(requestData);
    });

    // Prepend so that the latest requests appear at the top
    historyList.prepend(entry);
  });

  // Display the first logged request by default.
  showDetails(requests.slice(-1)[0]);
}

/**
 * Updates the Raw JSON and Table View sections with the selected request details.
 * @param {Object} requestData - The selected request.
 */
function showDetails(requestData) {
  selectedRequest = requestData
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

/**
 * Delete the request form the history
 * Clears the Raw JSON and Table View sections.
 */
const deleteRequest = (requestIndex=null) => {
  // delete all requests
  if(requestIndex===null){
    requests = []
  }else{ // delete particular requestData
    requests.splice(requestIndex, 1);
  }

  // clear the details
  document.getElementById("raw-json-display").textContent = "";
  document.getElementById("json-table-body").innerHTML = "";
  selectedRequest = null;

  // update the local storage
  window.localStorage.setItem("requests", JSON.stringify(requests));

  logRequest(requests);
};


// Simulate logging a POST request after a short delay
setTimeout(() => {
  logRequest(requests);
}, 1000);

// Delete All functionality for the history
const deleteAllBtn = document.getElementById("delete-all-btn");
deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all requests?")) {
    deleteRequest();
  }
});