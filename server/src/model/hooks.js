export const autoUpdateTimestampHooks = {
  hooks: {
    afterCreate: async (model) => {
      try {
        if (!model?.tableName) {
          console.warn("Table name not available in afterCreate hook");
          return;
        }

        const sequelize = model.sequelize;
        const tableName = model.tableName;

        // First ensure the table exists
        const tableExists = await sequelize.query(
          `SELECT EXISTS (
              SELECT 1 FROM information_schema.tables 
              WHERE table_name = :tableName
            )`,
          {
            replacements: { tableName },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        if (!tableExists[0].exists) {
          console.warn(
            `Table ${tableName} does not exist for trigger creation`
          );
          return;
        }

        await sequelize.query(`
            CREATE OR REPLACE FUNCTION update_modified_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW."updatedAt" = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
          `);

        await sequelize.query(`
            DROP TRIGGER IF EXISTS update_${tableName}_updated_at ON "${tableName}";
            CREATE TRIGGER update_${tableName}_updated_at
            BEFORE UPDATE ON "${tableName}"
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
          `);

        console.log(`Created timestamp trigger for table: ${tableName}`);
      } catch (error) {
        console.error("Error creating timestamp trigger:", error.message);
      }
    },
    afterSync: async (options) => {
      try {
        if (!options?.tableName) {
          console.warn("Table name not available in afterSync hook");
          return;
        }

        const sequelize = options.sequelize;
        const tableName = options.tableName;

        // Same table existence check and trigger creation as above
        // ... (copy the same implementation from afterCreate)
      } catch (error) {
        console.error("Error syncing timestamp trigger:", error.message);
      }
    },
  },
};
