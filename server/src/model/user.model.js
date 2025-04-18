import { DataTypes } from "sequelize";

export const Source_Table_Model = {
  attributes: {
    source_name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    },
    user_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Safee",
    },
    modified_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Safee",
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    active_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  options: {
    indexes: [
      {
        name: "source_name_active_unique",
        unique: true,
        fields: ["source_name"],
        where: {
          active_status: "active",
        },
      },
      {
        name: "database_source_name_active_unique",
        unique: true,
        fields: ["database_name"],
        where: {
          active_status: "active",
        },
      },
    ],
  },
};

export const Destination_Table_Model = {
  attributes: {
    destination_name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Safee",
    },
    modified_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Safee",
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    active_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  options: {
    indexes: [
      {
        name: "destination_name_active_unique",
        unique: true,
        fields: ["destination_name"],
        where: {
          active_status: "active",
        },
      },
      {
        name: "database_destination_name_active_unique",
        unique: true,
        fields: ["database_name"],
        where: {
          active_status: "active",
        },
      },
    ],
  },
};
