const a1 = document.getElementsByClassName("a1");
const back_arrow = document.getElementsByClassName("back-arrow");
const db_details = document.getElementsByClassName("db-details");
const inputs = document.getElementsByTagName("input");
var flag; //flag is a variable for identifying which source is choosen by the user. 0 for Postgree and 1 for OdooSH

const Postgree_credentials = [
  "Source_name",
  "User Name",
  "Port",
  "Host",
  "Database Name",
  "Password",
];

const OdooSh_credentials = [
  "Source_name",
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
  } else if (element.className.includes("Odoo")) {
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

  if (flag === 0) {
    const credentials = {
      source_name: inputs[0].value,
      source_type: "Postgres SQL",
      username: inputs[1].value,
      port: inputs[2].value,
      host: inputs[3].value,
      database: inputs[4].value,
      password: inputs[5].value,
    };

    try {
      const response = await fetch("http://localhost:5000/connect-Postgree", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      console.log("🔵 Sending request to backend...");

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
    // Handle Odoo connection similarly
    const credentials = {
      source_name: inputs[0].value,
      source_type: "Odoo",
      username: inputs[1].value,
      port: inputs[2].value,
      server: inputs[3].value,
      database: inputs[4].value,
      password: inputs[5].value,
    };

    try {
      const response = await fetch("http://localhost:5000/connect-Odoo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      console.log("🔵 Sending request to backend...");

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
  }
}
