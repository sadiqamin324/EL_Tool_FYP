import { useContext, useEffect, useState } from "react";
import { Source_Rows, Password } from "../components/Context";
import { data, useNavigate } from "react-router-dom";

export function Rows() {
  const { source_rows } = useContext(Source_Rows);
  const navigate = useNavigate();
  const [isSave, setisSave] = useState(false);
  const { Global_Password } = useContext(Password);

  return (
    <div>
      <DialogueBox
        isSave={isSave}
        setisSave={setisSave}
        dumpdata={source_rows}
        password={Global_Password}
      />
      <div
        className={`${isSave ? "blur-md" : "blur-0"} h-[70vh] overflow-auto`}
      >
        {source_rows && source_rows.length > 0 ? (
          source_rows.map((element, index) => (
            <div className="flex items-center mb-8 flex-col">
              <div className="flex justify-center my-2">
                <p className="text-xl mx-2" key={index}>
                  {`Database: `}
                  <a className="font-bold">{element.database}</a>
                </p>
                <p className="text-xl mx-2" key={index}>
                  {`Table: `}
                  <a className="font-bold">{element.tableName}</a>
                </p>
              </div>

              <div
                className="grid w-max gap-x-8 py-2 px-4 border"
                style={{
                  gridTemplateColumns: `repeat(${element.columnArray.length},minmax(50px,100px))`,
                }}
              >
                {element.columnArray.map((column, idx) => (
                  <div>
                    <p className={`font-semibold text-center`}>{column}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                {element.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid gap-x-8 w-max border py-2 px-4"
                    style={{
                      gridTemplateColumns: `repeat(${element.columnArray.length},minmax(50px,100px))`,
                    }}
                  >
                    {element.columnArray.map((col, colIndex) => (
                      <p className={`text-center break-words`} key={colIndex}>
                        {row[col]}
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
  );
}

function DialogueBox({ isSave, setisSave, dumpdata, password }) {
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
      console.log(data);
      if (data.success) {
        console.log("flag sent to backend");
      } else {
        alert("failed to send flag to backend");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send information to backend");
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
                {Object.values(row)[1]}
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
