import express from "express";
import cors from "cors";
import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize";
import { loginToOdoo } from "../backend/odootodbconnection/app.js";
  // Change require to import
//import { data } from "autoprefixer"

const app = express();
app.use(express.json()); // Middleware to parse JSON data
app.use(cors());
const PORT = 5000; // Keep the hardcoded port

let User;

// Sync database and create a sample user
async function EnterData(first_name, last_name, email, password) {
  console.log("✅ Database synced.");

  // Create a sample user
  const user = await User.create({
    FirstName: first_name,
    LastName: last_name,
    Password: password,
    Email: email,
  });
  console.log(user.email);
}

// Route to get all users

app.get("/", async (req, res) => {
  res.json("Assalam O Alaikum Brothers!");
});

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post("/connect-Postgree", async (req, res) => {
  const { source_name, source_type, username, port, host, database, password } =
    req.body;

  const sequelize = new Sequelize(database, username, password, {
    host: host, // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  // Test the database connectio

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
    return res.status(500).json({ error: "Database connection failed." });
  }

  // Define the User model
  const User = sequelize.define(
    "Source",
    {
      source_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      source_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      host: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      port_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true, // ✅ Adds createdAt and updatedAt fields
    }
  );

  // Insert user data into the database
  try {
    const newUser = await User.create({
      source_name: source_name,
      source_type: source_type,
      host: host,
      port_number: port,
      password: password,
    });

    console.log("✅ User record created successfully:", newUser);
    return res
      .status(201)
      .json({ message: "User record created successfully.", user: newUser });
  } catch (error) {
    console.error("❌ Error inserting user:", error);
    return res.status(500).json({ error: "Error creating user." });
  }
});

app.post("/Sign-Up", async (req, res) => {
  const [first_name, last_name, email, password] = req.body;

  const sequelize = new Sequelize("postgres", "postgres", "safeeurrehman123", {
    host: "localhost", // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  // Test the database connection
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
    return res.status(500).json({ error: "Database connection failed." });
  }

  // Define the User model
  const User = sequelize.define("User", {
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "firstname", // Map 'first_name' column in DB
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "lastname", // Map 'last_name' column in DB
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "email", // Map 'email' column in DB
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password", // Map 'password' column in DB
    },
  });

  // Insert user data into the database
  try {
    const newUser = await User.create({
      FirstName: first_name,
      LastName: last_name,
      Email: email,
      Password: password,
    });

    console.log("✅ User record created successfully:", newUser);
    return res
      .status(201)
      .json({ message: "User record created successfully.", user: newUser });
  } catch (error) {
    console.error("❌ Error inserting user:", error);
    return res.status(500).json({ error: "Error creating user." });
  }
});

app.post("/connect-Odoo", async (req, res) => {
  const { source_name, source_type, username, port, server, database, password } =
    req.body;


  // // Odoo server configurations
  // const odooUrl = 'http://localhost:8069';
  // const db = 'NEDUniversity-7';
  // const username = 'admin';  // Change this to your Odoo username
  // const password = 'admin';  // Change this to your Odoo password

 

  loginToOdoo(database, username, password);
  const sequelize = new Sequelize(database, username, password, {
    host: server, // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  // Test the database connectio

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Odoo successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
    return res.status(500).json({ error: "Database connection failed." });
  }


 

  // Define the User model
  const User = sequelize.define(
    "Source",
    {
      source_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      source_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      host: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      port_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true, // ✅ Adds createdAt and updatedAt fields
    }
  );
  // User.sync({ force: true });
  // Insert user data into the database
  try {
    const newUser = await User.create({
      source_name: source_name,
      source_type: source_type,
      host: server,
      port_number: port,
      password: password,
    });

    console.log("✅ User record created successfully:", newUser);
    return res
      .status(201)
      .json({ message: "User record created successfully.", user: newUser });
  } catch (error) {
    console.error("❌ Error inserting user:", error);
    return res.status(500).json({ error: "Error creating user." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
