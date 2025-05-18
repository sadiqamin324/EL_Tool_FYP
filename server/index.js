import express, { raw } from "express";
import cors from "cors";
import { DataTypes, where } from "sequelize";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  Source_Table_Model,
  Destination_Table_Model,
  Pipeline_Table_Model,
} from "./src/model/user.model.js";
import readline from "readline";
import Odoo from "odoo-xmlrpc"; // Importing the Odoo XML-RPC library
import { Op } from "sequelize";
import getAllTables from "./Scripts/AllTable.js";
import getAllColumns from "./Scripts/AllColumns.js";
import getAllRows from "./Scripts/AllRows.js";
import { fetchOdooModules } from "./Scripts/odooModules.js";
import { fetchOdooModuleData } from "./Scripts/odooData.js";
import { fetchOdooRecords } from "./Scripts/fetchOdooRecords.js";
import { compareRecords } from "../src/components/Functions.js";
import { Json } from "sequelize/lib/utils";
import { error } from "console";
import { getPrimaryKeyColumns } from "./Scripts/fetchOdooPrimaryKeys.js";

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

const typeMapping = {
  char: "VARCHAR(255)",
  text: "TEXT",
  html: "TEXT",
  integer: "INTEGER",
  float: "DOUBLE PRECISION",
  boolean: "BOOLEAN",
  date: "DATE",
  datetime: "TIMESTAMP WITH TIME ZONE",  // Better for timezone-aware applications
  binary: "BYTEA",
  selection: "VARCHAR(255)",

  // Relational fields
  many2one: "JSONB",
  one2many: "JSONB",    // Changed from INTEGER[] to handle complex relations
  many2many: "JSONB",   // Changed from INTEGER[] to store both IDs and metadata

  // Special types
  monetary: "NUMERIC(16,2)",
  reference: "VARCHAR(255)",

  // New additions for common Odoo patterns
  currency_pair: "JSONB",          // For [1, 'USD'] patterns
  translation: "JSONB",            // For multilingual fields
  properties: "JSONB",             // For dynamic property fields
  image: "BYTEA",                  // For image fields
  attachment: "TEXT",              // For attachment references
  computed: "TEXT",                // For computed fields
  duration: "INTERVAL",            // For time duration fields
  color: "INTEGER",                // For color index fields
  priority: "INTEGER",             // For priority/star fields
  state: "VARCHAR(64)",            // For status fields
  html_frame: "TEXT",              // For complex HTML content
  signature: "BYTEA",              // For digital signatures
  barcode: "VARCHAR(128)",         // For barcode fields
  qrcode: "TEXT"                   // For QR code data
};

const fields = { host: "", password: "" };

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

//Automated Pipeline Execution
let schedulerInterval = null;
const CHECK_INTERVAL = 50000; // Check every 60 seconds

