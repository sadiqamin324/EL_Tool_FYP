import { Sequelize } from "sequelize";

// Initialize Sequelize (adjust your credentials)

export default async function getAllTables(database, username, password, host) {
  const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: "postgres",
  });
  try {
    // Query PostgreSQL system catalog to get table names
    const [tables] = await sequelize.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `);
    return { database, tables: tables.map((t) => t) };
  } catch (error) {
    console.error("Error fetching tables:", error);
  } finally {
    await sequelize.close();
  }
}
