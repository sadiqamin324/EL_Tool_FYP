const sql = require('mssql');

// Configuration for the database connection
const config = {
    server: 'tds.cdata.com', // CData Connect Cloud TDS endpoint
    port: 14333, // TDS port
    user: 'salman4403784@cloud.neduet.edu.pk', // Your Connect Cloud user
    password: 'FE9tSQep5+gtwtVw8jwQiwiA7NqI0QEJWfIueNfTAJyC3uYr', // Your Connect Cloud PAT
    options: {
        encrypt: true, // Ensures secure connection
        database: 'Odoo1', // Logical database name in CData Connect Cloud
        requestTimeout: 60000, // Increase query timeout to 60 seconds
        connectionTimeout: 60000, // Increase connection timeout to 60 seconds
    },
    pool: {
        max: 10, // Maximum number of connections
        min: 0, // Minimum number of connections
        idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    },
};

// Function to execute a query with retry logic
const retryQuery = async (query, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Executing query (Attempt ${attempt}): ${query}`);
            const result = await new sql.Request().query(query);
            return result;
        } catch (err) {
            console.error(`Attempt ${attempt} failed:`, err);
            if (attempt === retries) throw err;
        }
    }
};

// Main function to connect to the database and execute queries
const main = async () => {
    try {
        console.log('Connecting to the database...');
        await sql.connect(config);
        console.log('Connected to the database.');

        // Execute a test query
        const query = 'SELECT TOP 1 * FROM res_users';
        const result = await retryQuery(query);
        console.log('Query Result:', result);

        // Close the database connection
        await sql.close();
        console.log('Connection closed.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        sql.on('error', (err) => {
            console.error('SQL Error:', err);
        });
    }
};

// Run the main function
main();

