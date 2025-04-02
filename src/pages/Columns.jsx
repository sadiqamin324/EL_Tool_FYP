import { tab } from "@material-tailwind/react";
import {
  Password,
  DestTables,
  SourceColumns,
  Source_Rows,
  Odoo_Data,
} from "../components/Context";
import { useContext, useRef, useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import {
  toggleSelection,
  ClearTicked,
  Track_ticked,
} from "../components/Functions";
import { LoaderPage } from "../components/Loader";

export function Columns() {
  const [tickedboxes1, settickedboxes1] = useState();
  const [tickedboxes2, settickedboxes2] = useState();
  const [selectedIndexes1, setSelectedIndexes1] = useState(new Set());
  const [selectedIndexes2, setSelectedIndexes2] = useState(new Set());
  const { dest_columns } = useContext(DestTables);
  const [selected_Columns, setselected_Columns] = useState(null);
  const [dataArrived, setdataArrived] = useState(false);
  const SelectbuttonRef = useRef(null);
  const ClearbuttonRef = useRef(null);
  const { source_columns } = useContext(SourceColumns);
  const { setsource_rows } = useContext(Source_Rows);
  const { Global_Password } = useContext(Password);
  const { odoo_columns, setodoo_records } = useContext(Odoo_Data);

  const navigate = useNavigate();
  const storage_item_1 = "selectedColumnsPostgres";
  const storage_item_2 = "selectedColumnsOdoo";

  useEffect(() => {
    if (
      source_columns &&
      source_columns.length &&
      odoo_columns &&
      odoo_columns.length
    ) {
      setdataArrived(true);
    }
  }, [source_columns, odoo_columns]);

  useEffect(() => {
    Track_ticked(setSelectedIndexes1, settickedboxes1, storage_item_1);
    Track_ticked(setSelectedIndexes2, settickedboxes2, storage_item_2);
  }, []);

  function Group_PSQL_Columns(data) {
    return Object.values(
      data.reduce((acc, item) => {
        const key = `${item.database}-${item.tableName}`;

        if (!acc[key]) {
          acc[key] = {
            database: item.database,
            tableName: item.tableName,
            columns: [],
          };
        }

        acc[key].columns.push(item.column);
        return acc;
      }, {})
    );
  }
  function Group_Odoo_Columns(data) {
    // Initialize an empty object to store the grouped data
    const groupedData = {};

    // Iterate over each object in the data array
    data.forEach((item) => {
      const { tableName, columnArray, rows } = item;

      // If the table doesn't exist in the groupedData object, create it
      if (!groupedData[tableName]) {
        groupedData[tableName] = {
          tableName: tableName, // Add the table key
          columnArray: [], // Initialize columns array
          rows: rows, // Rows are the same for all columns in the table
        };
      }

      // Push the column to the corresponding table's columns list
      groupedData[tableName].columnArray.push(columnArray);
    });

    // Now return the result without the table name at the top level
    const result = Object.values(groupedData);

    return result;
  }
  function ClickSelect() {
    let selectedPostgresColumns = [];
    let selectedOdooColumns = [];

    [...selectedIndexes1].forEach((index) => {
      const [beforeDash, afterDash] = index.split("-");
      selectedPostgresColumns.push({
        database: source_columns[beforeDash].database,
        tableName: source_columns[beforeDash].tableName, // Fixed key
        column: source_columns[beforeDash].columns[afterDash],
      });
    });

    [...selectedIndexes2].forEach((index) => {
      const [beforeDash, afterDash] = index.split("-");
      selectedOdooColumns.push({
        tableName: odoo_columns[beforeDash].table,
        columnArray: odoo_columns[beforeDash].columns[afterDash].name,
        rows: odoo_columns[beforeDash].rows,
      });
    });

    const groupedData1 = Group_PSQL_Columns(selectedPostgresColumns); // Debug output
    const groupedData2 = Group_Odoo_Columns(selectedOdooColumns); // Debug output
    setselected_Columns(groupedData1);
    setodoo_records(groupedData2);
  }

  useEffect(() => {
    if (!selected_Columns || selected_Columns.length === 0) return;

    const fetchRows = async () => {
      navigate("/all-rows");
      try {
        const response = await fetch("http://localhost:5000/get-all-rows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selected_Columns, Global_Password }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.success) {
          console.log("All rows of selected columns recieved from backend");
          setsource_rows(data.rows);
        } else {
          alert("Failed to send all rows request to backend");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send information to backend");
      }
    };
    fetchRows();
  }, [selected_Columns]);

  return dataArrived ? (
    <div className="w-5/6 h-5/6 bg-white border border-black">
      <div className="w-full h-1/4 flex items-center justify-center">
        <p className="text-2xl font-semibold ">Pipelines</p>
      </div>
      <div className="w-full flex">
        {/* Source Pipeline Table */}
        <div className="flex flex-col w-1/2 overflow-x-auto">
          <div className="grid grid-cols-1 gap-x-4 py-2 pr-4 border-y border-r border-black">
            <div>
              <p className="text-center">Columns of Selected Source Tables</p>
            </div>
          </div>
          <div className="h-[40vh] overflow-y-auto grid grid-cols-1 gap-x-4 py-2 border-y border-r border-black">
            {source_columns && source_columns.length > 0 ? (
              source_columns.map((element, index) => (
                <div key={index}>
                  <div className="flex justify-evenly">
                    <p className="text-center text-lg font-bold">
                      {`Database: ${element.database}`}
                    </p>
                    <p className="text-center text-lg font-bold">
                      {`Tablename: ${element.tableName}`}
                    </p>
                  </div>
                  {element.columns.map((column_name, idx) => {
                    const uniqueId = `${index}-${idx}`; // Ensuring uniqueness
                    return (
                      <div key={uniqueId}>
                        <div
                          className="border-t p-2 border-black flex items-center hover:bg-blue-200 hover:cursor-pointer"
                          onClick={() =>
                            toggleSelection(
                              uniqueId,
                              setSelectedIndexes1,
                              settickedboxes1,
                              storage_item_1
                            )
                          }
                        >
                          <p className="w-full text-center text-sm">
                            {column_name}
                          </p>
                          <div className="tickbox flex justify-center items-center w-5 h-5 rounded-sm border border-green-700 bg-white mr-1">
                            <div
                              className={`check w-full h-full bg-cover bg-white-tick bg-green-400 ${
                                selectedIndexes1.has(uniqueId) ? "" : "hidden"
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
          <div className="w-full flex h-[10vh]">
            <div className="w-2/3">
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 self-start w-1/4 h-1/2 my-4 mx-2 text-white rounded-md"
              >
                Back
              </button>
            </div>
            <button
              ref={ClearbuttonRef}
              onClick={() => {
                ClearTicked(
                  setSelectedIndexes1,
                  settickedboxes1,
                  storage_item_1
                );
                ClearTicked(
                  setSelectedIndexes2,
                  settickedboxes2,
                  storage_item_2
                );
              }}
              className={`w-1/6 h-1/2 my-4 mx-2 rounded-md text-white ${
                (tickedboxes1 || tickedboxes2) > 0
                  ? "bg-blue-500 cursor-pointer"
                  : "bg-blue-300 cursor-auto"
              }`}
            >
              Clear All
            </button>
            <button
              onClick={ClickSelect}
              ref={SelectbuttonRef}
              className={`w-1/6 h-1/2 my-4 mx-2 rounded-md text-white ${
                (tickedboxes1 || tickedboxes2) > 0
                  ? "bg-red-400 cursor-pointer"
                  : "bg-red-200 cursor-auto"
              }`}
            >
              Select
            </button>
          </div>
        </div>

        <div className="flex flex-col w-1/2 overflow-x-auto">
          <div className="grid grid-cols-1 gap-x-4 py-2 pr-4 border-y border-r border-black">
            <div>
              <p className="text-center">Columns of Selected Odoo Tables</p>
            </div>
          </div>
          <div className="h-[40vh] overflow-y-auto grid grid-cols-1 gap-x-4 py-2 border-y border-l border-black">
            {odoo_columns?.length > 0 &&
              odoo_columns.map((row, index) => (
                <div key={index}>
                  <p className="py-1 text-center font-semibold text-lg">
                    {`Tablename: ${row.table}`}
                  </p>

                  {/* Check if row.columns exists before mapping over it */}
                  {row.columns.map((column, idx) => {
                    const uniqueId = `${index}-${idx}`; // Ensuring uniqueness
                    return (
                      <div key={uniqueId}>
                        <div
                          className="border-t p-2 border-black flex items-center hover:bg-blue-200 hover:cursor-pointer"
                          onClick={() =>
                            toggleSelection(
                              uniqueId,
                              setSelectedIndexes2,
                              settickedboxes2,
                              storage_item_2
                            )
                          }
                        >
                          <p className="w-full text-center text-sm">
                            {column.name}
                          </p>
                          <div className="tickbox flex justify-center items-center w-5 h-5 rounded-sm border border-green-700 bg-white mr-1">
                            <div
                              className={`check w-full h-full bg-cover bg-white-tick bg-green-400 ${
                                selectedIndexes2.has(uniqueId) ? "" : "hidden"
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
        </div>
      </div>
    </div>
  ) : (
    <LoaderPage />
  );
}
