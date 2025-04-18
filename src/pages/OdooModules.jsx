import { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { SourceTables } from "../components/Context";
import { ClearTicked, toggleSelection } from "../components/Functions";
import { Odoo_Data } from "../components/Context";
import { LoaderPage } from "../components/Loader";

export function OdooModules() {
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

  const navigate = useNavigate();
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
      navigate("/all-tables");
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
    <div className="flex flex-col w-1/2 overflow-x-auto">
      <div className="grid grid-cols-1 gap-x-4 py-2 pr-4 border-y border-r border-black">
        <div>
          <p className="text-center">All Odoo Modules</p>
        </div>
      </div>
      <div className="h-[40vh] overflow-y-auto grid grid-cols-1 gap-x-4 py-2 border-y border-r border-black">
        {source_tables?.odoo_modules?.modules?.length > 0 ? (
          source_tables.odoo_modules.modules.map((row, index) => (
            <div
              key={index}
              className="border-t p-2 border-black flex items-center hover:bg-blue-200 hover:cursor-pointer"
              onClick={() =>
                toggleSelection(
                  index,
                  setSelectedIndexes,
                  settickedboxes,
                  storage_item
                )
              }
            >
              <p className="w-full text-center text-sm">{row.name}</p>
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
      <div className="w-full flex h-[10vh] justify-end">
        <div className="w-2/3">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 self-start w-1/4 h-1/2 my-4 mx-2 text-white rounded-md"
          >
            Back
          </button>
        </div>
        <button
          onClick={() => {
            ClearTicked(setSelectedIndexes, settickedboxes, storage_item);
          }}
          className={`w-1/6 h-1/2 my-4 mx-2 rounded-md text-white ${
            tickedboxes > 0
              ? "bg-blue-500 cursor-pointer"
              : "bg-blue-300 cursor-auto"
          }`}
        >
          Clear All
        </button>
        <button
          onClick={ClickSelect}
          className={`w-1/6 h-1/2 my-4 mx-2 rounded-md text-white ${
            tickedboxes > 0
              ? "bg-red-400 cursor-pointer"
              : "bg-red-200 cursor-auto"
          }`}
        >
          Select
        </button>
      </div>
    </div>
  ) : (
    <LoaderPage />
  );
}
