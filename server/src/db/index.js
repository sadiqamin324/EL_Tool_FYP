// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { initializeDatabase } from './src/db/index.js'; // Correct path to db
// import User from './src/model/user.model.js'; // Correct path to user model

// dotenv.config();
// const app = express();
// app.use(express.json());
// const PORT = process.env.PORT || 5000;
// app.use(cors());

// // Load environment variables (adjust path if needed)
// dotenv.config({ path: 'backend/.env' });

// // Routes
// app.post('/connect-Postgree', async (req, res) => {
//   console.log('Connecting to database...');
//   try {
//     await initializeDatabase(req.body);
//     console.log('Successfully connected to PostgreSQL');
//     res.json({ success: true, message: 'Connection established' });
//   } catch (err) {
//     console.error('Connection failed:', err);
//     res.status(500).json({ success: false, message: 'Connection failed', error: err.message });
//   }
// });

<<<<<<< HEAD
// export { sequelize, connectToDatabase };
// export var Postgree_Credentials = { value: 0 };
import { Sequelize, DataTypes, Model } from "@sequelize/core";

import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
} from "@sequelize/core/decorators-legacy";

let sequelize;
let User;

export async function initializeDatabase({
  database,
  username,
  password,
  host,
  port,
}) {
  if (typeof password !== "string") {
    throw new Error("Password must be a string");
=======
<<<<<<< HEAD
// app.post('/sync-database', async (req, res) => {
//   try {
//     await User.sync({ force: true });
//     res.json({ success: true, message: 'Database synced' });
//   } catch (err) {
//     console.error('Sync failed:', err);
//     res.status(500).json({ success: false, message: 'Sync failed', error: err.message });
//   }
// });
=======


>>>>>>> d5c79492ef2231b4308768c54a9eaf2aaf4afe0c

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
import { Sequelize } from "sequelize";

// Create a new Sequelize instance
const sequelize = new Sequelize("data", "postgres", "sadiq123", {
  host: "localhost", // Change to your DB host
  dialect: "postgres", // Specify PostgreSQL
  logging: false, // Disable logging queries (set true for debugging)
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
>>>>>>> 5fa20776d61097abbbca4696b7a7e8e462ff6136
  }
})();

<<<<<<< HEAD
  sequelize = new Sequelize({
    database: "postgres",
    user: "postgres",
    password: "safeeurrehman123",
    dialect: "postgres", // Use PostgreSQL dialect
    host: host,
    port: port, // Database password
    logging: false, // Optional: Disable query logging
  });

  

  return sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
}

export { User };

export function getSequelizeInstance() {
  return sequelize;
}
=======
export default sequelize; // ✅ Default export for ES modules
>>>>>>> 5fa20776d61097abbbca4696b7a7e8e462ff6136
