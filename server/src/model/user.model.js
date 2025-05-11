import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize";
import { autoUpdateTimestampHooks } from "./hooks.js";

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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  options: {
    ...autoUpdateTimestampHooks,
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  options: {
    ...autoUpdateTimestampHooks,
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

export const Pipeline_Table_Model = {
  attributes: {
    pipeline_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source_table_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    columns: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    datatypes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    dest_db: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dest_table_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schedule_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_run: {
      type: DataTypes.DATE,
      allowNull: true,
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  options: {
    ...autoUpdateTimestampHooks,
    indexes: [
      {
        name: "pipeline_name_active_unique",
        unique: true,
        fields: ["pipeline_name"],
        where: {
          active_status: "active",
        },
      },
      {
        name: "source_table_columns_active_unique",
        unique: true,
        fields: ["source_table_name", "columns"],
        where: {
          active_status: "active",
        },
      },
    ],
  },
};
