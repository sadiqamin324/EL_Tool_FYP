import {
  useEffect,
  useState,
  useRef,
  useContext,
  useSyncExternalStore,
} from "react";
import { SourceTables, DestTables, Password } from "../components/Context.js";
import { Navigate, useNavigate } from "react-router-dom";
import { LoaderPage } from "../components/Loader.jsx";
import { OdooModules } from "./OdooModules.jsx";
import { Tables } from "./Tables.jsx";
import { Columns } from "./Columns.jsx";
import InputBox from "../components/InputBox.jsx";
import { use } from "react";

// Define initial state shape
const initialPipelineState = {
  pipeline_name: null,
  source_name: null,
  source_type: null,
  source_table_name: null,
  columns: [],
  datatypes: [],
  rows: [],
  dest_db: null,
  dest_table_name: null,
};

export function Pipeline() {
  const [SourceData, setSourceData] = useState(null);
  const [dataArrived, setdataArrived] = useState(false);
  const [password, setpassword] = useState(null);
  const navigate = useNavigate(null);
  const [source_is_Odoo, setsource_is_Odoo] = useState(false);
  const [hasEnter, sethasEnter] = useState(false);
  const [showDest, setshowDest] = useState(false);
  const [showTable, setshowTable] = useState(false);
  const [showCol, setshowCol] = useState(false);
  const [pipeline_record, setpipeline_record] = useState(initialPipelineState);
  const [openDialogue, setopenDialogue] = useState(false);

  useEffect(() => {
    if (
      // Check if both source_rows and odoo_records are valid and have data
      SourceData &&
      SourceData.length > 0
    ) {
      // Set dataArrived to true only when both arrays have data
      setdataArrived(true);
    }
  }, [SourceData]); // Effect depends on both source_rows and odoo_records

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

  return dataArrived ? (
    <div className="w-[100rem] h-[98vh]">
      <div className={`${openDialogue ? "blur-md" : ""} w-1/2 h-[8vh]`}>
        <button
          onClick={() => {
            navigate("/home");
            sethasEnter(false);
            setshowTable(false);
            setshowCol(false);
            setshowDest(false);
            setpipeline_record(initialPipelineState);
          }}
          className="w-1/6 h-1/2 my-4 mx-2 rounded-md text-white bg-blue-500"
        >
          Back
        </button>
      </div>
      <DialogueBox
        pipeline_record={pipeline_record}
        setpipeline_record={setpipeline_record}
        openDialogue={openDialogue}
        setopenDialogue={setopenDialogue}
      />
      <div
        className={`${openDialogue ? "blur-md" : ""} grid grid-cols-3 gap-y-8}`}
      >
        <Pipeline_Name_Box
          setpipeline_record={setpipeline_record}
          sethasEnter={sethasEnter}
        />
        {hasEnter ? (
          <SourceBox
            setpipeline_record={setpipeline_record}
            setshowTable={setshowTable}
            title="Source"
            data={SourceData}
            password={password}
            setsource_is_Odoo={setsource_is_Odoo}
          />
        ) : null}
        {source_is_Odoo ? <OdooModules setshowTable={setshowTable} /> : null}
        {showTable ? <Tables setshowCol={setshowCol} /> : null}
        {showCol ? (
          <Columns
            showDest={showDest}
            setshowDest={setshowDest}
            setpipeline_record={setpipeline_record}
          />
        ) : null}
        {showDest ? (
          <DestinationBox
            setopenDialogue={setopenDialogue}
            pipeline_record={pipeline_record}
            setpipeline_record={setpipeline_record}
          />
        ) : null}
      </div>
    </div>
  ) : (
    <LoaderPage />
  );
}

