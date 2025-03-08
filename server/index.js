import express from "express";
import cors from "cors";
import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { data } from "react-router-dom";
import { getAllTables } from "./Scripts/AllTable.js";
import {
  Source_Table_Model,
  Destination_Table_Model,
} from "./src/model/user.model.js";
import { getAllColumns } from "./Scripts/AllColumns.js";
// import loginToOdoo from "../backend/odootodbconnection/app.js";

const app = express();
app.use(express.json()); // Middleware to parse JSON data
app.use(cors());
const PORT = 5000; // Keep the hardcoded port

let sequelize;
let system_db;
let User;
let object = { flag: null };
let modifier;

const fieldNames = {
  name: "",
  type: "",
};
const fields = { host: "", password: "" };

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

app.post("/validate-password", async (req, res) => {
  const { password } = req.body;
  console.log(password);

  system_db = new Sequelize("postgres", "postgres", password, {
    host: "localhost", // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  // Test the database connectio

  try {
    await system_db.authenticate();
    console.log("System_DB connected Successfully");
    fields.password = password;
    return res.json({
      success: true,
      message: "Connected to System DB successfully!",
    });
  } catch (error) {
    console.error("❌ Unable to connect to System DB:", error);
    return res.status(500).json({ error: "Database connection failed." });
  }
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

  if (user && isMatch) {
    console.log(user && isMatch);
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

  // loginToOdoo(database, username, password);

  sequelize = new Sequelize("postgres", "postgres", "safeeurrehman123", {
    host: host, // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Postgres Successfully");
    return res.json({
      success: true,
      message: "Connected to Odoo connected successfully!",
    });
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to connect to Postgres SQL" });
  }
});

// Test the database connectio
app.post("/save-details", async (req, res) => {
  //All details accepted from the incoming request

  const { source_name, source_type, username, port, host, database, password } =
    req.body;

  let User;
  if (object.flag == 0) {
    modifier = "Source";
    fieldNames.name = "source_name";
    fieldNames.type = "source_type";
  } else {
    modifier = "Destination";

    fieldNames.name = "destination_name";
    fieldNames.type = "destination_type";
  }
  console.log(modifier);
  // Define the User model

  // Define the model dynamically
  if (modifier == "Source") {
    User = system_db.define(modifier, Source_Table_Model, {
      timestamps: true,
    });

    // Test the database connection
    try {
      await system_db.authenticate();
      console.log("✅ Connected to PostgreSQL successfully!");
      await User.sync({ alter: true });
      console.log("Source table is ready.");
    } catch (error) {
      console.error("❌ Unable to connect to PostgreSQL:", error);
    }
  } else if (modifier == "Destination") {
    User = system_db.define(modifier, Destination_Table_Model, {
      timestamps: true,
    });

    try {
      await system_db.authenticate();
      console.log("✅ Connected to PostgreSQL successfully!");
      await User.sync({ alter: true });
      console.log("Source table is ready.");
    } catch (error) {
      console.error("❌ Unable to connect to PostgreSQL:", error);
    }
  }

  // Insert user data into the database
  try {
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      [fieldNames.name]: source_name,
      [fieldNames.type]: source_type,
      host: host,
      port_number: port,
      password: hashedPassword,
      database_name: database,
    });
    console.log("✅ User record created successfully:", newUser);
    return res.json({
      success: true,
      message: "Create a new user record Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Failed to create a new user record",
    });
  }
});

//Recieve the flag to determine source/destination
app.post("/flag", async (req, res) => {
  try {
    object.flag = req.body.flag;

    if (object.flag !== 0 && object.flag != 1 && object.flag != 2) {
      console.log(object.flag);
      return res.json({ success: false, message: "Invalid flag value" });
    }
    console.log("Recieved flag", object.flag);
    if (object.flag == 0 || object.flag == 1) {
      return res.json({
        success: true,
        message: "Recieved source-destination dropdown flag correctly",
      });
    } else if (object.flag == 2) {
      return res.json({
        success: true,
        message: "Recieved pipeline flag correctly",
      });
    }
  } catch (error) {
    console.log("Error handling flag request", error);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Recieve the flag to determine data from source or destination
app.post("/data-flag", async (req, res) => {
  try {
    object.flag = req.body.flag;

    if (object.flag !== 0 && object.flag != 1 && object.flag != 2) {
      console.log(object.flag);
      return res.json({ success: false, message: "Invalid flag value" });
    }
    console.log("Recieved flag", object.flag);
    // Test the database connection
    try {
      const response = await fetch("http://localhost:5000/get-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Received data:", data);

      if (object.flag == 0 || object.flag == 1) {
        return res.json({
          success: true,
          message: "Recieved data flag for source-dropdown",
          data: data,
        });
      } else if (object.flag == 2) {
        return res.json({
          success: true,
          message: "Recieved data flag for pipeline",
        });
      }
    } catch (error) {
      console.error("❌ Unable to send request for data", error);
      return res.status(500).json({ error: "Request failed" });
    }
  } catch (error) {
    console.log("Error handling flag request", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/get-data", async (req, res) => {
  try {
    sequelize = new Sequelize("postgres", "postgres", "safeeurrehman123", {
      host: "localhost", // Your DB host
      dialect: "postgres", // Specify PostgreSQL
      logging: false, // Disable logging queries (set true for debugging)
    });
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL successfully!");

    if (object.flag == 0) {
      modifier = "Source";
      fieldNames.name = "source_name";
      fieldNames.type = "source_type";
    } else {
      modifier = "Destination";
      fieldNames.name = "destination_name";
      fieldNames.type = "destination_type";
    }
    console.log(object.flag);
    const dynamicFields = {
      [fieldNames.name]: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      [fieldNames.type]: {
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
    };

    // ✅ Define model only once
    const User = sequelize.define(modifier, dynamicFields, {
      timestamps: true,
    });

    const rows = await User.findAll({
      attributes: [
        "id",
        modifier.toLowerCase() + "_name",
        modifier.toLowerCase() + "_type",
        "host",
        "port_number",
        "active_status",
      ],
      where: {
        active_status: "active", // Fetch only rows whfere active_status is 'active'
      },
    });

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/get-pipeline-data", async (req, res) => {
  try {
    // Define the models dynamically
    let Source;
    let Destination;

    try {
      Source = system_db.define("Source", Source_Table_Model, {
        timestamps: true,
      });

      await system_db.authenticate();
      console.log("✅ Connected to PostgreSQL successfully!");
      await Source.sync({ alter: true });
      console.log("Source table is ready.");
    } catch (error) {
      console.error("❌ Unable to connect to PostgreSQL:", error);
    }

    try {
      Destination = system_db.define("Destination", Destination_Table_Model, {
        timestamps: true,
      });

      await system_db.authenticate();
      console.log("✅ Connected to PostgreSQL successfully!");
      await Destination.sync({ alter: true });
      console.log("Destination table is ready.");
    } catch (error) {
      console.error("❌ Unable to connect to PostgreSQL:", error);
    }

    // Fetch active source rows
    const source_rows = await Source.findAll({
      attributes: ["source_name"],
      where: {
        active_status: "active",
      },
    });

    // Fetch active destination rows
    const destination_rows = await Destination.findAll({
      attributes: [
        "id",
        "destination_name",
        "destination_type",
        "host",
        "port_number",
        "active_status",
      ],
      where: {
        active_status: "active",
      },
    });

    // Send the response with data
    res.json({
      success: true,
      message: "Pipeline data fetched successfully",
      source_data: source_rows,
      destination_data: destination_rows,
    });
  } catch (error) {
    console.error("Error fetching pipeline data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pipeline data",
      error: error.message,
    });
  }
});

app.post("/get-all-tables", async (req, res) => {
  const { title } = req.body;
  const { selectedSources } = req.body;
  const All_Tables = [];

  let user;
  try {
    // Define the models dynamically
    if (title == "Source") {
      user = system_db.define(title, Source_Table_Model, {
        timestamps: true,
      });
    } else if (title == "Destination") {
      user = system_db.define(title, Destination_Table_Model, {
        timestamps: true,
      });
    }

    const all_tables = await user.findAll({
      where: {
        [`${title.toLowerCase()}_name`]: {
          [Op.in]: selectedSources, // Filters rows where source_name is in the array
        },
      },
      attributes: ["database_name", "host"],
      raw: true, // Only fetch database_name column
    });

    // Send the response with data
    for (let i = 0; i < all_tables.length; i++) {
      const result = await getAllTables(
        all_tables[i].database_name,
        "postgres",
        fields.password,
        all_tables[i].host
      );
      All_Tables.push(result);
    }

    res.json({
      success: true,
      message: "All tables fetched successfully",
      tables: All_Tables,
    });
  } catch (error) {
    console.error("Error fetching all tables:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tables data",
      error: error.message,
    });
  }
});

app.post("/get-all-columns", async (req, res) => {
  const { selectedTables } = req.body;
  const { Global_Password } = req.body;
  const All_Columns = [];

  let user;
  try {
    // Define the models dynamically
    // if (title == "Source") {
    //   user = system_db.define(title, Source_Table_Model, {
    //     timestamps: true,
    //   });
    // } else if (title == "Destination") {
    //   user = system_db.define(title, Destination_Table_Model, {
    //     timestamps: true,
    //   });
    // }

    //   const all_columns = await user.findAll({
    //     where: {
    //       [`${title.toLowerCase()}_name`]: {
    //         [Op.in]: selectedSources, // Filters rows where source_name is in the array
    //       },
    //     },
    //     attributes: ["database_name", "host"],
    //     raw: true, // Only fetch database_name column
    //   });

    // Send the response with data
    for (let i = 0; i < selectedTables.length; i++) {
      const result = await getAllColumns(
        selectedTables[i].database,
        "postgres",
        Global_Password,
        "localhost",
        selectedTables[i].tablename.tablename
      );
      All_Columns.push(result);
    }
    res.json({
      success: true,
      message: "All columns fetched successfully",
      columns: All_Columns,
    });
  } catch (error) {
    console.error("Error fetching all columns:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch columns",
      error: error.message,
    });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
