require('dotenv').config({ path: './.env' });
var sql = require('mssql');

// Log environment variables to ensure they are loaded correctly
console.log('Environment Variables:');
console.log('SERVER:', process.env.SERVER);
console.log('PORT:', process.env.PORT);
console.log('USER:', process.env.USER);
console.log('PASSWORD:', process.env.PASSWORD);
console.log('DATABASE:', process.env.DATABASE);

var config = {
    server: process.env.SERVER,
    port: parseInt(process.env.PORT),
    user: process.env.USER,
    password: process.env.PASSWORD,
    options: {
        encrypt: true,
        database: process.env.DATABASE
    }
};

console.log('Attempting to connect to the database...');

sql.connect(config, err => { 
    if(err){
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to the database successfully.');

    new sql.Request().query('SELECT * FROM res_users', (err, result) => {
        if(err){
            console.error('Query failed:', err);
            return;
        }
        console.dir(result);
    });
});