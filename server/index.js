import express from "express";
import cors from "cors";
import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import loginToOdoo from "../backend/odootodbconnection/app";
// import loginToOdoo from "../backend/odootodbconnection/app.js"

const app = express();
app.use(express.json()); // Middleware to parse JSON data
app.use(cors());
const PORT = 5000; // Keep the hardcoded port

let sequelize;
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

async function hashPassword(password) {
  const saltRounds = 10; // Defines the complexity of hashing
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
}

// Route to get all users

app.get("/", async (req, res) => {
  res.json("Assalam O Alaikum Brothers!");
});

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post("/Sign-Up", async (req, res) => {
  const [first_name, last_name, email, password] = req.body;

  sequelize = new Sequelize("postgres", "postgres", "safeeurrehman123", {
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
    first_name: {
      type: DataTypes.STRING,
      allowNull: false, // Map 'first_name' column in DB
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Insert user data into the database
  try {
    const hashedPassword = await hashPassword(password);
    // console.log(hashedPassword);

    const newUser = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
    });

    console.log("✅ User record created successfully:", newUser);
    return res
      .status(201)
      .json({ success: true, message: "User record created successfully." });
  } catch (error) {
    console.error("❌ Error inserting user:", error);
    return res.json({
      success: false,
      message: "User record not created successfully.",
    });
  }
});

app.post("/Sign-In", async (req, res) => {
  const [email, password] = req.body;

  sequelize = new Sequelize("postgres", "postgres", "safeeurrehman123", {
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

  const User = sequelize.define("User", {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false, // Map 'first_name' column in DB
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  const user = await User.findOne({ where: { email } });

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(password);
  console.log(user.password);

  if (user && isMatch) {
    return res.json({
      success: true,
      message: "User authenticated",
    });
  } else {
    console.log(user && isMatch);
    return res.json({
      success: false,
      message: "User with email or password not found!",
    });
  }
});

app.post("/connect-Postgree", async (req, res) => {
  const { source_name, source_type, username, port, host, database, password } =
    req.body;

  loginToOdoo()
  sequelize = new Sequelize(database, username, password, {
    host: host, // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  // Test the database connectio

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres SQL successfully!");
    return res.json({
      success: true,
      message: "Connected to Postgres SQL successfully!",
    });
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
    return res.status(500).json({ error: "Database connection failed." });
  }
});

app.post("/connect-Odoo", async (req, res) => {
  const { source_name, source_type, username, port, host, database, password } =
    req.body;

  sequelize = new Sequelize(database, username, password, {
    host: host, // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Odoo successfully!");
    return res.json({
      success: true,
      message: "Connected to Odoo connected successfully!",
    });
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
    return res.status(500).json({ error: "Database connection failed." });
  }
});

// Test the database connectio
app.post("/save-details", async (req, res) => {
  //All details accepted from the incoming request

  const { source_name, source_type, username, port, host, database, password } =
    req.body;

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
      password: hashPassword(password),
    });
    console.log("✅ User record created successfully:", newUser);
    return res.json({
      success: true,
      message: "Create a new user record Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Failed to create a new user record",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
