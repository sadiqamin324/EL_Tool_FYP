import { DataTypes } from "sequelize";

export const Source_Table_Model = {
  source_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  source_type: {
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
  database_name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Safee", // Default creator name
  },
  modified_by: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Safee", // Default modifier name
  },
  active: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default 1 (active)
  },
  active_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active", // Default status as 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Auto-set creation timestamp
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Auto-set update timestamp
  },
};
export const Destination_Table_Model = {
  destination_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  destination_type: {
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
  database_name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Safee", // Default creator name
  },
  modified_by: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Safee", // Default modifier name
  },
  active: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default 1 (active)
  },
  active_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active", // Default status as 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Auto-set creation timestamp
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Auto-set update timestamp
  },
};
