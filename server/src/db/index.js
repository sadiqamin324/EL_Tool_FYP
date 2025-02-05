// import { Sequelize } from 'sequelize'; // Import Sequelize
// // import 'dotenv/config'; // Load environment variables

// // Initialize Sequelize with database configuration
// // const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
// //   host: process.env.DB_HOST,
// //   dialect: 'postgres', // Specify the database dialect
// //   port: process.env.DB_PORT,
// //   logging: false, // Disable query logging (optional)
// // });
// // const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
// //   host: process.env.DB_HOST,
// //   dialect: 'postgres', // Specify the database dialect
// //   port: process.env.DB_PORT,
// //   logging: false, // Disable query logging (optional)
// // });
// const sequelize = new Sequelize(Postgree_Credentials.value[2], Postgree_Credentials.value[0], Postgree_Credentials.value[4], {
//   host: Postgree_Credentials.value[2],
//   dialect: 'postgres', // Specify the database dialect
//   port: Postgree_Credentials.value[1],
//   logging: false, // Disable query logging (optional)
// });

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
  }

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
