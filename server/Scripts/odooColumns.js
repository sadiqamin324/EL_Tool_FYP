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

// Odoo function to fetch columns for a specific table
async function fetchOdooColumns(url, port, db, username, password, tableName) {
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
      OdooInstance.execute_kw(
        "ir.model.fields",
        "search_read",
        [[[["model", "=", tableName]]], { fields: ["name", "ttype"] }],
        function (err, result) {
          if (err) {
            reject(`❌ Error fetching columns for ${tableName}: ${err}`);
            return;
          }
          const columns = result.map(col => ({ name: col.name, type: col.ttype }));
          resolve(columns);
        }
      );
    });
  });
}

// Main function to get input from user and fetch columns
async function main() {
  // Get Odoo connection details dynamically
  const url = await getInput("Enter Odoo URL (e.g., http://localhost): ");
  const port = await getInput("Enter Odoo Port (default: 8069): ");
  const db = await getInput("Enter Odoo Database Name: ");
  const username = await getInput("Enter Odoo Username: ");
  const password = await getInput("Enter Odoo Password: ");
  const tableName = await getInput("Enter the table name to fetch columns: ");

  // Fetch Odoo columns for the specified table
  try {
    const columns = await fetchOdooColumns(url, port, db, username, password, tableName);
    console.log(`✅ Columns in ${tableName}:`, columns);
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

