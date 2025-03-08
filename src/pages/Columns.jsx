import { tab } from "@material-tailwind/react";
import {
  Password,
  SourceTables,
  DestTables,
  SourceColumns,
} from "../components/Context";
import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Columns() {
  const [tickedboxes, settickedboxes] = useState(0);
  const { dest_columns } = useContext(DestTables);
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());
  const [selectedTables, setselectedTables] = useState(null);
  const SelectbuttonRef = useRef(null);
  const ClearbuttonRef = useRef(null);
  const { Global_Password } = useContext(Password);
  const { source_columns } = useContext(SourceColumns);
  const navigate = useNavigate();

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

  function ClickSelect() {
    source_columns.map((element) => {
      console.log(element);
    });
  }

  //   function ClearTicked() {
  //     setSelectedIndexes(new Set()); // Reset selected checkboxes
  //     settickedboxes(0); // Reset counter
  //   }

  useEffect(() => {
    if (!SelectbuttonRef.current || !ClearbuttonRef.current) return; // Ensure button exists before modifying
    const isActive = tickedboxes > 0;
    SelectbuttonRef.current.className = `w-1/6 h-1/2 my-4 mx-2 rounded-md text-white  ${
      isActive ? "bg-blue-500 cursor-pointer" : "bg-blue-300 cursor-auto"
    }`;

    ClearbuttonRef.current.className = `w-1/6 h-1/2 my-4 mx-2 rounded-md text-white  ${
      isActive ? "bg-red-400 cursor-pointer" : "bg-red-200 cursor-auto"
    }`;
  }, [tickedboxes]);

  return (
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
                  <p className="text-center text-lg font-bold">
                    {element.tableName}
                  </p>
                  {element.columns.map((column_name, idx) => {
                    const uniqueId = `${index}-${idx}`; // Ensuring uniqueness
                    return (
                      <div key={uniqueId}>
                        <div
                          className="border-t p-2 border-black flex items-center hover:bg-blue-200 hover:cursor-pointer"
                          onClick={() => toggleSelection(uniqueId)}
                        >
                          <p className="w-full text-center text-sm">
                            {column_name}
                          </p>
                          <div className="tickbox flex justify-center items-center w-5 h-5 rounded-sm border border-green-700 bg-white mr-1">
                            <div
                              className={`check w-full h-full bg-cover bg-white-tick bg-green-400 ${
                                selectedIndexes.has(uniqueId) ? "" : "hidden"
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
            {/* <button
              ref={ClearbuttonRef}
              className="self-center w-1/6 h-1/2 my-4 mx-2 text-white rounded-md"
            >
              Clear All
            </button>
            <button
              onClick={ClickSelect}
              ref={SelectbuttonRef}
              className="w-1/6 h-1/2 self-end my-4 mx-2 rounded-md text-white"
            >
              Select
            </button> */}
          </div>
        </div>

        <div className="flex flex-col w-1/2 overflow-x-auto">
          <div className="grid grid-cols-7 gap-x-4 py-2 pr-4 border-y border-l border-black w-[100rem]">
            {dest_columns &&
              dest_columns.length > 0 &&
              Object.entries(dest_columns[0]).map(([key, value]) => (
                <p key={key} className="py-1 text-center font-semibold text-sm">
                  {key}
                </p>
              ))}
          </div>
          <div className="grid grid-cols-7 gap-x-4 py-2 pr-4 border-y border-r border-black w-[100rem]">
            {dest_columns && dest_columns.length > 0 ? (
              dest_columns.map((row, index) =>
                Object.entries(row).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-center text-sm">{value}</p>
                  </div>
                ))
              )
            ) : (
              <div>
                <p>No data available</p>
              </div>
            )}

            {/* Destination Pipeline Table */}
          </div>
        </div>
      </div>
    </div>
  );
}
