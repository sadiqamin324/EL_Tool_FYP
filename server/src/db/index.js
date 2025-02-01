// import { Sequelize } from 'sequelize'; // Import Sequelize
// // import 'dotenv/config'; // Load environment variables

// // Initialize Sequelize with database configuration
// // const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
// //   host: process.env.DB_HOST,
// //   dialect: 'postgres', // Specify the database dialect
// //   port: process.env.DB_PORT,
// //   logging: false, // Disable query logging (optional)
// // });
// // const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
// //   host: process.env.DB_HOST,
// //   dialect: 'postgres', // Specify the database dialect
// //   port: process.env.DB_PORT,
// //   logging: false, // Disable query logging (optional)
// // });
// const sequelize = new Sequelize(Postgree_Credentials.value[2], Postgree_Credentials.value[0], Postgree_Credentials.value[4], {
//   host: Postgree_Credentials.value[2],
//   dialect: 'postgres', // Specify the database dialect
//   port: Postgree_Credentials.value[1],
//   logging: false, // Disable query logging (optional)
// });


// // A function to test and establish the connection
// const connectToDatabase = async () => {
//   try {
//     await sequelize.authenticate(); // Test the database connection
//     console.log('Connected to PostgreSQL database using Sequelize!');
//   } catch (error) {
//     console.error('Error connecting to PostgreSQL with Sequelize:', error);
//     process.exit(1); // Exit process if connection fails
//   }
// };

// export { sequelize, connectToDatabase };
// export var Postgree_Credentials = { value: 0 };
import { Sequelize } from 'sequelize';

let sequelize;

export function initializeDatabase({ database, username, password, host, port }) {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }

  sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: 'postgres', // Specify the database dialect
    port: port,
    logging: false, // Disable query logging (optional)
  });

  return sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

export function getSequelizeInstance() {
  return sequelize;
}