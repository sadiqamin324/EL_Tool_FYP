import { Sequelize, QueryTypes } from "sequelize";

export default async function getAllRows(
  database,
  password,
  tableName,
  columns
) {
  // Assuming you have already set up your Sequelize connection
  const sequelize = new Sequelize(database, "postgres", password, {
    host: "localhost",
    dialect: "postgres",
  });

  try {
    if (!tableName || !columns.length) {
      throw new Error("Table name and columns must be provided.");
    }

    // Ensure column names are properly formatted to prevent SQL injection
    const columnList = columns.map((col) => `"${col}"`).join(", ");

    const query = `SELECT ${columnList} FROM "${tableName}"`;

    const results = await sequelize.query(query, { type: QueryTypes.SELECT });

    const columnArray = columnList
      .split(", ")
      .map((col) => col.replace(/"/g, ""));

    return { database, tableName, columnArray, rows: results };
  } catch (error) {
    console.error("Error fetching rows:", error);
    throw error;
  }
}
