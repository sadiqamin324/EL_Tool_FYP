import express from "express";
import cors from "cors";
import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  Source_Table_Model,
  Destination_Table_Model,
} from "./src/model/user.model.js";
import readline from "readline";
import Odoo from "odoo-xmlrpc"; // Importing the Odoo XML-RPC library
import { Op } from "sequelize";
import getAllTables from "./Scripts/AllTable.js";
import getAllColumns from "./Scripts/AllColumns.js";
import getAllRows from "./Scripts/AllRows.js";
import { fetchOdooModules } from "./Scripts/odooModules.js";
import { fetchOdooModuleData } from "./Scripts/odooData.js";
import { Json } from "sequelize/lib/utils";
import { error } from "console";

const app = express();
app.use(express.json()); // Middleware to parse JSON data
app.use(cors());
const PORT = 5000; // Keep the hardcoded port
//Odoo Url
const url = "http://127.0.0.1";

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
const algorithm = "aes-256-cbc"; // Strong encryption algorithm
const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");
const iv = crypto.randomBytes(16); // Initialization vector

// Encrypt function
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedData: encrypted, iv: iv.toString("hex") };
}

// Decrypt function
function decrypt(encryptedData, ivHex) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
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
  // main();
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
    const encrypted_password = encrypt(password);
    // console.log(hashedPassword);

    const newUser = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: JSON.stringify(encrypted_password),
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

  try {
    const OdooInstance = new Odoo({
      url: "http://127.0.0.1",
      port: port,
      db: database,
      username: username,
      password: password,
    });

    return new Promise((resolve, reject) => {
      OdooInstance.connect(function (err) {
        if (err) {
          console.error("❌ Odoo connection failed:", JSON.stringify(err));
          return res.json({
            success: false,
            message: "Error while connecting to Odoo",
          });
        }
        console.log("✅ Odoo connection successful");
        return res.json({
          success: true,
          message: "Connected successfully to Odoo",
        });
      });
    });
  } catch (error) {
    console.error("❌ Unexpected error in Odoo connection:", error);
    return Promise.reject(`❌ Unexpected error: ${error.message}`);
  }
});

