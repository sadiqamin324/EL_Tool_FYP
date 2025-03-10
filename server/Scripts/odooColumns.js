const Odoo = require('odoo-xmlrpc');

// Odoo connection details
const odooConfig = {
    url: "http://localhost",
    port: 8069,
    db: "NEDUniversity-7",
    username: "admin",
    password: "admin"
};

// Initialize Odoo connection
const OdooInstance = new Odoo(odooConfig);

console.log("🔄 Connecting to Odoo...");

OdooInstance.connect(function (err) {
    if (err) {
        console.error("❌ Odoo connection failed:", err);
        return;
    }
    console.log("✅ Connected to Odoo!");

    const tableName = "account.account"; // Change this to any Odoo model
    fetchOdooColumns(tableName);
});

// Function to fetch columns for a given table
function fetchOdooColumns(tableName) {
    console.log(`📄 Fetching columns for table: ${tableName}...`);

    OdooInstance.execute_kw(
        "ir.model.fields",
        "search_read",
        [[[["model", "=", tableName]]], { fields: ["name", "ttype"] }],
        function (err, result) {
            if (err) {
                console.error(`❌ Error fetching columns for ${tableName}:`, err);
                return;
            }

            console.log(`✅ Columns in ${tableName}:`, result.map(col => ({ name: col.name, type: col.ttype })));
        }
    );
}
