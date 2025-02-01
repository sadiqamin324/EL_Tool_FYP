import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './src/db/index.js';// Adjust the path as needed
import main from '../odoo-node-connection/index.js';
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cors()); // Enable CORS for all routes

export var Postgree_Credentials = { value: 0 };
// Load environment variables
dotenv.config({
  path: "backend/.env", // Corrected path to .env file
});

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
app.get("/", (req, res) => {
  res.json("Assalam O Alaikum Brothers!");
});

// app.post("/connect-Postgree", async (req, res) => {
//   console.log("In process of connecting to database....");
//   const result = await connectToDatabase(); // Call the connection function
//   res.json(result); // Send the connection status to the frontend
//   console.log("Successfully connected to Postgree SQl");
// });
// app.post("/connect-Postgree", async (req, res) => {
//   console.log("In process of connecting to database....");
//   Postgree_Credentials.value = req.body;
//   const result = await connectToDatabase(); // Call the connection function
//   res.json(result); // Send the connection status to the frontend
//   console.log("Successfully connected to Postgree SQl");
// })

// app.post("/connect-Postgree", async (req, res) => {
//   console.log("In process of connecting to database....");
//   const result = await connectToDatabase(); // Call the connection function
//   res.json(result); // Send the connection status to the frontend
//   console.log("Successfully connected to Postgree SQl");
// });
// app.post("/connect-Postgree", async (req, res) => {
//   console.log("In process of connecting to database....");
//   Postgree_Credentials.value = req.body;
//   const result = await connectToDatabase(); // Call the connection function
//   res.json(result); // Send the connection status to the frontend
//   console.log("Successfully connected to Postgree SQl");
// })
app.post("/connect-Postgree", async (req, res) => {
  console.log("In process of connecting to database....");
  const { username, port, host, database, password } = req.body;

  if (!username || !port || !host || !database || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    await initializeDatabase({ database, username, password, host, port });
    res.json({ success: true, message: "Successfully connected to Postgree SQL" }); // Send the connection status to the frontend
    console.log("Successfully connected to Postgree SQL");
  } catch (error) {
    res.json({ success: false, message: "Failed to connect to Postgree SQL" });
    console.error("Failed to connect to Postgree SQL:", error);
  }
});

app.post("/connect-OdooSH", async (req, res) => {
  console.log("In process of connecting to database....");
  main(); // Call the connection function
  res.json(result); // Send the connection status to the frontend
  console.log("Successfully connected to Postgree SQl");
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`⚙️ Server is running at http://localhost:${PORT}`);
});
// export var Postgree_Credentials = { value: 0 };
