import { Sequelize } from 'sequelize'; // Import Sequelize
import 'dotenv/config'; // Load environment variables
import { Postgree_Credentials } from "../../../server/index.js"


const Postgree_credentials = [
  "User Name",
  "Port",
  "Host",
  "Database Name",
  "Password",
];

// Initialize Sequelize with database configuration
// const sequelize = new Sequelize(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'postgres', // Specify the database dialect
//   port: process.env.DB_PORT,
//   logging: false, // Disable query logging (optional)
// });

// const sequelize = new Sequelize(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'postgres', // Specify the database dialect
//   port: process.env.DB_PORT,
//   logging: false, // Disable query logging (optional)
// });

const sequelize = new Sequelize(Postgree_Credentials[2], Postgree_Credentials[0], Postgree_Credentials[4], {
  host: Postgree_Credentials[2],
  dialect: 'postgres', // Specify the database dialect
  port: Postgree_Credentials[1],
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
