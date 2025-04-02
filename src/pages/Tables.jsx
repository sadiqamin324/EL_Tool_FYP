import { tab } from "@material-tailwind/react";
import {
  Password,
  SourceTables,
  DestTables,
  SourceColumns,
  Odoo_Data,
} from "../components/Context";
import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  toggleSelection,
  ClearTicked,
  Track_ticked,
} from "../components/Functions";
import { use } from "react";
import { LoaderPage } from "../components/Loader";

export function Tables() {
  const [tickedboxes1, settickedboxes1] = useState(0);
  const [selectedIndexes1, setSelectedIndexes1] = useState(new Set());
  const [tickedboxes2, settickedboxes2] = useState(0);
  const [selectedIndexes2, setSelectedIndexes2] = useState(new Set());
  const { source_tables } = useContext(SourceTables);
  const { dest_columns } = useContext(DestTables);
  const [selectedTables, setselectedTables] = useState(null);
  const SelectbuttonRef = useRef(null);
  const ClearbuttonRef = useRef(null);
  const { Global_Password } = useContext(Password);
  const { setsource_columns } = useContext(SourceColumns);
  const { odoo_data, odoo_columns, setodoo_columns } = useContext(Odoo_Data);
  const [dataArrived, setdataArrived] = useState(false);
  const navigate = useNavigate();
  const storage_item_1 = "selectedIndexPostgres";
  const storage_item_2 = "selectedIndexOdoo";

  useEffect(() => {
    if (
      // Check if both source_rows and odoo_records are valid and have data
      source_tables &&
      source_tables.postgres_tables &&
      source_tables.postgres_tables.length > 0 &&
      odoo_data &&
      odoo_data.length > 0
    ) {
      // Set dataArrived to true only when both arrays have data
      setdataArrived(true);
    }
  }, [source_tables, odoo_data]); // Effect depends on both source_rows and odoo_records

  useEffect(() => {
    Track_ticked(setSelectedIndexes1, settickedboxes1, storage_item_1);
    Track_ticked(setSelectedIndexes2, settickedboxes2, storage_item_2);
  }, []);

  async function fetchColumns() {
    try {
      const response = await fetch("http://localhost:5000/get-all-columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedTables, Global_Password }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        console.log("All columns of selected tables recieved from backend");
        setsource_columns(data.columns);
      } else {
        alert("Failed to send All columns request to backend");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send information to backend");
    }
  }
  function ClickSelect() {
    navigate("/all-columns");
    let Postgres_columns = [];
    let Odoo_columns = [];

    [...selectedIndexes1].map((index) => {
      const [beforeDash, afterDash] = index.split("-");
      Postgres_columns.push({
        database: source_tables.postgres_tables[beforeDash].database,
        tablename: source_tables.postgres_tables[beforeDash].tables[afterDash],
      });
    });

    setselectedTables(Postgres_columns);

    [...selectedIndexes2].map((index) => {
      const [beforeDash, afterDash] = index.split("-");
      Odoo_columns.push({
        table: odoo_data[beforeDash].models[afterDash].model,
        columns: odoo_data[beforeDash].models[afterDash].columns,
        rows: odoo_data[beforeDash].models[afterDash].rows,
      });
    });
    setodoo_columns(Odoo_columns);
  }

  useEffect(() => {
    if (!selectedTables || selectedTables.length == 0) return;
    if (!odoo_columns || odoo_columns.length == 0) return;

    fetchColumns();
  }, [selectedTables, odoo_columns]);

  useEffect(() => {
    if (!SelectbuttonRef.current || !ClearbuttonRef.current) return; // Ensure button exists before modifying
    const isActive = (tickedboxes1 || tickedboxes2) > 0;
    SelectbuttonRef.current.className = `w-1/6 h-1/2 my-4 mx-2 rounded-md text-white  ${
      isActive ? "bg-blue-500 cursor-pointer" : "bg-blue-300 cursor-auto"
    }`;

    ClearbuttonRef.current.className = `w-1/6 h-1/2 my-4 mx-2 rounded-md text-white  ${
      isActive ? "bg-red-400 cursor-pointer" : "bg-red-200 cursor-auto"
    }`;
  }, [tickedboxes1, tickedboxes2]);

  return dataArrived ? (
    <div className="w-5/6 h-5/6 bg-white border border-black">
      <div className="w-full h-1/4 flex items-center justify-center">
        <p className="text-2xl font-semibold ">Pipelines</p>
      </div>
      <div className="w-full flex">
        {/* Source Pipeline Table */}
        <div className="flex flex-col w-full overflow-x-auto">
          <div className="flex">
            <div className="h-[40vh] w-1/2 overflow-y-auto grid grid-cols-1 gap-x-4 border-y border-r border-black">
              <div className="grid grid-cols-1 gap-x-4 py-2 pr-4 border-b border-r border-black">
                <div>
                  <p className="text-center text-lg font-semibold">
                    All Postgres SQL Source Tables
                  </p>
                </div>
              </div>
              {source_tables?.postgres_tables?.length > 0 ? (
                source_tables.postgres_tables.map((row, index) => (
                  <div key={index}>
                    <p className="text-center text-md font-semibold py-2">
                      {row.database}
                    </p>
                    {row.tables.map((object, idx) => {
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
                              {object.tablename}
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
            <div className="h-[40vh] w-1/2 overflow-y-auto grid grid-cols-1 gap-x-4 border-y border-r border-black">
              <div className="grid grid-cols-1 gap-x-4 py-2 pr-4 border-b border-r border-black">
                <div>
                  <p className="text-center text-lg font-semibold">
                    All Odoo modules with tables
                  </p>
                </div>
              </div>
              {odoo_data && odoo_data.length > 0 ? (
                odoo_data.map((row, index) => (
                  <div key={index}>
                    <p className="text-center text-lg font-bold py-2">
                      {row.module}
                    </p>

                    {row.models && row.models.length > 0 ? ( // ✅ Check if models exist
                      row.models.map((model_row, idx) => {
                        const uniqueId = `${index}-${idx}`; // Ensuring uniqueness
                        return (
                          <div key={uniqueId}>
                            <div
                              className="border-t p-2 border-black flex items-center hover:bg-blue-200 hover:cursor-pointer"
                              onClick={() => {
                                toggleSelection(
                                  uniqueId,
                                  setSelectedIndexes2,
                                  settickedboxes2,
                                  storage_item_2
                                );
                              }}
                            >
                              <p className="w-full text-center text-sm">
                                {model_row.model}
                              </p>
                              <div className="tickbox flex justify-center items-center w-5 h-5 rounded-sm border border-green-700 bg-white mr-1">
                                <div
                                  className={`check w-full h-full bg-cover bg-white-tick bg-green-400 ${
                                    selectedIndexes2.has(uniqueId)
                                      ? ""
                                      : "hidden"
                                  }`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-gray-500 text-sm">
                        No models found
                      </p> // ✅ Handle empty models
                    )}
                  </div>
                ))
              ) : (
                <div>
                  <p>No data available</p>
                </div>
              )}

              {/* Destination Pipeline Table */}
            </div>
          </div>
          <div className="w-full flex h-[10vh]">
            <div className="w-2/3">
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 w-1/5 h-1/2 my-4 mx-2 text-white rounded-md"
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
              className={`h-1/2 my-4 mx-2 rounded-md text-white ${
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
              className={`h-1/2 my-4 mx-2 rounded-md text-white ${
                (tickedboxes1 || tickedboxes2) > 0
                  ? "bg-red-400 cursor-pointer"
                  : "bg-red-200 cursor-auto"
              }`}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <LoaderPage />
  );
}
