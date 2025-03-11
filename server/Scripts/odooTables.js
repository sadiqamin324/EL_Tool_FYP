import readline from 'readline';
import Odoo from 'odoo-xmlrpc';  // Importing the Odoo XML-RPC library

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to get user input dynamically
function getInput(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Odoo function to fetch tables
async function fetchOdooTables(url, port, db, username, password) {
  const OdooInstance = new Odoo({
    url: url,
    port: port,
    db: db,
    username: username,
    password: password
  });

  return new Promise((resolve, reject) => {
    OdooInstance.connect(function (err) {
      if (err) {
        reject(`❌ Odoo connection failed: ${err}`);
        return;
      }
      OdooInstance.execute_kw("ir.model", "search_read", [[[]], { fields: ["model"] }], function (err, result) {
        if (err) {
          reject(`❌ Error fetching Odoo tables: ${err}`);
          return;
        }
        const tables = result.map(entry => entry.model);
        resolve(tables);
      });
    });
  });
}

// Main function to get input from user and fetch tables
async function main() {
  // Get Odoo connection details dynamically
  const url = await getInput("Enter Odoo URL (e.g., http://localhost): ");
  const port = await getInput("Enter Odoo Port (default: 8069): ");
  const db = await getInput("Enter Odoo Database Name: ");
  const username = await getInput("Enter Odoo Username: ");
  const password = await getInput("Enter Odoo Password: ");

  // Fetch Odoo tables
  try {
    const tables = await fetchOdooTables(url, port, db, username, password);
    console.log("✅ Odoo Tables:", tables);
  } catch (error) {
    console.error("❌ Error:", error);
  }

  // Close the readline interface
  rl.close();
}

// Run the main function
main().catch((error) => {
  console.error("Error in main execution:", error);
  rl.close();
});