// Test the database connectio
app.post("/save-details", async (req, res) => {
  //All details accepted from the incoming request

  const { source_name, source_type, username, port, host, database, password } =
    req.body;
  console.log(username);

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
    const encryptedPassword = encrypt(password);

    const newUser = await User.create({
      [fieldNames.name]: source_name,
      [fieldNames.type]: source_type,
      host: host,
      port_number: port,
      user_name: username,
      password: JSON.stringify(encryptedPassword),
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
      attributes: ["destination_name", "database_name"],
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

app.post("/get-odoo-data", async (req, res) => {
  const { selectedmodules } = req.body;
  let Odoo_Tables = [];

  try {
    // Define the Source model from system_db
    const UserModel = system_db.define("Source", Source_Table_Model, {
      timestamps: true,
    });

    // Fetch matching database configuration from PostgreSQL
    const rows = await UserModel.findAll({
      where: {
        database_name: selectedmodules.database,
      },
      attributes: [
        "database_name",
        "host",
        "source_type",
        "user_name",
        "port_number",
        "password",
      ],
      raw: true, // Fetch as plain JSON object
    });

    // Ensure at least one record is found
    if (!rows.length) {
      throw new Error("No matching database found for the given module.");
    }

    // Extract and decrypt password
    const { encryptedData, iv } = JSON.parse(rows[0].password);
    const decryptedPassword = decrypt(encryptedData, iv);

    // Store Odoo tables data
    const Odoo_Tables = [];

    // Fetch data for each selected module
    for (const module of selectedmodules.modules) {
      const result = await fetchOdooModuleData(
        url, // Assuming 'host' contains the Odoo URL
        rows[0].port_number,
        rows[0].database_name,
        rows[0].user_name,
        decryptedPassword,
        module.name
      );
      Odoo_Tables.push(result);
    }

    // Send success response
    res.json({
      success: true,
      message: "All tables fetched successfully",
      tables: Odoo_Tables, // Now properly contains fetched tables
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

app.post("/get-all-tables", async (req, res) => {
  const { title } = req.body;
  const { selectedSources } = req.body;
  const All_Postgre_Tables = [];
  let All_Odoo_Modules = [];

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

    const rows = await user.findAll({
      where: {
        [`${title.toLowerCase()}_name`]: {
          [Op.in]: selectedSources, // Filters rows where source_name is in the array
        },
      },
      attributes: [
        "database_name",
        "host",
        "source_type",
        "user_name",
        "port_number",
        "password",
      ],
      raw: true, // Only fetch database_name column
    });

    // Send the response with data
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].source_type == "Postgres SQL") {
        const result = await getAllTables(
          rows[i].database_name,
          "postgres",
          fields.password,
          rows[i].host
        );
        All_Postgre_Tables.push(result);
      } else if (rows[i].source_type == "Odoo") {
        const { encryptedData, iv } = JSON.parse(rows[i].password);

        const result = await fetchOdooModules(
          url,
          rows[i].port_number,
          rows[i].database_name,
          rows[i].user_name,
          decrypt(encryptedData, iv)
        );

        All_Odoo_Modules = result;
      }
    }
    res.json({
      success: true,
      message: "All tables fetched successfully",
      tables: {
        postgres_tables: All_Postgre_Tables,
        odoo_modules: All_Odoo_Modules,
      },
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

app.post("/get-all-rows", async (req, res) => {
  const { selected_Columns } = req.body;
  const { Global_Password } = req.body;
  const All_Rows = [];

  let user;
  try {
    // Send the response with data
    for (let i = 0; i < selected_Columns.length; i++) {
      // console.log("database name", selected_Columns[i].databaseName);
      const result = await getAllRows(
        selected_Columns[i].database,
        Global_Password,
        selected_Columns[i].tableName,
        selected_Columns[i].columns
      );
      All_Rows.push(result);
    }
    res.json({
      success: true,
      message: "All rows fetched successfully",
      rows: All_Rows,
    });
  } catch (error) {
    console.error("Error fetching all rows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rows",
      error: error.message,
    });
  }
});

app.post("/dump-data", async (req, res) => {
  const { password } = req.body;
  const { database_name } = req.body;
  const { dumpdata } = req.body;

  console.log("Database name", database_name);
  const sequelize = new Sequelize(database_name, "postgres", password, {
    host: "localhost", // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  function getDataType(column, value) {
    column = column.toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Check if the column is an array
    if (Array.isArray(value)) {
      // Handle empty arrays specifically
      if (value.length === 0) {
        return DataTypes.JSONB; // For PostgreSQL, you can use JSONB or JSON data type for arrays
      }
      return DataTypes.JSONB; // Use JSONB or ARRAY depending on the database
    }

    // Check if the column name includes "id" (e.g., user_id, account_id)
    if (column.includes("id")) return DataTypes.INTEGER;

    // Check for date or time-related columns (e.g., created_at, updated_at, event_date)
    if (
      column.includes("date") ||
      column.includes("time") ||
      column.includes("timestamp")
    )
      return DataTypes.DATE;

    // Check for boolean columns (e.g., is_active, is_enabled, active)
    if (column.includes("active") || column.includes("enabled"))
      return DataTypes.BOOLEAN;

    // Default case: return string for everything else
    return DataTypes.STRING;
  }
  async function createAndInsertTable(dumpdata) {
    const { tableName, columnArray, rows } = dumpdata;

    // Define fields dynamically
    const fields = {};
    rows.forEach((row) => {
      columnArray.forEach((col) => {
        fields[col] = {
          type: getDataType(col, row[col]),
          allowNull: true,
        };
      });
    });

    // Define the model dynamically
    const DynamicModel = sequelize.define(tableName, fields, {
      timestamps: false, // Set to true if `createdAt` and `updatedAt` are needed
      tableName: tableName,
    });

    // Sync the table (Creates table if not exists)
    await DynamicModel.sync({ force: true });

    // Insert rows into the table
    for (const row of rows) {
      const rowData = {};
      columnArray.forEach((col, index) => {
        rowData[col] = row[col];
      });

      await DynamicModel.create(rowData);
    }

    console.log(`✅ Data inserted into '${tableName}' successfully!`);
  }

  async function createAndInsertTables(dumpdataArray) {
    for (const dumpdata of dumpdataArray) {
      await createAndInsertTable(dumpdata);
    }
    console.log("✅ All tables inserted successfully!");
  }

  createAndInsertTables(dumpdata).catch(console.log(error));
  // Test the database connection
  try {
    await sequelize.authenticate();
    console.log("Destination_db connected Successfully");

    return res.json({
      success: true,
      message: "Connected to Destination_db successfully!",
    });
  } catch (error) {
    console.error("❌ Unable to connect to Destination_db:", error);
    return res.status(500).json({ error: "Database connection failed." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
