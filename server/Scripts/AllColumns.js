import { Sequelize } from "sequelize";

export async function getAllColumns(
  database,
  username,
  password,
  host,
  tableName
) {
  // Initialize Sequelize connection
  const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: "postgres",
  });

  try {
    // Query information_schema to get column names
    const [columns] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}' AND table_schema = 'public';
    `);

    return { tableName, columns: columns.map((col) => col.column_name) };
  } catch (error) {
    console.error("Error fetching column names:", error);
    return { tableName, columns: [] }; // Return empty array on error
  } finally {
    await sequelize.close();
  }
}
