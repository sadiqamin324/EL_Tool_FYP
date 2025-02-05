// const a1 = document.getElementsByClassName("a1");
// const back_arrow = document.getElementsByClassName("back-arrow");
// const db_details = document.getElementsByClassName("db-details");
// const inputs = document.getElementsByTagName("input");
// var flag; //flag is a variable for identifying which source is choosen by the user. 0 for Postgree and 1 for OdooSH

// const Postgree_credentials = [
//   "User Name",
//   "Port",
//   "Host",
//   "Database Name",
//   "Password",
// ];

// const OdooSh_credentials = [
//   "Server",
//   "Port",
//   "User Name",
//   "Password",
//   "Database Name",
// ];

// export function OpenDropDown() {
//   a1[0].classList.toggle("hidden");
//   back_arrow[0].classList.toggle("rotate-180");
// }

// export function CheckClassName(element) {
//   a1[0].classList.add("hidden");
//   db_details[0].classList.remove("hidden");
//   if (element.className.includes("Postgree")) {
//     flag = 0;
    
//     for (let i = 0; i < inputs.length; i++) {
//       inputs[i].placeholder = Postgree_credentials[i];
//     }
//   } else if (element.className.includes("OdooSH")) {
//     flag = 1;
    
//     for (let i = 0; i < inputs.length; i++) {
//       inputs[i].placeholder = OdooSh_credentials[i];
//     }
//   }

//   // } else if (element.className.includes("blue")) {
//   //     console.log("The clicked box is blue!");
//   // } else if (element.className.includes("green")) {
//   //     console.log("The clicked box is green!");
//   // }
// }

// export function MouseOver() {
//   event.target.classList.add("bg-gray-300");
// }

// export function MouseLeave() {
//   event.target.classList.remove("bg-gray-300");
// }

// export function MouseOverRed() {
//   event.target.classList.add("bg-red-200");
// }

// export function MouseLeaveRed() {
//   event.target.classList.remove("bg-red-200");
// }

// export function EmptyInput() {
//   for (let i = 0; i < inputs.length; i++) {
//     inputs[i].value = ""; // Set the value to an empty string
//   }
// }

// export async function HandleClick() {
//   console.log("🔵 Sending request to backend...");
//   if (flag == 0) {
//     try {
//       const response = await fetch("http://localhost:5000/connect-Postgree", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       alert("connected")
      

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       alert("chala")
//       const data = await response.json();

//       if (data.success) {
//         alert(`Database connected successfully! Time: ${data.time}`);
//       } else {
//         alert("Database connection failed.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to connect to the database.");
//     }
//   } else if (flag == 1) {
//     try {
//       const response = await fetch("http://localhost:5000/connect-OdooSH", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();

//       if (data.success) {
//         alert(`Database connected successfully! Time: ${data.time}`);
//       } else {
//         alert("Database connection failed.");
//       }
//     } catch (error) {
//       console.log("Error:", error);
//       alert("Failed to connect to the database.");
//     }
//   }
// }
const a1 = document.getElementsByClassName("a1");
const back_arrow = document.getElementsByClassName("back-arrow");
const db_details = document.getElementsByClassName("db-details");
const inputs = document.getElementsByTagName("input");
var flag; //flag is a variable for identifying which source is choosen by the user. 0 for Postgree and 1 for OdooSH

const Postgree_credentials = [
  "User Name",
  "Port",
  "Host",
  "Database Name",
  "Password",
];

const OdooSh_credentials = [
  "User Name",
  "Port",
  "Server",
  "Database Name",
  "Password",
];

export function OpenDropDown() {
  a1[0].classList.toggle("hidden");
  back_arrow[0].classList.toggle("rotate-180");
}

export function CheckClassName(element) {
  a1[0].classList.add("hidden");
  db_details[0].classList.remove("hidden");
  if (element.className.includes("Postgree")) {
    flag = 0;

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].placeholder = Postgree_credentials[i];
    }
  } else if (element.className.includes("OdooSH")) {
    flag = 1;

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].placeholder = OdooSh_credentials[i];
    }
  }
}

export function MouseOver() {
  event.target.classList.add("bg-gray-300");
}

export function MouseLeave() {
  event.target.classList.remove("bg-gray-300");
}

export function MouseOverRed() {
  event.target.classList.add("bg-red-200");
}

export function MouseLeaveRed() {
  event.target.classList.remove("bg-red-200");
}

export function EmptyInput() {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = ""; // Set the value to an empty string
  }
}

export async function HandleClick() {
  let data2 = {}; // Object to store input values

  // Loop through all inputs and store name-value pairs in 'data2' object
  for (let i = 0; i < inputs.length; i++) {
    data2[i] = inputs[i].value;
  }
  
  console.log("🔵 Sending request to backend...");
  if (flag === 0) {
    const credentials = {
      username: inputs[0].value,
      port: inputs[1].value,
      host: inputs[2].value,
      database: inputs[3].value,
      password: inputs[4].value,
    };

    try {
      const response = await fetch("http://localhost:5000/connect-Postgree", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        alert(`Database connected successfully! Message: ${data.message}`);
      } else {
        alert("Database connection failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the database.");
    }
  } else if (flag === 1) {
    // Handle OdooSH connection similarly
  }
}