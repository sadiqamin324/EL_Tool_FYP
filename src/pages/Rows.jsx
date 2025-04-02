import { useContext, useEffect, useState } from "react";
import { Source_Rows, Password, Odoo_Data } from "../components/Context";
import { LoaderPage } from "../components/Loader";
import { data, useNavigate } from "react-router-dom";
import "./../App.css";
import { handleError } from "../components/Functions";
export function Rows() {
  const { source_rows } = useContext(Source_Rows);
  const navigate = useNavigate();
  const [isSave, setisSave] = useState(false);
  const [dataArrived, setdataArrived] = useState(false);
  const { Global_Password } = useContext(Password);
  const { odoo_records } = useContext(Odoo_Data);
  useEffect(() => {
    if (
      // Check if both source_rows and odoo_records are valid and have data
      source_rows &&
      source_rows.length > 0 &&
      odoo_records &&
      odoo_records.length > 0
    ) {
      // Set dataArrived to true only when both arrays have data
      setdataArrived(true);
    }
  }, [source_rows, odoo_records]); // Effect depends on both source_rows and odoo_records

  return dataArrived ? (
    <div>
      <DialogueBox
        isSave={isSave}
        setisSave={setisSave}
        dump_postgres_data={source_rows}
        dump_odoo_data={odoo_records}
        password={Global_Password}
      />
      <div
        className={`${isSave ? "blur-md" : "blur-0"} h-[70vh] overflow-auto`}
      >
        <div className="flex justify-evenly">
          <div className="flex flex-col border-r pr-48 border-black">
            <div className="pt-10 pb-4">
              <h1 className="text-center text-3xl ">
                Selected Postgres Tables
              </h1>
            </div>
            {source_rows && source_rows?.length > 0 ? (
              source_rows.map((element, index) => (
                <div
                  key={index}
                  className="flex items-between mb-8 flex-col w-[30rem] h-[70vh] pr-16 border-r-2 py-8 overflow-auto custom-scrollbar"
                >
                  {/* Database and Table Name */}
                  <div className="flex justify-center my-2">
                    <p className="text-lg mx-2">
                      {`Database: `}
                      <a className="font-bold text-center">
                        {element.database}
                      </a>
                    </p>
                    <p className="text-lg mx-2">
                      {`Table: `}
                      <a className="font-bold text-center">
                        {element.tableName}
                      </a>
                    </p>
                  </div>

                  {/* Column Headers */}
                  <div
                    className="grid w-max gap-x-8 py-2 px-4 border bg-gray-200 rounded-t-lg"
                    style={{
                      gridTemplateColumns: `repeat(${element.columnArray.length},minmax(50px,100px))`,
                    }}
                  >
                    {element?.columnArray?.length > 0 ? (
                      element.columnArray.map((column, idx) => (
                        <div key={idx}>
                          <p className="font-semibold text-center text-sm">
                            {column}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div>
                        <p className="font-semibold text-center text-sm">
                          No columns available
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Rows */}
                  <div className="flex flex-col">
                    {element?.rows?.length > 0 &&
                    element?.columnArray?.length > 0 ? (
                      element.rows.slice(0, 50).map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="grid gap-x-8 w-max border py-2 px-4"
                          style={{
                            gridTemplateColumns: `repeat(${element.columnArray.length}, minmax(50px, 100px))`,
                          }}
                        >
                          {element.columnArray.map((col, colIndex) => (
                            <p
                              key={colIndex}
                              className="text-center text-sm break-words"
                            >
                              {JSON.stringify(row[col])}
                            </p>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div>
                        <p className="font-semibold text-center text-sm">
                          No data available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>No data available</div>
            )}
          </div>
          <hr className="w-[.5px] bg-black" />
          <div className="flex flex-col">
            <div className="pt-10 pb-4">
              <h1 className="text-center text-3xl ">Selected Odoo Tables</h1>
            </div>
            {odoo_records && odoo_records?.length > 0 ? (
              odoo_records.map((object, index) => (
                <div
                  key={index}
                  className="flex items-between mb-8 flex-col w-[30rem] h-[70vh] overflow-auto pr-16 py-8 custom-scrollbar"
                >
                  <div className="flex justify-center my-2">
                    <p className="text-lg mx-2">
                      {`Table: `}
                      <a className="font-bold">{object.tableName}</a>
                    </p>
                  </div>

                  <div
                    className="grid w-max gap-x-8 py-2 px-4 border bg-gray-200 rounded-t-lg"
                    style={{
                      gridTemplateColumns: `repeat(${object.columnArray.length},minmax(75px, 150px))`,
                    }}
                  >
                    {object.columnArray.map((column, idx) => (
                      <div key={idx}>
                        <p className="font-semibold text-center text-sm">
                          {column}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col">
                    {object.rows.slice(0, 50).map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="grid gap-x-8 w-max border py-2 px-4"
                        style={{
                          gridTemplateColumns: `repeat(${object.columnArray.length},minmax(75px, 150px))`,
                        }}
                      >
                        {object.columnArray.map((col, colIndex) => (
                          <p
                            key={colIndex}
                            className="text-center text-sm break-words"
                          >
                            {JSON.stringify(row[col])}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div>No data available</div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/2">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 w-1/5 h-[5vh] my-4 mx-2 text-white rounded-lg"
        >
          Back
        </button>
        <button
          onClick={() => setisSave((prev) => !prev)}
          className="bg-red-400 w-1/5 h-[5vh] my-4 mx-2 text-white rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  ) : (
    <LoaderPage />
  );
}

function DialogueBox({
  isSave,
  setisSave,
  dump_postgres_data,
  dump_odoo_data,
  password,
}) {
  const [DestinationData, setDestinationData] = useState();
  const [tickedboxes, settickedboxes] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/get-pipeline-data",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.success) {
          console.log("pipeline data recieved from backend");
          setDestinationData(data.destination_data);
        } else {
          alert("failed to send pipeline data request to backend");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send information to backend");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedSelections = localStorage.getItem("selectedIndexesDestination");
    if (storedSelections) {
      const parsedSelections = JSON.parse(storedSelections);
      setSelectedIndexes(new Set(parsedSelections));
      settickedboxes(parsedSelections.length); // Ensure buttons update
    }
  }, []);

  function toggleSelection(index) {
    setSelectedIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index); // Uncheck
      } else {
        newSet.add(index); // Check
      }
      settickedboxes(newSet.size);

      // Save to localStorage
      localStorage.setItem(
        "selectedIndexesDestination",
        JSON.stringify([...newSet])
      );

      return newSet;
    });
  }

  async function DumpData() {
    let database_name;
    [...selectedIndexes].map((index) => {
      database_name = DestinationData[index].database_name;
    });

    //Merging both arrays together
    let dumpdata = dump_postgres_data.concat(dump_odoo_data);

    try {
      const response = await fetch("http://localhost:5000/dump-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, database_name, dumpdata }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        alert("All data dumped to destination successfully");
      } else {
        alert("failed to send flag to backend");
      }
    } catch (error) {
      handleError(error);
    }
  }

  function ClearTicked() {
    setSelectedIndexes(new Set()); // Reset selected checkboxes
    settickedboxes(0); // Reset counter
    localStorage.removeItem("selectedIndexesDestinations"); // Remove from storage
  }

  return (
    <div
      className={`${
        isSave ? "" : "hidden"
      } absolute z-10 w-full flex justify-center items-center h-full bg-transparent`}
    >
      <div className="w-1/2 h-1/2 bg-white border-2 relative bottom-10">
        <div
          className="cross flex justify-center items-center w-8 h-8 bg-red-300 hover:bg-red-500 text-white absolute top-0 right-0 cursor-pointer"
          onClick={() => {
            setisSave(false);
            ClearTicked();
          }}
        >
          <p>X</p>
        </div>
        <p className="text-center font-bold text-xl my-2">All Destinations</p>
        {DestinationData && DestinationData.length > 0 ? (
          Object.values(DestinationData).map((row, index) => (
            <div
              onClick={() => toggleSelection(index)}
              className="flex items-center justify-between px-2 border-y border-black hover:bg-blue-200 cursor-pointer"
              key={index}
            >
              <p className="py-1 text-center text-sm">
                {Object.values(row)[0]}
              </p>
              <div className="flex justify-end items-center">
                <div className="tickbox flex justify-center items-center w-5 h-5 rounded-sm border border-green-700 bg-white mr-1">
                  <div
                    className={`check w-full h-full bg-cover bg-green-400 bg-white-tick ${
                      selectedIndexes.has(index) ? "" : "hidden"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>No data available</p>
          </div>
        )}
        <div className="w-full flex h-[10vh] justify-end">
          <button
            onClick={ClearTicked}
            className={`w-1/6 h-1/2 my-4 mx-2 rounded-md text-white ${
              tickedboxes > 0
                ? "bg-blue-500 cursor-pointer"
                : "bg-blue-300 cursor-auto"
            }`}
          >
            Clear All
          </button>
          <button
            className={`w-1/6 h-1/2 my-4 mx-2 rounded-md text-white ${
              tickedboxes > 0
                ? "bg-red-400 cursor-pointer"
                : "bg-red-200 cursor-auto"
            }`}
            onClick={DumpData}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
