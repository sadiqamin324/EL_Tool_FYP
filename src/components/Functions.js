export function ClearTicked(set_Index, set_tick_box) {
  set_Index(new Set()); // Reset selected checkboxes
  set_tick_box(0); // Reset counter
}

export function toggleSelection(index, set_Index, set_tick_box) {
  set_Index((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(index)) {
      newSet.delete(index); // Uncheck
    } else {
      newSet.clear();
      newSet.add(index); // Check
    }
    set_tick_box(newSet.size);

    return newSet;
  });
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

// export function compareRecords(array1, array2, keyFields) {
//   const getKey = (record) => keyFields.map(k => record[k]).join('|');
//   const getPrimaryKeyObject = (record) => {
//     const obj = {};
//     for (const k of keyFields) {
//       obj[k] = record[k];
//     }
//     return obj;
//   };

//   const map1 = new Map(array1.map(record => [getKey(record), record]));
//   const map2 = new Map(array2.map(record => [getKey(record), record]));

//   const mismatches = [];

//   for (const [key, record1] of map1.entries()) {
//     const record2 = map2.get(key);
//     if (!record2) continue;

//     const keys = new Set([
//       ...Object.keys(record1).filter(k => !keyFields.includes(k)),
//       ...Object.keys(record2).filter(k => !keyFields.includes(k)),
//     ]);

//     let isDifferent = false;
//     for (const k of keys) {
//       const val1 = record1[k];
//       const val2 = record2[k];

//       const isDate1 = val1 instanceof Date;
//       const isDate2 = val2 instanceof Date;

//       if (isDate1 && isDate2) {
//         if (val1.getTime() !== val2.getTime()) {
//           isDifferent = true;
//           break;
//         }
//       } else if (val1 !== val2) {
//         isDifferent = true;
//         break;
//       }
//     }

//     if (isDifferent) {
//       mismatches.push({
//         primaryKeys: getPrimaryKeyObject(record1),
//         record1,
//         record2
//       });
//     }
//   }

//   return mismatches;
// }

export function compareRecords(array1, array2, keyFields) {
  const getKey = (record) => keyFields.map(k => record[k]).join('|');

  const getPrimaryKeyObject = (record) => {
    const obj = {};
    for (const k of keyFields) {
      obj[k] = record[k];
    }
    return obj;
  };

  // Deep comparison with normalized UTC date handling
  const deepEqual = (val1, val2) => {
    // Handle null/undefined
    if (val1 == null || val2 == null) {
      return val1 === val2;
    }

    // Identify if either is a date or date-like string
    const isDateLike = (v) =>
      v instanceof Date ||
      (typeof v === 'string' &&
        /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})/.test(v));

    if (isDateLike(val1) && isDateLike(val2)) {
      const normalizeDate = (v) => {
        if (typeof v === 'string') {
          // Convert 'YYYY-MM-DD HH:mm:ss' -> 'YYYY-MM-DDTHH:mm:ssZ'
          const iso = v.includes(' ') ? v.replace(' ', 'T') + 'Z' : v;
          return new Date(iso);
        }
        return new Date(v);
      };

      const d1 = normalizeDate(val1);
      const d2 = normalizeDate(val2);

      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        return d1.getTime() === d2.getTime(); // Compare as timestamps
      }
    }

    // Array comparison
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      return val1.every((item, i) => deepEqual(item, val2[i]));
    }

    // Object comparison
    if (typeof val1 === 'object' && typeof val2 === 'object') {
      const keys1 = Object.keys(val1);
      const keys2 = Object.keys(val2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every(key => deepEqual(val1[key], val2[key]));
    }

    // Fallback strict equality
    return val1 === val2;
  };

  const map1 = new Map(array1.map(record => [getKey(record), record]));
  const map2 = new Map(array2.map(record => [getKey(record), record]));

  const mismatches = [];

  for (const [key, record1] of map1.entries()) {
    const record2 = map2.get(key);
    if (!record2) continue;

    const keys = new Set([
      ...Object.keys(record1).filter(k => !keyFields.includes(k)),
      ...Object.keys(record2).filter(k => !keyFields.includes(k)),
    ]);

    const differences = {};
    const differentFields = [];

    for (const k of keys) {
      const val1 = record1[k];
      const val2 = record2[k];

      if (!deepEqual(val1, val2)) {
        differences[k] = {
          record1: val1,
          record2: val2
        };
        differentFields.push(k);
      }
    }

    if (Object.keys(differences).length > 0) {
      mismatches.push({
        primaryKeys: getPrimaryKeyObject(record1),
        differences,
        differentFields,
        record1,
        record2
      });
    }
  }

  return mismatches;
}