function SourceBox({
  title = "",
  data,
  password,
  setsource_is_Odoo,
  setshowTable,
  setpipeline_record,
}) {
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

  function toggleSelection(index) {
    setSelectedIndexes((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(index)) {
        newSet.delete(index); // Uncheck
      } else {
        newSet.clear();
        newSet.add(index); // Check
      }

      settickedboxes(newSet.size);

      return newSet;
    });
  }

  function ClickSelect() {
    let selectedNames = [];

    [...selectedIndexes].map((index) => {
      selectedNames.push({
        source_name: Object.values(data[index])[0],
        source_type: Object.values(data[index])[1],
      });

      setselectedSources(selectedNames);
    });
    console.log("Here is the problem", selectedNames[0].source_name);
    if (selectedNames[0].source_type == "Odoo") {
      setpipeline_record((prev) => ({
        ...prev, // Copy all existing properties
        source_name: selectedNames[0].source_name,
        source_type: "Odoo", // Update just this one property
      }));
      setsource_is_Odoo(true);
    } else if (selectedNames[0].source_type == "Postgres SQL") {
      setpipeline_record((prev) => ({
        ...prev, // Copy all existing properties
        source_name: selectedNames[0].source_name,
        source_type: "Postgres SQL", // Update just this one property
      }));
      setsource_is_Odoo(false);
      setshowTable(true);
    }
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
            console.log(data.tables);
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
    <div className="w-2/3 h-max bg-white border border-black">
      <div className="w-full h-[8vh] flex items-center border-b border-black justify-center">
        <p className="text-2xl font-semibold ">{ShortTitle}</p>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="w-full h-[22vh] flex flex-col overflow-y-auto border-b border-black">
          <div className="p-2">
            <p className="py-1 font-semibold text-sm">{ShortTitle + "_name"}</p>
          </div>
          {data && data.length > 0 ? (
            Object.values(data).map((row, index) => (
              <div
                onClick={() => toggleSelection(index)}
                className="flex items-center justify-between px-2 border-t border-black hover:bg-blue-200 cursor-pointer"
                key={index}
              >
                <p className="py-1 text-center text-sm">
                  {Object.values(row)[0]}
                </p>
                <div className="flex justify-end items-center">
                  <div className="tickbox flex justify-center items-center w-5 h-5 rounded-full border border-green-700 bg-white mr-1">
                    <div
                      className={`check w-2 h-2 rounded-full bg-green-400${
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
      <div className="w-full flex h-[10vh] justify-end">
        <button
          ref={buttonRef}
          onClick={ClickSelect}
          className={`w-1/3 h-1/2 my-4 mx-2 rounded-md text-white ${
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

function Pipeline_Name_Box({ sethasEnter, setpipeline_record }) {
  const inputRef = useRef(null);
  const EnterRef = useRef(null);
  const [isEnterDisabled, setIsEnterDisabled] = useState(true);

  const [inputValue, setinputValue] = useState("");
  function HandleClearRef() {
    if (inputRef.current) {
      inputRef.current.value = "";
      setinputValue("");
      setIsEnterDisabled(true);
    }
  }
  useEffect(() => {
    const handleInputChange = () => {
      const value = inputRef.current?.value.trim() || "";
      setIsEnterDisabled(value === "");
      setinputValue(value);
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("input", handleInputChange);
      return () => inputElement.removeEventListener("input", handleInputChange);
    }
  }, []);

  function handleRef() {
    if (inputValue.trim() === "") {
      alert("pipeline name can not be null");
    } else {
      setpipeline_record((prev) => ({
        ...prev, // Copy all existing properties
        pipeline_name: inputValue, // Update just this one property
      }));
      sethasEnter(true);
    }
  }
  return (
    <div className="w-2/3 border border-black">
      <div className="h-[8vh] flex justify-center items-center text-2xl font-semibold ">
        Pipeline
      </div>
      <div className="h-[22vh] p-2 border-black border-y">
        <label htmlFor="">Enter pipeline name:</label>

        <InputBox ref={inputRef} label="name" top="4" />
        {/* { label, type = "text", top = 4, box_with = "full", input_width = "full" } */}
      </div>
      <div className="w-full flex h-[10vh] justify-end items-end">
        <button
          onClick={HandleClearRef}
          className="w-1/3 h-1/2 my-4 mx-2 bg-red-400 rounded-md text-white"
        >
          Clear
        </button>
        <button
          onClick={handleRef}
          disabled={isEnterDisabled}
          className={`w-1/3 h-1/2 my-4 mx-2 rounded-md text-white ${
            isEnterDisabled
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

function DestinationBox({
  pipeline_record,
  setpipeline_record,
  setopenDialogue,
}) {
  const [DestinationData, setDestinationData] = useState(null);
  const [tickedboxes, settickedboxes] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());
  const inputRef2 = useRef(null);
  const [destSelected, setdestSelected] = useState(false);
  const [tableName, settableName] = useState("");
  const [isEnterDisabled, setIsEnterDisabled] = useState(true);
  const [Trigger, setTrigger] = useState(0);

  function HandleClearRef() {
    if (inputRef2.current) {
      inputRef2.current.value = "";
      settableName("");
      setIsEnterDisabled(true);
    }
  }
  useEffect(() => {
    const handleInputChange = () => {
      const value = inputRef2.current?.value.trim() || "";
      setIsEnterDisabled(value == "");

      settableName(value);
    };

    const inputElement = inputRef2.current;
    if (inputElement) {
      inputElement.addEventListener("input", handleInputChange);
      return () => inputElement.removeEventListener("input", handleInputChange);
    }
  }, []);

  function handleRef() {
    if (tableName.trim() === "") {
      alert("table name can not be null");
    } else {
      [...selectedIndexes].map((index) => {
        setpipeline_record((prev) => ({
          ...prev,
          dest_table_name: tableName,
          dest_db: DestinationData[index].destination_name,
        }));
      });
      setopenDialogue(true);
    }
  }

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

  function toggleSelection(index) {
    setSelectedIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index); // Uncheck
        setdestSelected(false);
      } else {
        newSet.clear();
        newSet.add(index); // Check
        setdestSelected(true);
      }
      settickedboxes(newSet.size);

      return newSet;
    });
  }
  return (
    <div className="w-2/3 border border-black">
      <div className="h-[8vh] flex justify-center items-center border-b border-black">
        <p className="text-2xl font-semibold">Destination</p>
      </div>
      <div className="h-[22vh] border-b border-black">
        {DestinationData && DestinationData.length > 0 ? (
          <div>
            {Object.values(DestinationData).map((row, index) => (
              <div key={index}>
                <div
                  onClick={() => toggleSelection(index)}
                  className="flex items-center justify-between px-2 border-b border-black hover:bg-blue-200 cursor-pointer"
                >
                  <p className="py-1 text-center text-sm">
                    {Object.values(row)[0]}
                  </p>
                  <div className="flex justify-end items-center">
                    <div className="tickbox flex justify-center items-center w-5 h-5 rounded-full border border-green-700 bg-white mr-1">
                      <div
                        className={`check w-2 h-2 bg-green-400 rounded-full ${
                          selectedIndexes.has(index) ? "" : "hidden"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-8 h-8 border border-r-blue-400 rounded-full animate-spin"></div>
          </div>
        )}

        <div className={`${destSelected ? "" : "hidden"} p-2`}>
          <label htmlFor="">Enter table name:</label>
          <InputBox ref={inputRef2} label="name" top="4" />
        </div>
      </div>

      <div className="w-full flex h-[10vh] justify-end">
        <button
          onClick={HandleClearRef}
          disabled={isEnterDisabled} // Clear should be disabled when no destination is selected
          className={`w-1/3 h-1/2 my-4 mx-2 rounded-md text-white ${
            isEnterDisabled
              ? "bg-red-200 cursor-auto"
              : "bg-red-400 cursor-pointer"
          }`}
        >
          Clear
        </button>
        <button
          onClick={handleRef}
          disabled={isEnterDisabled} // Enter should be disabled when input is empty OR no destination selected
          className={`w-1/3 h-1/2 my-4 mx-2 rounded-md text-white ${
            isEnterDisabled
              ? "bg-blue-300 cursor-auto"
              : "bg-blue-500 cursor-pointer"
          }`}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

function DialogueBox({
  openDialogue,
  setopenDialogue,
  setpipeline_record,
  pipeline_record,
}) {
  async function AddPipeline() {
    try {
      const response = await fetch("http://localhost:5000/add-pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ pipeline_record }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        console.log("pipeline row added successfully");
        setopenDialogue(false)
        alert(data.message);
      } else {
        alert("Some error occured");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send information to backend");
    }
  }

  return (
    <div
      className={`${
        openDialogue ? "" : "hidden"
      } absolute z-10 flex justify-center items-center w-full h-2/3`}
    >
      <div className="w-1/4 h-1/3 bg-white border border-black p-4">
        <p>Create a new pipeline?</p>

        <div className="w-full flex h-5/6 justify-end items-end">
          <button
            onClick={AddPipeline}
            className="w-1/3 h-1/3 my-4 mx-2 rounded-md text-white bg-blue-500 cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={() => {
              setopenDialogue(false);
            }}
            className="w-1/3 h-1/3 my-4 mx-2 rounded-md text-white bg-red-400 cursor-pointer"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
