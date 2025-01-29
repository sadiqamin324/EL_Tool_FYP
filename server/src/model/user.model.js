import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js'; // Import the Sequelize instance

// Define the User model
const user = sequelize.define('User', {

  name: {
    type: DataTypes.STRING,
    allowNull: false, // Make the field required
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure email is unique
    validate: {
      isEmail: true, // Validate email format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', // Optional: Specify table name
  timestamps: true,   // Sequelize automatically adds createdAt and updatedAt fields
});

export default user;
