import { Sequelize } from 'sequelize'; // Import Sequelize
import 'dotenv/config'; // Load environment variables

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres', // Specify the database dialect
  port: process.env.DB_PORT,
  logging: false, // Disable query logging (optional)
});

// A function to test and establish the connection
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log('Connected to PostgreSQL database using Sequelize!');
  } catch (error) {
    console.error('Error connecting to PostgreSQL with Sequelize:', error);
    process.exit(1); // Exit process if connection fails
  }
};

export { sequelize, connectToDatabase };
