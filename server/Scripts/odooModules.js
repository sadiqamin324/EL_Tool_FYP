import readline from "readline";
import Odoo from "odoo-xmlrpc"; // Importing the Odoo XML-RPC library

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get user input dynamically
function getInput(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Odoo function to fetch tables
export async function fetchOdooModules(url, port, db, username, password) {
  const OdooInstance = new Odoo({
    url: url,
    port: port,
    db: db,
    username: username,
    password: password,
  });

  return new Promise((resolve, reject) => {
    OdooInstance.connect(function (err) {
      if (err) {
        console.error("❌ Odoo connection failed:", err); // Print full error
        reject(`❌ Odoo connection failed: ${JSON.stringify(err)}`);
        return;
      }
      OdooInstance.execute_kw(
        "ir.module.module",
        "search_read",
        [[], { fields: ["name", "state"] }], // Fetch all modules
        function (err, result) {
          if (err) {
            reject(`❌ Error fetching Odoo modules: ${err}`);
            return;
          }
          console.log("✅ All Modules:", result);
          resolve({ database: db, modules: result });
        }
      );
    });
  });
}
