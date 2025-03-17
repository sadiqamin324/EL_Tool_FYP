import { useEffect, useState, useRef, useContext } from "react";
import { SourceTables, DestTables, Password } from "../components/Context.js";
import { Navigate, useNavigate } from "react-router-dom";
import { Tables } from "./Tables.jsx";

export function Pipeline() {
  const [SourceData, setSourceData] = useState(null);
  const [password, setpassword] = useState(null);
  const navigate = useNavigate(null);

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
        
          setSourceData(data.source_data);
          // setDesinationData(data.destination_data);
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

  return (
    <div className="w-[100rem] h-[98vh]">
      <div className="flex h-1/2 justify-around items-center">
        <SourceBox title="Source" data={SourceData} password={password} />
      </div>
      <div className="w-full">
        <button
          onClick={() => navigate(-1)}
          className="ml-4 bg-blue-400 self-start w-[8%] h-[5vh] my-4 mx-2 text-white rounded-md"
        >
          Back
        </button>
      </div>
    </div>
  );
}

function SourceBox({ title = "", data, password }) {
  const [tickedboxes, settickedboxes] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState(new Set()); // Track checked boxes
  const [selectedSources, setselectedSources] = useState(null);
  const buttonRef = useRef(null);
  const source_name_ref = useRef(null);
  const { setsource_tables } = useContext(SourceTables);
  const { setdest_columns } = useContext(DestTables);
  const navigate = useNavigate();

  let modifier;

  let ShortTitle;
  let count = 0;
  if (title == "Destination") {
    ShortTitle = title.slice(0, 4);
  } else {
    ShortTitle = title;
  }

  useEffect(() => {
    const storedSelections = localStorage.getItem("selectedIndexesSources");
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
        "selectedIndexesSources",
        JSON.stringify([...newSet])
      );

      return newSet;
    });
  }

  function ClickSelect() {
    let selectedNames = [];

    [...selectedIndexes].map((index) => {
      selectedNames.push(Object.values(data[index])[0]);

      setselectedSources(selectedNames);
      navigate("/all-tables");
    });
  }

  useEffect(() => {
    if (!selectedSources || selectedSources.length === 0) return;

    const fetchTables = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-all-tables", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, selectedSources, password }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.success) {
          console.log(
            "All table names of selected sources/destinations recieved from backend"
          );
          if (title == "Source") {
            setsource_tables(data.tables);
          } else if (title == "Destination") {
            setdest_columns(data.columns);
          }
        } else {
          alert("Failed to send All tables request to backend");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send information to backend");
      }
    };
    fetchTables();
  }, [selectedSources]);

  return (
    <div className="w-[48%] h-5/6 bg-white border border-black">
      <div className="w-full h-1/4 flex items-center justify-center">
        <p className="text-2xl font-semibold ">{ShortTitle}</p>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="w-full h-[22vh] flex flex-col overflow-y-auto">
          <div className="px-2 py-2 border-y border-black">
            <p className="py-1 font-semibold text-sm">{ShortTitle + "_name"}</p>
          </div>
          {data && data.length > 0 ? (
            Object.values(data).map((row, index) => (
              <div
                onClick={() => toggleSelection(index)}
                className="flex items-center justify-between px-2 border-b border-black hover:bg-blue-200 cursor-pointer"
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
        </div>
      </div>
      <div className="w-full flex h-[10vh]">
        <button
          ref={buttonRef}
          onClick={ClickSelect}
          className={`w-1/6 h-1/2 my-4 mx-2 rounded-md text-white ${
            tickedboxes > 0
              ? "bg-blue-500 cursor-pointer"
              : "bg-blue-300 cursor-auto"
          }`}
        >
          Select
        </button>
      </div>
    </div>
  );
}
