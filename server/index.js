// import { initializeDatabase } from './db/index.js';
// import { registerUser } from './src/controller/user.controller.js';
// import { initializeUserModel, User } from './src/model/user.model.js';
// import express from 'express';
// import dotenv from 'dotenv';
// import {   initializeDatabase } from './src/db/index.js';// Adjust the path as needed
// import main from '../odoo-node-connection/index.js';
// dotenv.config();
// const app = express();
// app.use(express.json());
// const PORT = process.env.PORT || 5000;
// app.use(cors()); // Enable CORS for all routes

let Sign_Up_Info = [];
let Sign_In_Info = [];
let first_name, last_name, SignUp_email, SignUp_password;
let SignIn_email, SignIn_password;

export var Postgree_Credentials = { value: 0 };

import express from "express";
import sequelize from "./src/db/index.js"; // Ensure the path is correct
import User from "./src/model/user.model.js"; // Ensure the path is correct
import cors from "cors";

const app = express();
app.use(express.json()); // Middleware to parse JSON data
app.use(cors());
const PORT = 5000; // Keep the hardcoded port

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

app.post("/connect-OdooSH", async (req, res) => {
  console.log("In process of connecting to database....");
  main(); // Call the connection function
  res.json(result); // Send the connection status to the frontend
  console.log("Successfully connected to Postgree SQl");
});

// Start the server
app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
