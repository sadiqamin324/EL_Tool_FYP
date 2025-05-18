import Odoo from "odoo-xmlrpc";

export async function fetchOdooModuleData(
  url,
  port,
  db,
  username,
  password,
  selectedModule
) {
  const OdooInstance = new Odoo({
    url: url,
    port: parseInt(port),
    db: db,
    username: username,
    password: password,
  });

  return new Promise((resolve, reject) => {
    if (!selectedModule || typeof selectedModule !== "string") {
      reject("❌ Invalid module name provided.");
      return;
    }

    OdooInstance.connect((err) => {
      if (err) {
        console.error("❌ Odoo connection failed:", err);
        reject(`❌ Connection failed: ${JSON.stringify(err)}`);
        return;
      }

      console.log("✅ Connected to Odoo!");

      // Step 1: Fetch unique models from ir.model.data (Limit to 10 models)
      OdooInstance.execute_kw(
        "ir.model.data",
        "search_read",
        [
          [[["module", "=", selectedModule]]],
          { fields: ["model", "module"], limit: 10 },
        ],
        async (err, modelsData) => {
          if (err) {
            console.error("❌ Error fetching model data:", err);
            reject(err);
            return;
          }

          if (modelsData.length === 0) {
            console.warn("⚠ No models found for the selected module.");
            resolve([]);
            return;
          }

          const moduleData = { module: selectedModule, models: [] };

          for (const item of modelsData) {
            const modelName = item.model.replace(/\./g, "_");

            if (moduleData.models.some((m) => m.model === modelName)) {
              console.warn(`⚠ Skipping duplicate model: ${modelName}`);
              continue;
            }

            try {
              // Fetch fields (columns) with name, description, and type
              const fields = await new Promise((resolve, reject) => {
                OdooInstance.execute_kw(
                  "ir.model.fields",
                  "search_read",
                  [
                    [[["model", "=", item.model]]],
                    { fields: ["name", "field_description", "ttype"] },
                  ],
                  (err, fieldsData) => {
                    if (err) {
                      console.error(
                        `❌ Error fetching fields for ${item.model}:`,
                        err
                      );
                      reject(err);
                      return;
                    }
                    resolve(fieldsData);
                  }
                );
              });

              // Fetch records (rows)
              const records = await new Promise((resolve, reject) => {
                OdooInstance.execute_kw(
                  item.model,
                  "search_read",
                  [[], { limit: 10 }],
                  (err, records) => {
                    if (err) {
                      console.error(
                        `❌ Error fetching records for ${item.model}:`,
                        err
                      );
                      reject(err);
                      return;
                    }
                    resolve(records);
                  }
                );
              });

              // Extract column names, descriptions, and data types separately
              const columns = fields.map((field) => ({
                name: field.name,
                description: field.field_description || "No description",
              }));

              const datatypes = fields.map((field) => ({
                name: field.name,
                type: field.ttype || "unknown",
              }));

              console.log("Datatypes", datatypes);
              moduleData.models.push({
                model: modelName,
                rows: records,
                columns: columns,
                datatypes: datatypes, // Separate array for data types
              });
            } catch (error) {
              console.warn(`⚠ Skipping model ${item.model} due to error.`);
            }
          }

          resolve(moduleData);
        }
      );
    });
  });
}