async function checkAndRunTasks() {
  console.log("Running and alive");
  let Pipeline;
  Pipeline = system_db.define("Pipeline", Pipeline_Table_Model.attributes, {
    ...Pipeline_Table_Model.options,
    timestamps: true,
  });
  const now = new Date();

  const currentDay = days[now.getDay()];
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const pipeline_records = await Pipeline.findAll({
    attributes: [
      "id",
      "pipeline_name",
      "source_name",
      "source_type",
      "columns",
      "datatypes",
      "source_table_name",
      "dest_db",
      "dest_table_name",
      "active_status",
      "schedule_details",
    ],
    where: { active_status: "active" },
    raw: true,
  });

  for (const task of pipeline_records) {
    try {
      if (!task.schedule_details) continue; // Skip to next iteration if null
      const record = JSON.parse(task.schedule_details); // Parse the schedule_details string

      if (!record.Day || !record.Time) continue; // Skip to next iteration if missing Day/Time

      console.log("Record Time", record.Time, "Current Time", currentTime);
      console.log("Record Day", record.Day, "Current Day", currentDay);

      if ((record.frequency && record.frequency != 0) || !record.frequency) {
        if (record.Day === currentDay && record.Time === currentTime) {
          const pipeline_record = task;
          try {
            const response = await fetch(`http://localhost:5000/run-pipeline`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ pipeline_record }),
            });

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (data.success) {
              console.log("Pipeline executed successfully");
              record.frequency = record.frequency - 1;
              await Pipeline.update(
                {
                  schedule_details: JSON.stringify(record), // Fields to update (should be stringified)
                },
                {
                  where: {
                    id: task.id, // Condition 1: Match ID
                    active_status: "active", // Condition 2: Must be active
                  },
                }
              );
            } else {
              console.log("failed to recive pipeline records from backend");
            }
          } catch (error) {
            console.error("Error:", error);
            console.log("Failed to send information to backend");
          }
        }
      }
    } catch (error) {
      console.error("Error parsing schedule_details:", error);
    }
  }

  Pipeline = null;

  // for (const task of pendingTasks) {
  //   try {
  //     // Execute the task (replace with your logic)
  //     console.log(`Running task: ${task.taskName} at ${now}`);

  //     // Mark as completed
  //     await task.update({ status: "completed" });
  //   } catch (err) {
  //     console.error(`Failed to run task ${task.taskName}:`, err);
  //   }
  // }
}

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
  if (schedulerInterval) {
    clearInterval(schedulerInterval); // Clear existing interval
  }

  system_db = new Sequelize("postgres", "postgres", password, {
    host: "localhost", // Your DB host
    dialect: "postgres", // Specify PostgreSQL
    logging: false, // Disable logging queries (set true for debugging)
  });

  try {
    await system_db.authenticate();
    console.log("System_DB connected Successfully");
    fields.password = password;
    // Start the scheduler loop
    schedulerInterval = setInterval(checkAndRunTasks, CHECK_INTERVAL);
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
    await sequelize.sync({ alter: true });
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
app.post("/remove-article", async (req, res) => {
  const { title, article } = req.body;

  if (!title || !article || !article.id) {
    return res.status(400).json({
      success: false,
      error: "Missing required parameters: title or article data",
    });
  }

  try {
    let Model;
    let action = "removed";

    // Define model based on title
    switch (title) {
      case "Source":
        Model = system_db.define(title, Source_Table_Model.attributes, {
          ...Source_Table_Model.options,
          timestamps: true, // override or ensure timestamps are on
        });

        await Model.update(
          { active_status: "inactive" },
          { where: { id: article.id } }
        );
        action = "marked as inactive";
        break;

      case "Destination":
        Model = system_db.define(title, Destination_Table_Model.attributes, {
          ...Destination_Table_Model.options,
          timestamps: true, // override or ensure timestamps are on
        });

        await Model.update(
          { active_status: "inactive" },
          { where: { id: article.id } }
        );
        break;

      case "Pipeline":
        Model = system_db.define(title, Pipeline_Table_Model.attributes, {
          ...Pipeline_Table_Model.options,
          timestamps: true, // override or ensure timestamps are on
        });

        await Model.update(
          { active_status: "inactive" },
          { where: { id: article.id } }
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          error: "Invalid title parameter",
        });
    }

    return res.json({
      success: true,
      message: `${title} row with id ${article.id} ${action} successfully`,
      data: { id: article.id },
    });
  } catch (error) {
    console.error(`Error removing ${title} article:`, error);
    return res.status(500).json({
      success: false,
      error: `Failed to process ${title} removal`,
      details: error.message,
    });
  }
});
// Test the database connectio
app.post("/save-details", async (req, res) => {
  //All details accepted from the incoming request

  const { source_name, source_type, username, port, host, database, password } =
    req.body;

  console.log("username", username);
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
    User = system_db.define(modifier, Source_Table_Model.attributes, {
      ...Source_Table_Model.options,
      timestamps: true, // override or ensure timestamps are on
    });
  } else if (modifier == "Destination") {
    User = system_db.define(modifier, Destination_Table_Model.attributes, {
      ...Destination_Table_Model.options,
      timestamps: true, // override or ensure timestamps are on
    });
  }

  // After User = system_db.define(...) but before User.sync()
  User.afterSync(async () => {
    const tableName = User.tableName;
    await system_db.query(`
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_${tableName}_updated_at ON "${tableName}";
    CREATE TRIGGER update_${tableName}_updated_at
    BEFORE UPDATE ON "${tableName}"
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
  `);
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

    // Validate flag
    if (object.flag !== 0 && object.flag !== 1 && object.flag !== 2) {
      console.log("Invalid flag:", object.flag);
      return res.json({ success: false, message: "Invalid flag value" });
    }

    console.log("Received flag:", object.flag);

    await system_db.authenticate();
    console.log("✅ Connected to PostgreSQL successfully!");

    // Set dynamic model config
    let modifier;

    if (object.flag == 0) {
      modifier = "Source";
      fieldNames.name = "source_name";
      fieldNames.type = "source_type";
    } else {
      modifier = "Destination";
      fieldNames.name = "destination_name";
      fieldNames.type = "destination_type";
    }
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
      active_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },
    };

    const User = system_db.define(modifier, dynamicFields, {
      timestamps: true,
    });

    // Sync model (optional - depending on use case)
    await User.sync();

    const rows = await User.findAll({
      attributes: [
        "id",
        fieldNames.name,
        fieldNames.type,
        "host",
        "database_name",
        "active_status",
      ],
      where: {
        active_status: "active",
      },
      raw: true,
    });

    if (object.flag === 0 || object.flag === 1) {
      return res.json({
        success: true,
        message: "Received data flag for source-destination",
        data: rows, // FIX: send actual data from DB
      });
    } else if (object.flag === 2) {
      return res.json({
        success: true,
        message: "Received data flag for pipeline",
      });
    }
  } catch (error) {
    console.error("❌ Error in /data-flag:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/get-pipeline-data", async (req, res) => {
  try {
    // Define the models dynamically
    let Source;
    let Destination;

    try {
      Source = system_db.define("Source", Source_Table_Model.attributes, {
        ...Source_Table_Model.options,
        timestamps: true, // override or ensure timestamps are on
      });

      await system_db.authenticate();
      console.log("✅ Connected to PostgreSQL successfully!");
      await Source.sync({ alter: true });
      console.log("Source table is ready.");
    } catch (error) {
      console.error("❌ Unable to connect to PostgreSQL:", error);
    }
    try {
      Destination = system_db.define(
        "Destination",
        Destination_Table_Model.attributes,
        {
          ...Destination_Table_Model.options,
          timestamps: true, // override or ensure timestamps are on
        }
      );

      await system_db.authenticate();
      console.log("✅ Connected to PostgreSQL successfully!");
      await Destination.sync({ alter: true });
      console.log("Source table is ready.");
    } catch (error) {
      console.error("❌ Unable to connect to PostgreSQL:", error);
    }
    // Fetch active source rows
    const source_rows = await Source.findAll({
      attributes: ["source_name", "source_type"],
      where: {
        active_status: "active",
      },
    });
    const destination_rows = await Destination.findAll({
      attributes: ["destination_name"],
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

  try {
    // Define the Source model from system_db
    const UserModel = system_db.define(
      "Source",
      Source_Table_Model.attributes,
      {
        ...Source_Table_Model.options,
        timestamps: true, // override or ensure timestamps are on
      }
    );

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

  try {
    // Define the models dynamically

    const user = system_db.define(title, Source_Table_Model.attributes, {
      ...Source_Table_Model.options,
      timestamps: true, // override or ensure timestamps are on
    });

    const rows = await user.findAll({
      where: {
        [`${title.toLowerCase()}_name`]: {
          [Op.eq]: selectedSources[0].source_name, // Match source_name
        },
        active_status: "active", // Only fetch active records
      },
      attributes: [
        "database_name",
        "host",
        "source_type",
        "user_name",
        "port_number",
        "password",
      ],
      raw: true,
    });

    // Send the response with data
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].source_type == "Postgres SQL") {
        const { encryptedData, iv } = JSON.parse(rows[i].password);
        const result = await getAllTables(
          rows[i].database_name,
          rows[i].user_name,
          decrypt(encryptedData, iv),
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

app.post("/insert-changes", async (req, res) => {
  const { object } = req.body;
  const { title } = req.body;

  //All edited columns with their data
  const updateData = {};
  object.editedValues.forEach((change) => {
    updateData[change.col] = change.editedValue;
  });

  let User;
  if (title == "Source") {
    User = system_db.define(title, Source_Table_Model.attributes, {
      ...Source_Table_Model.options,
      timestamps: true,
    });
  } else if (title == "Destination") {
    User = system_db.define(title, Destination_Table_Model.attributes, {
      ...Destination_Table_Model.options,
      timestamps: true,
    });
  } else if (title == "Pipeline") {
    User = system_db.define(title, Pipeline_Table_Model.attributes, {
      ...Pipeline_Table_Model.options,
      timestamps: true,
    });
  }
  try {
    await User.update(updateData, {
      where: {
        id: object.changed_row_id,
      },
    });

    console.log("Changes saved successfully");

    return res.json({
      success: true,
      message: "work done",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An error occured while saving changes",
    });
  }
});

app.post("/run-pipeline", async (req, res) => {
  const { pipeline_record } = req.body;
  console.log(pipeline_record);
  try {
    const source = system_db.define("Sources", Source_Table_Model.attributes, {
      ...Source_Table_Model.options,
      timestamps: true,
    });

    const destination = system_db.define(
      "Destinations",
      Destination_Table_Model.attributes,
      {
        ...Destination_Table_Model.options,
        timestamps: true,
      }
    );

    const source_record = await source.findOne({
      attributes: [
        "database_name",
        "port_number",
        "user_name",
        "password",
        "host",
      ],
      where: {
        active_status: "active",
        source_name: pipeline_record.source_name,
      },
      raw: true,
    });

    const destination_record = await destination.findOne({
      attributes: ["database_name", "user_name", "password", "host"],
      where: {
        active_status: "active",
        destination_name: pipeline_record.dest_db,
      },
      raw: true,
    });

    const { encryptedData: sourceEncryptedData, iv: sourceIv } = JSON.parse(
      source_record.password
    );
    const decryptedPassword1 = decrypt(sourceEncryptedData, sourceIv);

    const { encryptedData: destEncryptedData, iv: destIv } = JSON.parse(
      destination_record.password
    );
    const decryptedPassword2 = decrypt(destEncryptedData, destIv);

    const Destination = new Sequelize(
      destination_record.database_name,
      destination_record.user_name,
      decryptedPassword2,
      {
        host: destination_record.host,
        dialect: "postgres",
        logging: false,
      }
    );

    await Destination.authenticate();
    console.log("Connection established with Destination");

    let results;
    let primaryKeys, primaryKeyColumns;

    if (pipeline_record.source_type == "Postgres SQL") {
      const Source = new Sequelize(
        source_record.database_name,
        source_record.user_name,
        decryptedPassword1,
        {
          host: source_record.host,
          dialect: "postgres",
          logging: false,
        }
      );

      await Source.authenticate();
      console.log("✅ Connected established with Source");

      const Source_Table = await Source.query(
        `SELECT EXISTS(SELECT 1 FROM ${pipeline_record.source_table_name}) AS has_data`,
        { type: Source.QueryTypes.SELECT }
      );

      if (!Source_Table[0].has_data) {
        await Destination.query(
          `DELETE FROM "${pipeline_record.dest_table_name}"`
        );
        return res.json({ success: true, message: "No data in source_tables" });
      }

      [primaryKeys] = await Source.query(`
        SELECT kcu.column_name as primary_key_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_name = '${pipeline_record.source_table_name}'
          AND tc.table_schema = 'public'
      `);
      
      primaryKeyColumns = primaryKeys.map(pk => pk.primary_key_column);
      console.log("All primary keys", primaryKeyColumns);

      if (primaryKeys.length > 0) {
        const primaryKeySet = new Set(primaryKeyColumns);
        const uniqueColumns = pipeline_record.columns.filter(
          column => !primaryKeySet.has(column)
        );
        pipeline_record.columns = [...uniqueColumns, ...primaryKeyColumns];
      }

      console.log("Pipeline record after filtration", pipeline_record.columns);

      results = await Source.query(
        `SELECT ${pipeline_record.columns
          .map((col) => `"${col}"`)
          .join(", ")} 
         FROM "${pipeline_record.source_table_name}"`,
        {
          type: Source.QueryTypes.SELECT,
        }
      );


    } else if (pipeline_record.source_type == "Odoo") {


      primaryKeys = await getPrimaryKeyColumns(
        url, // URL (with protocol!)
        source_record.port_number,
        source_record.database_name,
        source_record.user_name,
        decryptedPassword1,
        pipeline_record.source_table_name.replace(/_/g, "."))


      console.log("primary keys", primaryKeys)

      primaryKeyColumns = primaryKeys.map(pk => pk.name);
      console.log("All primary keys", primaryKeyColumns);

      if (primaryKeys.length > 0) {
        const primaryKeySet = new Set(primaryKeyColumns);
        const uniqueColumns = pipeline_record.columns.filter(
          column => !primaryKeySet.has(column)
        );
        pipeline_record.columns = [...uniqueColumns, ...primaryKeyColumns];
      }

      console.log("Pipeline record after filtration", pipeline_record.columns);

      results = await fetchOdooRecords(
        url,
        source_record.port_number,
        source_record.database_name,
        source_record.user_name,
        decryptedPassword1,
        pipeline_record.source_table_name.replace(/_/g, "."),
        pipeline_record.columns
      );


      if (results.length == 0) {
        await Destination.query(
          `DELETE FROM "${pipeline_record.dest_table_name}"`
        );
        return res.json({ success: true, message: "No data in source_tables" });
      }

    }

    const Dest_Table = await Destination.query(
      `SELECT EXISTS(SELECT 1 FROM ${pipeline_record.dest_table_name}) AS has_data`,
      { type: Destination.QueryTypes.SELECT }
    );

    console.log("Dest_Table has data", Dest_Table);
    const last1000Records = results.slice(-1000);

    const columns = pipeline_record.columns;
    const rowsPlaceholders = last1000Records
      .map(
        (_, rowIndex) =>
          `(${columns
            .map(
              (_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`
            )
            .join(", ")})`
      )
      .join(", ");

    // const values = last1000Records.flatMap((data) =>
    //   columns.map((column) => data[column])
    // );

    const values = last1000Records.flatMap((data) =>
      columns.map((column) =>
        Array.isArray(data[column]) ? JSON.stringify(data[column]) : data[column]
      )
    );

    if (Dest_Table[0].has_data) {
      const dest_data = await Destination.query(
        `SELECT ${pipeline_record.columns
          .map((col) => `"${col}"`)
          .join(", ")} 
         FROM "${pipeline_record.dest_table_name}"`,
        {
          type: Destination.QueryTypes.SELECT,
        }
      );
      const differences = compareRecords(last1000Records, dest_data, primaryKeyColumns);
      if (differences && differences.length == 0) {
        console.log("Destination table up to date");
        return res.json({
          success: true,
          message: "Destination table up to date",
        });
      } else {
        console.log("Differences", differences);
        for (const difference of differences) {
          const primaryKeys = difference.primaryKeys;

          const updateKeys = Object.keys(difference.record1).filter(key => !(key in primaryKeys));

          const updateSet = updateKeys.map(() => `?`).map((_, i) => `${updateKeys[i]} = ?`).join(', ');
          const whereClause = Object.keys(primaryKeys).map((key) => `${key} = ?`).join(' AND ');

          const updateValues = updateKeys.map(key => difference.record1[key]); // Proper values
          const whereValues = Object.values(primaryKeys);
          const values = [...updateValues, ...whereValues]; // All values in order

          const updateQuery = `
            UPDATE ${pipeline_record.dest_table_name}
            SET ${updateSet}
            WHERE ${whereClause}
          `;

          const affected_rows = await Destination.query(updateQuery, {
            replacements: values,
            type: Destination.QueryTypes.UPDATE
          });

          console.log("Changed rows", affected_rows);
        }

        return res.json({
          success: true,
          message: "Destination table synced with changes",
        });
      }

    } else {
      const query = `
        INSERT INTO ${pipeline_record.dest_table_name} (${columns.join(", ")})
        VALUES ${rowsPlaceholders}
        RETURNING *;
      `;

      console.log("All data values to be inserted", values)

      const result = await Destination.query(query, {
        bind: values,
        type: Destination.QueryTypes.INSERT,
      });


      console.log("Inserted data successfully", result);
    }

    console.log("Data updated successfully");
    const Pipeline = system_db.define(
      "Pipeline",
      Pipeline_Table_Model.attributes,
      {
        ...Pipeline_Table_Model.options,
        timestamps: true,
      }
    );

    const now = new Date();
    await Pipeline.update(
      {
        last_run: now,
      },
      {
        where: {
          id: pipeline_record.id,
          active_status: "active",
        },
      }
    );

    return res.json({ success: true, message: "Pipeline executed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/get-pipeline-record", async (req, res) => {
  const user = system_db.define("Pipeline", Pipeline_Table_Model.attributes, {
    ...Pipeline_Table_Model.options,
    timestamps: true,
  });
  try {
    await system_db.authenticate();

    await user.sync({ alter: true });

    const records = await user.findAll({
      attributes: [
        "id",
        "pipeline_name",
        "source_name",
        "source_type",
        "columns",
        "datatypes",
        "source_table_name",
        "dest_db",
        "dest_table_name",
        "active_status",
        "last_run",
      ],
      where: {
        active_status: "active",
      },
      raw: true,
    });
    return res.json({
      success: true,
      message: "All pipeline records fetched successfully",
      pipeline_records: records,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error fetching all pipeline records",
    });
  }
});
app.post("/add-pipeline", async (req, res) => {
  const { pipeline_record } = req.body;

  try {
    const user = system_db.define("Pipeline", Pipeline_Table_Model.attributes, {
      ...Pipeline_Table_Model.options,
      timestamps: true, // override or ensure timestamps are on
    });

    const source = system_db.define("Sources", Source_Table_Model.attributes, {
      ...Source_Table_Model.options,
      timestamps: true
    })

    const destination = system_db.define(
      "Destination",
      Destination_Table_Model.attributes,
      {
        ...Destination_Table_Model.options,
        timestamps: true,
      }
    );
    const source_record = await source.findOne({
      attributes: [
        "database_name",
        "port_number",
        "user_name",
        "password",
        "host",
      ],
      where: {
        active_status: "active",
        source_name: pipeline_record.source_name,
      },
      raw: true,
    });

    let destination_record;

    if (destination) {
      destination_record = await destination.findOne({
        attributes: ["database_name", "user_name", "password", "host"],
        where: {
          destination_name: pipeline_record.dest_db,
          active_status: "active",
        },
        raw: true,
      });
    } else {
      return res.json({
        success: false,
        message: "Destination Database removed, pipeline can not run",
      });
    }

    await system_db.authenticate();
    console.log("✅ Connected to PostgreSQL successfully!");
    await user.sync({ alter: true });
    console.log("Pipeline Table is ready.");

    const { encryptedData, iv } = JSON.parse(destination_record.password);
    const decryptedPassword = decrypt(encryptedData, iv);

    const sequelize = new Sequelize(
      destination_record.database_name,
      destination_record.user_name,
      decryptedPassword,
      {
        host: destination_record.host, // Your DB host
        dialect: "postgres", // Specify PostgreSQL
        logging: false, // Disable logging queries (set true for debugging)
      }
    );

    const { encryptedData: sourceEncryptedData, iv: sourceIv } = JSON.parse(
      source_record.password
    );
    const decryptedPassword1 = decrypt(sourceEncryptedData, sourceIv);

    let results;
    if (pipeline_record.source_type == "Postgres SQL") {
      const Source = new Sequelize(
        source_record.database_name,
        source_record.user_name,
        decryptedPassword1,
        {
          host: source_record.host, // Your DB host
          dialect: "postgres", // Specify PostgreSQL
          logging: false, // Disable logging queries (set true for debugging)
        }
      );
      await Source.authenticate();

      [results] = await Source.query(`
      SELECT 
        kcu.column_name as name,
        c.data_type as type
      FROM 
        information_schema.table_constraints tc
      JOIN 
        information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN
        information_schema.columns c
        ON kcu.table_name = c.table_name
        AND kcu.column_name = c.column_name
        AND kcu.table_schema = c.table_schema
      WHERE 
        tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_name = '${pipeline_record.source_table_name}'
        AND tc.table_schema = 'public'
    `);


      console.log("Postgres SQL primary keys", results);
    }
    else if (pipeline_record.source_type == "Odoo") {

      console.log("Odoo credentials", url,
        source_record.port_number,
        source_record.database_name,
        source_record.user_name,
        decryptedPassword1,
        pipeline_record.source_table_name.replace(/_/g, "."))

      results = await getPrimaryKeyColumns(
        url, // URL (with protocol!)
        source_record.port_number,              // Port
        source_record.database_name,
        source_record.user_name,
        decryptedPassword1,
        pipeline_record.source_table_name.replace(/_/g, "."))       // Model name


      for (const record of results) {
        record.type = typeMapping[record.type.toLowerCase().trim()] || "TEXT"
      }

      console.log("All primary keys", results)

    }

    // Array 1: Just primary key column names
    const primaryKeys = results.map(row => row.name);

    console.log("primary keys not added before", primaryKeys);
    // Array 2: Full column info with data types
    const primaryKeyDatatypes = results.map(row => ({
      name: row.name,
      type: row.type,
      isPrimary: true
    }));
    console.log("primary key datatypes", primaryKeyDatatypes);


    console.log(`All primary keys of table ${pipeline_record.source_table_name} ,${[primaryKeys]}`);

    if (primaryKeys.length > 0) {
      // Step 1: Convert primaryKeys to a Set for O(1) lookupsconst 
      const primaryKeySet = new Set(primaryKeys);
      const uniqueDatatypes = new Map();

      console.log("Primary key set", primaryKeySet)
      // Step 2: Filter out duplicates from pipeline_record.columns
      const uniqueColumns = pipeline_record.columns.filter(
        column => !primaryKeySet.has(column)
      );

      // 2. First add all existing datatypes from pipeline_record
      console.log("pipeline_record.datatypes", pipeline_record.datatypes)
      pipeline_record.datatypes.forEach(item => {
        uniqueDatatypes.set(item.name, item);
      });

      // 3. Then add/overwrite with primary key datatypes
      primaryKeyDatatypes.forEach(item => {
        uniqueDatatypes.set(item.name, {
          ...item,
          isPrimary: true // Force isPrimary=true for all PK columns
        });
      });
      // Step 3: Merge (uniqueColumns + primaryKeys)
      pipeline_record.columns = [...uniqueColumns, ...primaryKeys];
      pipeline_record.datatypes = Array.from(uniqueDatatypes.values());
    }

    console.log("Pipeline record after filtertation", pipeline_record.columns)

    const fields = {};

    // Create a lookup map for datatypes by column name
    const datatypeMap = {};
    pipeline_record.datatypes.forEach(dt => {
      datatypeMap[dt.name] = dt;
    });

    // Process each column
    for (let i = 0; i < pipeline_record.columns.length; i++) {
      const columnName = pipeline_record.columns[i];
      const datatype = datatypeMap[columnName];

      if (datatype) {
        if (datatype.isPrimary) {
          fields[columnName] = {
            primaryKey: true,
            type: datatype.type,
            allowNull: false,
          };
        } else {
          fields[columnName] = {
            type: datatype.type,
            allowNull: true,
          };
        }
      } else {
        // Fallback for columns not found in datatypes
        fields[columnName] = {
          type: 'varchar', // Default type if not specified
          allowNull: true,
        };
      }
    }    // Define the model dynamically

    const DynamicModel = sequelize.define(
      pipeline_record.dest_table_name,
      fields,
      {
        tableName: pipeline_record.dest_table_name,
        timestamps: false, // This disables createdAt/updatedAt columns
      }
    ); // Sync the table (Creates table if not exists)

    await DynamicModel.sync({ force: true });

    const newUser = await user.create({
      pipeline_name: pipeline_record.pipeline_name,
      source_name: pipeline_record.source_name,
      source_type: pipeline_record.source_type,
      source_table_name: pipeline_record.source_table_name,
      columns: pipeline_record.columns,
      datatypes: pipeline_record.datatypes,
      dest_db: pipeline_record.dest_db,
      dest_table_name: pipeline_record.dest_table_name,
    });

    console.log("✅ User record created successfully:", newUser);
    return res.json({
      success: true,
      message: "New pipeline record created successfully!",
    });
  } catch (error) {
    console.error("Error while adding new pipeline record", error);
    return res.json({
      success: false,
      message: error,
    });
  }
});

app.post("/add-schedule", async (req, res) => {
  const { Day, Time, frequency, pipeline_name } = req.body;

  try {
    if (!Day || !Time || !pipeline_name) {
      return res.status(400).json({
        error: "Missing required fields (Day, Time, or pipeline_name)",
      });
    }

    const schedule_details = JSON.stringify({
      Day,
      Time,
      frequency: frequency || null, // Handle case where frequency might be undefined
    });

    const Pipeline = system_db.define(
      "Pipeline",
      Pipeline_Table_Model.attributes,
      {
        ...Pipeline_Table_Model.options,
        timestamps: true, // override or ensure timestamps are on
      }
    );

    const updated = await Pipeline.update(
      { schedule_details: schedule_details },
      {
        where: {
          pipeline_name: pipeline_name,
        },
      }
    );
    if (updated[0] === 0) {
      // Sequelize update returns [numberOfAffectedRows]
      return res.status(404).json({ error: "Pipeline not found" });
    }

    console.log("Successfully added schedule details to pipleine");
    return res.json({
      success: true,
      message: "Successfully added schedule details to pipleine",
    });
  } catch (error) {
    console.log("Error", error);
    return res.json({
      success: false,
      message: "Error while adding schedule details to pipleine",
    });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// const user = system_db.define(title, Source_Table_Model.attributes, {
//   ...Source_Table_Model.options,
//   timestamps: true, // override or ensure timestamps are on
// });
