
// import { initializeDatabase } from './db/index.js';
// import { registerUser } from './src/controller/user.controller.js';
// import { initializeUserModel, User } from './src/model/user.model.js';
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import {   initializeDatabase } from './src/db/index.js';// Adjust the path as needed
// import main from '../odoo-node-connection/index.js';
// dotenv.config();
// const app = express();
// app.use(express.json());
// const PORT = process.env.PORT || 5000;
// app.use(cors()); // Enable CORS for all routes

// Load environment variables
// dotenv.config({
//   path: "backend/.env", // Corrected path to .env file
// });

// Connect to the database
// connectToDatabase()
//   .then(() => {
//     // Start the server only if the database connection is successful
//     alert('safee');
//   })
//   .catch((err) => {
//     // Handle database connection failure
//     console.log("Database connection failed!!!", err);
//   });
// Define the route to connect to the database
// app.get("/", (req, res) => {
//   res.json("Assalam O Alaikum Brothers!");
// });

// app.post("/connect-Postgree", async (req, res) => {
//   console.log("In process of connecting to database....");
//   const result = await connectToDatabase(); // Call the connection function
//   res.json(result); // Send the connection status to the frontend
//   console.log("Successfully connected to Postgree SQl");
// });

// import { initializeDatabase } from './src/db/index.js'; // Adjust the import path as needed



// Middleware
// app.use(cors());
// app.use(express.json()); // Parse JSON request bodies
// 
import express from "express";
import sequelize from "./src/db/index.js"; // Ensure the path is correct
import User from "./src/model/user.model.js"; // Ensure the path is correct

const app = express();
app.use(express.json()); // Middleware to parse JSON data

// Sync database and create a sample user
(async () => {
  await sequelize.sync({ force: true }); // Drops & recreates tables (use with caution)
  console.log("✅ Database synced.");

  // Create a sample user
  await User.create({ name: "John Doe", email: "johndoe@example.com" });
})();

// Route to get all users
app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Start the server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});



// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });
// Start the server


// Route to connect to PostgreSQL
// app.post('/connect-Postgree', async (req, res) => {
//   console.log('In process of connecting to database....');

//   try {
//     // Pass the request body (database config) to initializeDatabase
//     await initializeDatabase(req.body);

//     console.log('Successfully connected to PostgreSQL');
//     res.json({
//       success: true,
//       message: 'Connection established successfully',
//     });
//   } catch (err) {
//     console.error('Connection failed:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Connection failed',
//       error: err.message,
//     });
//   }
// });


// Start the server

// 
// const app = express();
// app.use(express.json());
// app.use(cors()); // Enable CORS for all routes

// const PORT = 5000; // Keep the hardcoded port

// Connect to PostgreSQL database
// initializeDatabase({
//   database: 'your_database_name',
//   username: 'your_database_user',
//   password: 'your_database_password',
//   host: 'localhost',
//   port: 5432,
// })
//   .then(() => {
//     console.log('✅ Database initialized successfully');

//     // ✅ Initialize User model AFTER database is ready
//     initializeUserModel();
//     console.log('✅ User model initialized');

//     // Define routes after models are initialized
//     app.post('/register', registerUser);

//     // Start the server
//     app.listen(PORT, () => {
//       console.log(`⚙️ Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('❌ Failed to initialize database:', error);
//     process.exit(1);
//   });
app.post("/connect-OdooSH", async (req, res) => {
  console.log("In process of connecting to database....");
  main(); // Call the connection function
  res.json(result); // Send the connection status to the frontend
  console.log("Successfully connected to Postgree SQl");
});

// app.listen(process.env.PORT || 5000, () => {
//   console.log(`⚙️ Server is running at http://localhost:${PORT}`);
// });
// export var Postgree_Credentials = { value: 0 };
