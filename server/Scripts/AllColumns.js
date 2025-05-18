// import { Sequelize } from "sequelize";

// export default async function getAllColumns(
//   database,
//   username,
//   password,
//   host,
//   tableName
// ) {
//   const sequelize = new Sequelize(database, username, password, {
//     host: host,
//     dialect: "postgres",
//   });

//   try {
//     // Query to fetch column names AND their data types
//     const [columns] = await sequelize.query(`
//       SELECT column_name, data_type 
//       FROM information_schema.columns 
//       WHERE table_name = '${tableName}' AND table_schema = 'public';
//     `);
//     return {
//       database,
//       tableName,
//       columns: columns.map((col) => col.column_name), // Array of column names
//       datatypes: columns.map((col) => ({
//         name: col.column_name,
//         type: col.data_type, // Data type (e.g., 'varchar', 'integer')
//       })), // Array of { name, type } objects
//     };
//   } catch (error) {
//     console.error("Error fetching column names:", error);
//     return { database, tableName, columns: [], datatypes: [] }; // Fallback
//   } finally {
//     await sequelize.close();
//   }
// }


import { Sequelize } from "sequelize";

export default async function getAllColumns(
  database,
  username,
  password,
  host,
  tableName
) {
  const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: "postgres",
  });

  try {
    // Query to fetch columns + data types + primary key info
    // const [columns] = await sequelize.query(`
    //   SELECT 
    //     c.column_name, 
    //     c.data_type,
    //     CASE WHEN kcu.column_name IS NOT NULL THEN true ELSE false END AS is_primary
    //   FROM 
    //     information_schema.columns c
    //   LEFT JOIN 
    //     information_schema.key_column_usage kcu
    //   ON 
    //     c.column_name = kcu.column_name
    //     AND c.table_name = kcu.table_name
    //     AND c.table_schema = kcu.table_schema
    //     AND kcu.constraint_name IN (
    //       SELECT constraint_name 
    //       FROM information_schema.table_constraints 
    //       WHERE constraint_type = 'PRIMARY KEY'
    //     )
    //   WHERE 
    //     c.table_name = '${tableName}' 
    //     AND c.table_schema = 'public';
    // `);

    const [columns] = await sequelize.query(`
          SELECT 
        c.column_name, 
        CASE 
          WHEN c.character_maximum_length IS NOT NULL 
          THEN c.data_type || '(' || c.character_maximum_length || ')' 
          ELSE c.data_type 
        END AS data_type,
        CASE WHEN kcu.column_name IS NOT NULL THEN true ELSE false END AS is_primary
      FROM 
        information_schema.columns c
      LEFT JOIN 
        information_schema.key_column_usage kcu
        ON c.column_name = kcu.column_name
        AND c.table_name = kcu.table_name
        AND c.table_schema = kcu.table_schema
        AND kcu.constraint_name IN (
          SELECT constraint_name 
          FROM information_schema.table_constraints 
          WHERE constraint_type = 'PRIMARY KEY'
        )
      WHERE 
        c.table_name = '${tableName}' 
        AND c.table_schema = 'public';`)

    console.log("Columns and datatypes", columns)
    return {
      database,
      tableName,
      columns: columns.map((col) => col.column_name), // Array of column names
      datatypes: columns.map((col) => ({
        name: col.column_name,
        type: col.data_type,
        isPrimary: col.is_primary, // true/false
      })),
    };
  } catch (error) {
    console.error("Error fetching column info:", error);
    return { database, tableName, columns: [], datatypes: [] };
  } finally {
    await sequelize.close();
  }
}