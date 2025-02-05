// export var Postgree_Credentials = { value: 0 };
import { Sequelize, DataTypes, Model } from "@sequelize/core";
import { Sequelize } from "sequelize";

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
  }

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
  }
})();

  

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
export default sequelize; // ✅ Default export for ES modules
