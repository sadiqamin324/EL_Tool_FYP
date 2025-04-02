export function ClearTicked(set_Index, set_tick_box, session_storage_item) {
  set_Index(new Set()); // Reset selected checkboxes
  set_tick_box(0); // Reset counter
  sessionStorage.removeItem(session_storage_item); // Remove from storage
}

export function toggleSelection(
  index,
  set_Index,
  set_tick_box,
  session_storage_item
) {
  set_Index((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(index)) {
      newSet.delete(index); // Uncheck
    } else {
      newSet.add(index); // Check
    }
    set_tick_box(newSet.size);

    // Save to sessionStorage
    sessionStorage.setItem(session_storage_item, JSON.stringify([...newSet]));

    return newSet;
  });
}

export function Track_ticked(set_Index, set_tick_box, session_storage_item) {
  const storedSelections = sessionStorage.getItem(session_storage_item);

  if (storedSelections) {
    const parsedSelections = JSON.parse(storedSelections);
    set_Index(new Set(parsedSelections));
    set_tick_box(parsedSelections.length); // Ensure buttons update
  }
}

const errorMessages = {
  400: "Bad Request - Please check the data you sent.",
  401: "Unauthorized - You need to log in to access this resource.",
  403: "Forbidden - You do not have permission to access this resource.",
  404: "Not Found - The resource you are looking for does not exist.",
  413: "Payload Too Large - The data you are trying to send is too large.",
  500: "Internal Server Error - Something went wrong on our end. Please try again later.",
  502: "Bad Gateway - The server is unavailable. Try again later.",
  503: "Service Unavailable - The service is temporarily unavailable.",
  504: "Gateway Timeout - The server took too long to respond.",
  // Add other status codes as necessary
};

// Centralized error handler function
export function handleError(error) {
  if (error.response) {
    // Server responded with a status code outside of the range 2xx
    const errorMessage =
      errorMessages[error.response.status] || "An unknown error occurred";
    alert(errorMessage);
    console.error(`Error ${error.response.status}: ${errorMessage}`);
  } else if (error.request) {
    // The request was made but no response was received
    alert("No response from the server. Please check your network connection.");
    console.error("No response from the server:", error.request);
  } else {
    // Something happened while setting up the request
    alert("There was an error setting up the request.");
    console.error("Error:", error.message);
  }
}
