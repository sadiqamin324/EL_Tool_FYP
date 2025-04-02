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
          [[["module", "=", selectedModule]]], // Filter by module
          { fields: ["model", "module"], limit: 10 }, // Limit models to 10
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

          // Ensure unique models under a single module object
          const moduleData = { module: selectedModule, models: [] };

          // Fetch records for each model (each limited to 10 rows)
          for (const item of modelsData) {
            const modelName = item.model.replace(/\./g, "_"); // Replace dots with underscores

            // 🔹 Check if this model already exists in moduleData.models
            if (moduleData.models.some((m) => m.model === modelName)) {
              console.warn(`⚠ Skipping duplicate model: ${modelName}`);
              continue; // Skip duplicate models
            }

            try {
              // Fetch the fields (columns) for each model
              const fields = await new Promise((resolve, reject) => {
                OdooInstance.execute_kw(
                  "ir.model.fields",
                  "search_read",
                  [
                    [[["model", "=", item.model]]], // Filter by model name
                    { fields: ["name", "field_description"] }, // Get field name and description
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

              // Fetch records for each model (each limited to 10 rows)
              const records = await new Promise((resolve, reject) => {
                OdooInstance.execute_kw(
                  item.model, // Keep original model format
                  "search_read",
                  [[], { limit: 10 }], // Fetch up to 10 records per model
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

              // Add model data to moduleData
              moduleData.models.push({
                model: modelName,
                rows: records,
                columns: fields.map((field) => ({
                  name: field.name,
                  description: field.field_description || "No description", // Include field description
                })),
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
