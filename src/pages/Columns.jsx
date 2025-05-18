import { tab } from "@material-tailwind/react";
import {
  Password,
  DestTables,
  SourceColumns,
  Source_Rows,
  Odoo_Data,
} from "../components/Context";
import { useContext, useRef, useState, useEffect } from "react";
import { ClearTicked } from "../components/Functions";
import { SpinnerBox } from "../components/SpinnerBox";

export function Columns({ setshowDest, setpipeline_record }) {
  const [tickedboxes, settickedboxes] = useState();
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());
  const { dest_columns } = useContext(DestTables);
  const [selected_Columns, setselected_Columns] = useState(null);
  const [dataArrived, setdataArrived] = useState(false);
  const SelectbuttonRef = useRef(null);
  const ClearbuttonRef = useRef(null);
  const { source_columns } = useContext(SourceColumns);
  const { setsource_rows } = useContext(Source_Rows);
  const { Global_Password } = useContext(Password);
  const { odoo_columns, setodoo_records } = useContext(Odoo_Data);

  function toggleSelection(index) {
    setSelectedIndexes((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(index)) {
        newSet.delete(index); // Uncheck
      } else {
        newSet.add(index); // Check
      }

      settickedboxes(newSet.size);

      return newSet;
    });
  }

  useEffect(() => {
    if (
      (source_columns && source_columns.length) ||
      (odoo_columns && odoo_columns.length)
    ) {
      setdataArrived(true);
    }
  }, [source_columns, odoo_columns]);

  function Group_PSQL_Columns(data) {
    const result = {};

    data.forEach((item) => {
      const { database, tableName, columnArray, datatypes } = item;

      // Create a unique key combining database and tableName
      const key = `${database}-${tableName}`;

      if (!result[key]) {
        result[key] = {
          database: database,
          tableName: tableName,
          columnArray: [],
          datatypes: [],
        };
      }

      result[key].columnArray.push(columnArray);
      result[key].datatypes.push(datatypes);
    });

    return Object.values(result);
  }

  function Group_Odoo_Columns(data) {
    const result = {};

    data.forEach((item) => {
      const { tableName, columnArray, datatypes } = item;

      if (!result[tableName]) {
        result[tableName] = {
          tableName: tableName,
          columnArray: [],
          datatypes: [],
        };
      }

      result[tableName].columnArray.push(columnArray);
      result[tableName].datatypes.push({
        name: columnArray,
        type: datatypes,
      });
    });

    return Object.values(result);
  }

  function convertOdooToPostgresTypes(groupedData) {
    // Odoo to PostgreSQL type mapping
    const typeMapping = {
      char: "VARCHAR(255)",
      text: "TEXT",
      html: "TEXT",
      integer: "INTEGER",
      float: "DOUBLE PRECISION",
      boolean: "BOOLEAN",
      date: "DATE",
      datetime: "TIMESTAMP WITH TIME ZONE",  // Better for timezone-aware applications
      binary: "BYTEA",
      selection: "VARCHAR(255)",

      // Relational fields
      many2one: "JSONB",
      one2many: "JSONB",    // Changed from INTEGER[] to handle complex relations
      many2many: "JSONB",   // Changed from INTEGER[] to store both IDs and metadata

      // Special types
      monetary: "NUMERIC(16,2)",
      reference: "VARCHAR(255)",

      // New additions for common Odoo patterns
      currency_pair: "JSONB",          // For [1, 'USD'] patterns
      translation: "JSONB",            // For multilingual fields
      properties: "JSONB",             // For dynamic property fields
      image: "BYTEA",                  // For image fields
      attachment: "TEXT",              // For attachment references
      computed: "TEXT",                // For computed fields
      duration: "INTERVAL",            // For time duration fields
      color: "INTEGER",                // For color index fields
      priority: "INTEGER",             // For priority/star fields
      state: "VARCHAR(64)",            // For status fields
      html_frame: "TEXT",              // For complex HTML content
      signature: "BYTEA",              // For digital signatures
      barcode: "VARCHAR(128)",         // For barcode fields
      qrcode: "TEXT"                   // For QR code data
    };

    return groupedData.map((table) => ({
      tableName: table.tableName,
      columnArray: table.columnArray,
      datatypes: table.datatypes.map((column) => ({
        name: column.name,
        type: typeMapping[column.type.toLowerCase()] || "TEXT",
      })),
    }));
  }

  function ClickSelect() {
    setshowDest(true);
    let selectedPostgresColumns = [];
    let selectedOdooColumns = [];

    if (source_columns && source_columns.length > 0) {
      [...selectedIndexes].forEach((index) => {
        const [beforeDash, afterDash] = index.split("-");
        selectedPostgresColumns.push({
          database: source_columns[beforeDash].database,
          tableName: source_columns[beforeDash].tableName, // Fixed key
          columnArray: source_columns[beforeDash].columns[afterDash],
          datatypes: source_columns[beforeDash].datatypes[afterDash],
        });
      });
      const groupedData1 = Group_PSQL_Columns(selectedPostgresColumns); // Debug output
      console.log("Grouped data 1", groupedData1);
      setpipeline_record((prev) => ({
        ...prev,
        source_table_name: groupedData1[0].tableName,
        columns: groupedData1[0].columnArray,
        datatypes: groupedData1[0].datatypes,
      }));
      setselected_Columns(groupedData1);
      setodoo_records(null);
    } else if (odoo_columns && odoo_columns.length > 0) {
      [...selectedIndexes].forEach((index) => {
        const [beforeDash, afterDash] = index.split("-");
        console.log(beforeDash, afterDash);
        selectedOdooColumns.push({
          tableName: odoo_columns[beforeDash].table,
          columnArray: odoo_columns[beforeDash].columns[afterDash].name,
          datatypes: odoo_columns[beforeDash].datatypes[afterDash].type,
          rows: odoo_columns[beforeDash].rows,
        });
      });

      const groupedData2 = Group_Odoo_Columns(selectedOdooColumns); // Debug output
      const converted_data = convertOdooToPostgresTypes(groupedData2);
      console.log("Grouped data 2", converted_data);
      setpipeline_record((prev) => ({
        ...prev,
        source_table_name: converted_data[0].tableName,
        columns: converted_data[0].columnArray,
        datatypes: converted_data[0].datatypes,
      }));
      setodoo_records(converted_data);
      setsource_rows(null);
    }
  }

  // useEffect(() => {
  //   if (!selected_Columns || selected_Columns.length === 0) return;

  //   const fetchRows = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/get-all-rows", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ selected_Columns, Global_Password }),
  //       });
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }

  //       const data = await response.json();

  //       if (data.success) {
  //         console.log("All rows of selected columns recieved from backend");
  //         setsource_rows(data.rows);

  //         // 0: Object { database: "DVD_Rental", tableName: "address", columnArray: (4) […], … }
  //       } else {
  //         alert("Failed to send all rows request to backend");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       alert("Failed to send information to backend");
  //     }
  //   };
  //   fetchRows();
  // }, [selected_Columns]);

  return dataArrived ? (
    <div className="w-2/3 h-max bg-white border border-black">
      <div className="w-full h-[8vh] flex items-center justify-center">
        <p className="text-2xl font-semibold ">Columns</p>
      </div>
      {/* Source Pipeline Table */}
      {source_columns?.length > 0 ? (
        <div className="h-[22vh] overflow-y-auto border-y border-black">
          {source_columns && source_columns.length > 0 ? (
            source_columns.map((element, index) => (
              <div key={index}>
                <p className="p-2 text-sm font-bold">
                  {`Tablename: ${element.tableName}`}
                </p>

                {element.columns.map((column_name, idx) => {
                  const uniqueId = `${index}-${idx}`; // Ensuring uniqueness
                  return (
                    <div key={uniqueId}>
                      <div
                        className="border-t px-2 border-black flex items-center hover:bg-blue-200 hover:cursor-pointer"
                        onClick={() => toggleSelection(uniqueId)}
                      >
                        <p className="w-full py-1 text-sm">{column_name}</p>
                        <div className="tickbox flex justify-center items-center w-5 h-5 rounded-sm border border-green-700 bg-white">
                          <div
                            className={`check w-full h-full bg-white-tick bg-cover bg-green-400 ${selectedIndexes.has(uniqueId) ? "" : "hidden"
                              }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div>
              <p>No data available</p>
            </div>
          )}

          {/* Destination Pipeline Table */}
        </div>
      ) : (
        <div className="h-[22vh] overflow-y-auto border-y border-black">
          {odoo_columns?.length > 0 &&
            odoo_columns.map((row, index) => (
              <div key={index}>
                <p className="p-2 font-bold text-sm">{row.table}</p>

                {/* Check if row.columns exists before mapping over it */}
                {row.columns.map((column, idx) => {
                  const uniqueId = `${index}-${idx}`; // Ensuring uniqueness
                  return (
                    <div key={uniqueId}>
                      <div
                        className="border-t px-2 border-black flex items-center hover:bg-blue-200 hover:cursor-pointer"
                        onClick={() => toggleSelection(uniqueId)}
                      >
                        <p className="w-full text-sm py-1">{column.name}</p>
                        <div className="tickbox flex justify-center items-center w-5 h-5 border border-green-700 bg-white">
                          <div
                            className={`check w-full h-full bg-white-tick bg-cover bg-green-400  ${selectedIndexes.has(uniqueId) ? "" : "hidden"
                              }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      )}
      <div className="w-full flex h-[10vh] justify-end">
        <button
          ref={ClearbuttonRef}
          onClick={() => {
            ClearTicked(setSelectedIndexes, settickedboxes);
          }}
          className={`w-1/3 h-1/2 my-4 mx-2 rounded-md text-white ${tickedboxes > 0
            ? "bg-red-400 cursor-pointer"
            : "bg-red-200 cursor-auto"
            }`}
        >
          Clear
        </button>
        <button
          onClick={ClickSelect}
          ref={SelectbuttonRef}
          className={`w-1/3 h-1/2 my-4 mx-2 rounded-md text-white ${tickedboxes > 0
            ? "bg-blue-500 cursor-pointer"
            : "bg-blue-300 cursor-auto"
            }`}
        >
          Select
        </button>
      </div>
    </div>
  ) : <SpinnerBox />;
}
