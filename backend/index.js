import { app } from "./app.js";
import { connectToDatabase } from "./src/db/index.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({
  path: "backend/.env", // Corrected path to .env file
});

// Connect to the database
connectToDatabase()
  .then(() => {
    // Start the server only if the database connection is successful
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    // Handle database connection failure
    console.log("Database connection failed!!!", err);
  });
