import { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { SourceTables } from "../components/Context";
import { ClearTicked, toggleSelection } from "../components/Functions";
import { Odoo_Data } from "../components/Context";
import { LoaderPage } from "../components/Loader";

export function OdooModules({ setshowTable }) {
  const { source_tables } = useContext(SourceTables);
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());
  const [selectedmodules, setselectedmodules] = useState(null);
  const [dataArrived, setdataArrived] = useState(false);
  const [tickedboxes, settickedboxes] = useState(0);
  const { setodoo_data } = useContext(Odoo_Data);

  useEffect(() => {
    if (
      // Check if both source_rows and odoo_records are valid and have data
      source_tables &&
      source_tables.odoo_modules &&
      source_tables.odoo_modules.modules &&
      source_tables.odoo_modules.modules.length > 0
    ) {
      // Set dataArrived to true only when both arrays have data

      setdataArrived(true);
    }
  }, [source_tables]);

  const storage_item = "selectedOdooModules";

  function ClickSelect() {
    let all_modules = { database: null, modules: [] };
    all_modules.database = source_tables.odoo_modules.database;
    [...selectedIndexes].map((index) => {
      all_modules.modules.push(source_tables.odoo_modules.modules[index]);
    });

    setselectedmodules(all_modules);
  }
  useEffect(() => {
    const storedSelections = sessionStorage.getItem("selectedOdooModules");
    if (storedSelections) {
      const parsedSelections = JSON.parse(storedSelections);
      setSelectedIndexes(new Set(parsedSelections));
      settickedboxes(parsedSelections.length); // Ensure buttons update
    }
  }, []);

  useEffect(() => {
    if (!selectedmodules || selectedmodules.length === 0) return;

    const fetchTables = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-odoo-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedmodules }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.success) {
          setshowTable(true);
          console.log(
            "All table names of selected odoo modules recieved from backend"
          );
          setodoo_data(data.tables);
        } else {
          alert("Failed to fetch all tables");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send information to backend");
      }
    };
    fetchTables();
  }, [selectedmodules]);

  return dataArrived ? (
    <div className="flex flex-col w-2/3 overflow-x-auto">
      <div className="py-2 pr-4 border-t border-x border-black">
        <div className="h-[8vh] flex items-center justify-center">
          <p className="text-center font-semibold text-2xl">Odoo Modules</p>
        </div>
      </div>
      <div className="h-[22vh] overflow-y-auto border border-black">
        <div className="p-2">
          <p className="py-1 font-semibold text-sm">module_name</p>
        </div>
        {source_tables?.odoo_modules?.modules?.length > 0 ? (
          source_tables.odoo_modules.modules.map((row, index) => (
            <div
              key={index}
              className="border-t px-2 border-black flex items-center hover:bg-blue-200 hover:cursor-pointer"
              onClick={() =>
                toggleSelection(
                  index,
                  setSelectedIndexes,
                  settickedboxes,
                  storage_item
                )
              }
            >
              <p className="w-full py-1 text-sm">{row.name}</p>
              <div className="tickbox flex justify-center items-center w-5 h-5 rounded-full border border-green-700 bg-white">
                <div
                  className={`check w-2 h-2 rounded-full bg-green-400 ${
                    selectedIndexes.has(index) ? "" : "hidden"
                  }`}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>No data available</p>
          </div>
        )}
      </div>
      <div className="w-full border-black border-b border-x flex h-[8vh] justify-end items-center">
        <button
          onClick={() => {
            ClearTicked(setSelectedIndexes, settickedboxes, storage_item);
          }}
          className={`w-1/3 h-2/3 my-4 mx-2 rounded-md text-white ${
            tickedboxes > 0
              ? "bg-blue-500 cursor-pointer"
              : "bg-blue-300 cursor-auto"
          }`}
        >
          Clear
        </button>
        <button
          onClick={ClickSelect}
          className={`w-1/3 h-2/3 my-4 mx-2 rounded-md text-white ${
            tickedboxes > 0
              ? "bg-red-400 cursor-pointer"
              : "bg-red-200 cursor-auto"
          }`}
        >
          Select
        </button>
      </div>
    </div>
  ) : null;
}
