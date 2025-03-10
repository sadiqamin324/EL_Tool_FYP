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
    fetchOdooTables();
});

// Function to fetch all tables
function fetchOdooTables() {
    console.log("📂 Fetching Odoo tables...");

    OdooInstance.execute_kw("ir.model", "search_read", [[[]], { fields: ["model"] }], function (err, result) {
        if (err) {
            console.error("❌ Error fetching Odoo tables:", err);
            return;
        }

        const tables = result.map(entry => entry.model);
        console.log("✅ Odoo Tables:", tables);
    });
}
