import { input } from "@material-tailwind/react";
import { Title } from "../Context";
import { useContext } from "react";
const a1 = document.getElementsByClassName("a1");
const back_arrow = document.getElementsByClassName("back-arrow");
const db_details = document.getElementsByClassName("db-details");
const inputs = document.getElementsByTagName("input");
var flag; //flag is a variable for identifying which source is choosen by the user. 0 for Postgree and 1 for OdooSH

export function OpenDropDown() {
  a1[0].classList.toggle("hidden");
  back_arrow[0].classList.toggle("rotate-180");
}

export function CheckClassName(element) {
  a1[0].classList.add("hidden");
  db_details[0].classList.remove("hidden");

  if (element.className.includes("Postgree")) {
    flag = 0;
  } else if (element.className.includes("Odoo")) {
    flag = 1;
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
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "") {
        alert("Fill in the complete fields before proceeding");
        return;
      }
    }
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
        alert(
          `Connected to source of database ${inputs[4].value} successfully`
        );
      } else {
        alert(`No database with name ${inputs[4].value}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`${inputs[4].value} database not found`);
    }
  } else if (flag === 1) {
    // Handle Odoo connection similarly
    const credentials = {
      source_name: inputs[0].value,
      source_type: "Odoo",
      username: inputs[1].value,
      port: inputs[2].value,
      host: inputs[3].value,
      database: inputs[4].value,
      password: inputs[5].value,
    };
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "") {
        alert("Fill in the complete fields before proceeding");
        return;
      }
    }
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
      console.log(data.success);

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

export async function InsertNewUser(isSource) {
  let credentials = null;

  credentials = {
    source_name: inputs[0].value,
    source_type: " ",
    username: inputs[1].value,
    port: inputs[2].value,
    host: inputs[3].value,
    database: inputs[4].value,
    password: inputs[5].value,
  };

  if (flag === 0) {
    credentials.source_type = "Postgres SQL";
  } else if (flag === 1) {
    credentials.source_type = "Odoo";
  }

  try {
    console.log("🔵 Sending request to backend...");
    const response = await fetch("http://localhost:5000/save-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
//
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      alert(`${inputs[0].value} added to ${isSource ? "sources" : "destinations"}`);

    } else {
      alert(
        `source with name ${inputs[0].value} or database ${inputs[4].value} already exists`
      );
    }
  } catch (error) {
    console.error("🚨 Error:", error.message);
    alert("An error occurred. Please try again.");
  }
}
