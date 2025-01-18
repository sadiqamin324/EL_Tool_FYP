import 'dotenv/config'; // Shorter way to load environment variables
import pkg from 'pg';

const { Client } = pkg; // Destructure Client from the CommonJS export

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// A function to initialize the connection
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database!');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.stack);
    process.exit(1); // Exit process if database connection fails
  }
};

export { client, connectToDatabase };
