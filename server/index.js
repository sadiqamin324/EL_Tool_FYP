import express from "express"
import { connectToDatabase } from "./src/db/index.js";
import dotenv from "dotenv";
import cors from "cors";  // Import CORS


const app=express()
app.use(express.json())
const PORT = process.env.PORT || 5000;
app.use(cors()); // Enable CORS for all routes


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
app.get('/', (req, res) => {
  res.json("Assalam O Alaikum Brothers!")
})

app.post('/connect-database', async (req, res) => {
  console.log("In process of connecting to database....");
  const result = await connectToDatabase(); // Call the connection function
  res.json(result); // Send the connection status to the frontend
  console.log("Successfully connected to Postgree SQl");
});


 
app.listen(process.env.PORT || 5000, () => {
    console.log(`⚙️ Server is running at http://localhost:${PORT}`);
  });
  
  
  
