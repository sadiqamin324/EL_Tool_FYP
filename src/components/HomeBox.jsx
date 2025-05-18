import {
  useState,
  useEffect,
  useContext,
  useRef,
  useSyncExternalStore,
} from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./Context.js";
import { SourceDestinationflag, Title } from "./Context.js";
import InputBox from "./InputBox.jsx";
//initialize const for collecting source/destination tables data
let table;

export default function Homebox({
  title,
  para_data,
  close_rest = null,
  setclose_rest = null,
}) {
  const [flag, setflag] = useState(null);
  const [dataFlag, setdataFlag] = useState(null);
  const [whichFlag, setwhichFlag] = useState(null);
  const [source, setsource] = useState(null);
  const [Trigger, setTrigger] = useState(0);
  const [sharedValue, setsharedValue] = useState(null);
  const { modifier, setmodifier } = useContext(SourceDestinationflag);
  const { setisSource } = useContext(Title);
  const [timer, settimer] = useState(null);
  const inputRefs = useRef([]);
  const edited_inputRefs = useRef([]);
  const [dialogue_open, setdialogue_open] = useState(false);
  const [save_open, setsave_open] = useState(false);
  const [delete_box, setdelete_box] = useState(false);
  const [article, setarticle] = useState(false);
  const [PipelineTrigger, setPipelineTrigger] = useState(0);
  const [open_pipeline_window, setopen_pipeline_window] = useState(false);
  const [open_schedule_box, setopen_schedule_box] = useState(false);
  const [Time, setTime] = useState(null);
  const [frequency, setfrequency] = useState(null);
  const [Day, setDay] = useState("mon");
  const [pipeline_name, setpipeline_name] = useState(null);
  const [Index, setIndex] = useState(new Set())


  const navigate = useNavigate();
  //for indexes that are running for pipeling
  const running_indexes = new Set();

  function Refresh() {
    setsharedValue(null);
    setdataFlag(null);
    setwhichFlag(null);

    setTimeout(() => {
      let newFlag;
      if (title === "Source") {
        newFlag = 0;
        setdataFlag(newFlag); // Update dataFlag
        setwhichFlag("data-flag"); // Update whichFlag
      } else if (title === "Destination") {
        newFlag = 1;
        setdataFlag(newFlag); // Update dataFlag
        setwhichFlag("data-flag"); // Update whichFlag
      } else if (title === "Pipeline") {
        newFlag = 2;
        setPipelineTrigger(1);
      }
    }, 100); // Minimal delay (next event loop cycle)
  }

  function HandleFlag() {
    setisSource(title == "Source");

    let newFlag;
    if (title == "Source") {
      newFlag = 0;
      setisSource(true);
    } else if (title == "Destination") {
      newFlag = 1;
    } else if (title == "Pipeline") {
      navigate("/pipeline");
      newFlag = 2;
    }
    setflag(newFlag);
    setwhichFlag("flag");
    setTrigger((prev) => prev + 1);
  }

  useEffect(() => {
    let newFlag;
    if (title === "Source") {
      newFlag = 0;
      settimer(0);
    } else if (title === "Destination") {
      newFlag = 1;
      settimer(1000);
    } else if (title === "Pipeline") {
      newFlag = 2;
      settimer(2000);
    }

    setdataFlag(newFlag);
    setwhichFlag("data-flag");
    setmodifier(newFlag); // different delays
  }, [title]);

  async function sendFlagToServer(flagValue, flagtype) {
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/${flagtype}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ flag: flagValue }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.success) {
          console.log("flag sent to backend");

          if (
            data.message ===
            "Recieved source-destination dropdown flag correctly"
          ) {
            navigate("/dropdown");
          } else if (
            data.message === "Received data flag for source-destination"
          ) {
            setsharedValue(data.data);
          }
        } else {
          alert("failed to send flag to backend");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send information to backend");
      }
    }, timer); // 3 seconds delay
  }

  useEffect(() => {
    if (!(title == "Pipeline") && !PipelineTrigger) return;
    async function fetchPipeline() {
      try {
        const response = await fetch(
          `http://localhost:5000/get-pipeline-record`,
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
          console.log("Fetched all pipleine records successfully");
          console.log("pipeline problem", data.pipeline_records);
          setsharedValue(data.pipeline_records);
        } else {
          alert("failed to recive pipeline records from backend");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send information to backend");
      }
    }
    fetchPipeline();
    setPipelineTrigger(0);
  }, [title, PipelineTrigger]);

  useEffect(() => {
    if (flag !== null) {
      sendFlagToServer(flag, whichFlag);
    }
  }, [flag, Trigger]);

  useEffect(() => {
    if (dataFlag !== null && whichFlag !== null) {
      sendFlagToServer(dataFlag, whichFlag);
    }
  }, [dataFlag, whichFlag]);

  function Col(value) {
    if (value == 1) {
      return `${title.toLowerCase()}_name`;
    } else if (value == 2) {
      return `${title.toLowerCase()}_type`;
    } else if (value == 3) {
      return "host";
    } else if (value == 4) {
      return "port_number";
    } else if (value == 5) {
      return "active_status";
    }
  }

  async function RemoveArticle(value) {
    if (!article) return;

    try {
      const response = await fetch("http://localhost:5000/remove-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title, article: value }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        Refresh();
      } else {
        alert("Failed to save changes");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to remove ${title} row with ID ${article.id}`);
    }
  }

  function Save_Details() {
    const values = [];

    let Changes = [];
    let changed_row_id;
    let change_tracker = false;
    // Loop through the rows and columns of inputRefs
    for (let i = 0; i < inputRefs.current.length; i++) {
      let editedValues = [];

      let flag = false;
      for (let j = 0; j < 1; j++) {
        const originalText = inputRefs.current[i][1]?.innerText?.trim();
        const editedValue = edited_inputRefs.current[i][j]?.value?.trim();

        if (originalText !== editedValue) {
          const col = Col(j + 1);
          change_tracker = true;
          flag = true;
          changed_row_id = inputRefs.current[i][0].innerText;
          editedValues.push({ col, editedValue });
          console.log(change_tracker);
        }
      }
      if (flag == true) {
        Changes.push({ changed_row_id, editedValues });
      }
      // console.log("yahn dekhlo", Changes);
    }

    if (!change_tracker) {
      alert("no changes made");
      return;
    }

    async function sendChanges() {
      setsave_open(true);
      for (const [index, obj] of Changes.entries()) {
        try {
          const response = await fetch("http://localhost:5000/insert-changes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: title, object: obj }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          if (data.success) {
          } else {
            alert("Failed to save changes");
            setsave_open(false);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Failed to send information to backend for object");
          setsave_open(false);
        }
      }
      setsave_open(false);
    }

    sendChanges()
      .then(() => {
        Refresh();
      })
      .catch((error) => {
        alert("Failed to load data");
      });
  }
  async function SchedulePipeline(Day, Time, frequency, pipeline_name) {
    try {
      const response = await fetch(`http://localhost:5000/add-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Day, Time, frequency, pipeline_name }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        alert(
          `Successfully added schedule to pipeline with name ${pipeline_name}`
        );
        setopen_schedule_box(false);
        setTime(null);
        setfrequency(null);
      } else {
        alert("failed to add schedule to pipeline with name", pipeline_name);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send information to backend");
    }
  }

  async function RunPipeline(index) {
    const pipeline_record = sharedValue[index];

    setIndex(prevSet => {
      const newSet = new Set(prevSet);
      newSet.add(index);
      return newSet;
    });

    try {
      const response = await fetch(`http://localhost:5000/run-pipeline`, {
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
        console.log("Successfully completed pipeline");
        alert(data.message);

      } else {
        alert("failed to recive pipeline records from backend");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send information to backend");
    }
    setIndex(prevSet => {
      const newSet = new Set(prevSet);
      newSet.delete(index);
      return newSet;
    });
  }

  return (
    <div className="flex flex-col w-full h-80 justify-between mb-8">
      <div
        className={`${dialogue_open ? "" : "hidden"
          } dialogue-box w-1/2 h-1/2 border-2 bg-white absolute`}
      >
        <div
          className={`${delete_box ? "" : "hidden"
            } confirm-delete-box absolute w-full h-2/3 flex justify-center items-center`}
        >
          <div className="w-[48%] h-2/3 border-2 border-black bg-white flex flex-col justify-center items-center gap-2">
            <p>
              Do you want to delete this <a className="lowercase">{title}</a>?
            </p>
            <div className="pr-1 flex w-full gap-x-4 justify-end mt-4">
              <button
                onClick={() => {
                  RemoveArticle(article);
                  setdelete_box(false);
                }}
                className="z-10 bg-red-400 w-1/4 p-2 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setdelete_box(false);
                }}
                className="bg-blue-400 z-10 w-1/4 p-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
        <div
          className={`${save_open ? "" : "hidden"
            } save-transition absolute w-full h-2/3 flex justify-center items-center`}
        >
          <div className="w-[48%] h-2/3 border-2 border-black bg-white flex flex-col justify-center items-center gap-2">
            <p>Saving changes</p>
            <div className="rounded-full w-12 h-12 border-r-blue-400 border-2 animate-spin"></div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-y p-1 gap-2 border-x-2 border-black">
          <p className="break-words text-center">S.No</p>
          <p className="break-words text-center lowercase">{title + "_name"}</p>
        </div>

        <div className="w-full border-x-2 border-y border-black">
          {/* {title!="Pipeline"?()} */}
          {sharedValue?.length > 0 ? (
            sharedValue.map((row, rowIndex) => (
              <div className="grid grid-cols-1 border-y p-1 gap-2">
                {Object.values(row)
                  .slice(1, 2)
                  .map((value, colIndex) => {
                    const unique_id = `${rowIndex}-${colIndex}`;
                    return (
                      <div className="flex justify-evenly">
                        <div className="w-full grid grid-cols-1">
                          <p className="text-center">{rowIndex + 1}</p>
                        </div>
                        <div className="w-full">
                          <input
                            ref={(el) => {
                              if (!edited_inputRefs.current[rowIndex]) {
                                edited_inputRefs.current[rowIndex] = [];
                              }
                              edited_inputRefs.current[rowIndex][colIndex] = el;
                            }}
                            defaultValue={value}
                            className="break-words text-center text-gray-700"
                          />
                        </div>
                        <div className="w-full flex justify-end">
                          <div className="grid grid-cols-1">
                            <div
                              onClick={() => {
                                setarticle(row);
                                setdelete_box(true);
                              }}
                              className="cursor-pointer bg-delete bg-cover w-5 h-5"
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

          <div className="flex justify-end my-2">
            <div className="flex w-1/4 gap-x-4 justify-between">
              <button
                onClick={() => {
                  setdialogue_open(false);
                }}
                className="z-10 bg-red-400 w-1/2 p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={Save_Details}
                className="bg-blue-400 z-10 w-1/2 p-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="font-Inter text-2xl">{title}</p>
        <div className="w-[10%] flex justify-between">
          <div
            className="bg-edit bg-cover h-8 w-8 cursor-pointer"
            onClick={() => {
              setdialogue_open(true);
            }}
          ></div>
          <div
            onClick={HandleFlag}
            className="bg-add bg-cover h-8 w-8 cursor-pointer"
          ></div>
        </div>
      </div>
      {title != "Pipeline" ? (
        <div className="grid grid-cols-6 border-y p-1 gap-x-2 border-x-2 border-black">
          <p className="text-center">ID</p>
          <p className="lowercase text-center">{title + "_name"}</p>
          <p className="lowercase text-center">{title + "_type"}</p>
          <p className="text-center">host</p>
          <p className="text-center">database_name</p>
          <p className="text-center">active_status</p>
        </div>
      ) : (
        <div className="grid grid-cols-6 border-y p-1 gap-2 border-x-2 border-black">
          <p className="text-center">ID</p>
          <p className="w-max lowercase  text-center">{title + "_name"}</p>
          <p className="w-max text-center">source_table</p>
          <p className="w-max text-center">destination_database</p>
          <p className="w-max text-center">destination_table</p>
          <p className="w-max text-center">active_status</p>
        </div>
      )}

      <div className="w-full border-x-2 border-black">
        {sharedValue?.length > 0 ? (
          sharedValue.map((item, rowIndex) => {
            // Convert object to array of values you want to display

            const rowValues = [
              item.id,
              ...(title === "Source"
                ? [
                  item.source_name,
                  item.source_type,
                  item.database_name,
                  item.host,
                ]
                : title === "Destination"
                  ? [
                    item.destination_name,
                    item.destination_type,
                    item.database_name,
                    item.host,
                  ]
                  : [
                    item.pipeline_name,
                    item.source_table_name,
                    item.dest_db,
                    item.dest_table_name,
                  ]), // For "Pipeline" (or add more fields if needed)

              item.active_status,
            ];
            return (
              <div className="grid grid-cols-6 border-y p-1 gap-2">
                {rowValues.map((value, colIndex) => {
                  const unique_id = `${rowIndex}-${colIndex}`;
                  return (
                    <p
                      ref={(el) => {
                        if (!inputRefs.current[rowIndex]) {
                          inputRefs.current[rowIndex] = [];
                        }
                        inputRefs.current[rowIndex][colIndex] = el;
                      }}
                      className="break-words text-center text-gray-700"
                    >
                      {value}
                    </p>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div>
            <p>No data available</p>
          </div>
        )}
      </div>
      {title == "Pipeline" ? (
        <div className="scheduler">
          <div
            className={`${open_pipeline_window ? "" : "hidden"
              } pipeline-window absolute left-2 top-0 w-[98rem] h-[98vh] bg-white flex justify-center`}
          >
            <div
              className={`${open_schedule_box ? "" : "hidden"
                } p-2 select-date-time-box bg-white border gap-y-2 flex flex-col border-black w-60 h-max absolute top-52`}
            >
              <label htmlFor="">Select day:</label>
              <select
                onChange={(e) => {
                  setDay(e.target.value);
                }}
                value={Day}
                className="p-2 bg-white border border-black"
                name="weekday"
              >
                <option value="mon">Monday</option>
                <option value="tue">Tuesday</option>
                <option value="wed">Wednesday</option>
                <option value="thu">Thursday</option>
                <option value="fri">Friday</option>
                <option value="sat">Saturday</option>
                <option value="sun">Sunday</option>
                <option value="every day">Every Day</option>
              </select>
              <label htmlFor="">Select time:</label>
              <input
                className="border border-black rounded-sm p-1"
                type="time"
                name="time"
                id="time"
                value={Time}
                onChange={(e) => setTime(e.target.value)}
              />
              <div
                className={`${Day == "every day" ? "hidden" : ""
                  } flex justify-between items-center mt-1`}
              >
                <label htmlFor="">Select frequency:</label>
                <input
                  className="border px-1 w-1/5 border-black"
                  type="number"
                  name="frequency"
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setfrequency(e.target.value)}
                  min={1}
                />
              </div>
              <div className="button-box w-full justify-end gap-x-2 mt-4 flex">
                <button
                  onClick={() => {
                    SchedulePipeline(Day, Time, frequency, pipeline_name);

                  }}
                  className={`p-2 rounded-md text-white w-1/2 ${!(Time && frequency)
                    ? "bg-pink-200 cursor-not-allowed"
                    : "bg-pink-400 hover:bg-pink-500"
                    }`}
                  disabled={!Time} // Actually disable the button when no value
                >
                  Schedule
                </button>
                <button
                  className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-md"
                  onClick={() => {
                    setopen_schedule_box(false);
                  }} // Actually disable the button when no value
                >
                  Cancel
                </button>
              </div>
            </div>
            <div
              onClick={() => {
                setopen_pipeline_window(false);
              }}
              className="absolute right-0 w-10 h-10 bg-red-400 hover:bg-red-500 cursor-pointer text-white flex justify-center items-center font-bold rounded-sm"
            >
              X
            </div>
            <div className="div w-2/3 h-full">
              {sharedValue && sharedValue.length > 0
                ? sharedValue.map((record, index) => (
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-full border border-2 my-2 rounded-xl p-2 grid grid-cols-4 items-center">

                      <p className="w-max text-center">{record.id}</p>
                      <p className="w-max text-center">
                        {record.pipeline_name}
                      </p>
                      <button
                        disabled={Index.has(index)}
                        onClick={() => {
                          RunPipeline(index);
                        }}
                        className={`${Index.has(index) ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"} p-2 w-max h-max text-center rounded-md text-white`}
                      >
                        Run
                      </button>
                      <button
                        disabled={Index.has(index)}
                        onClick={() => {
                          setopen_schedule_box(true);
                          setpipeline_name(record.pipeline_name);
                        }}
                        className={`${Index.has(index) ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"} p-2 w-max h-max text-center rounded-md text-white`}
                      >
                        Automate
                      </button>
                    </div>
                    <div className={`${Index.has(index) ? "" : "hidden"} w-1/4 flex flex-col gap-y-2`}>
                      <div className="w-full h-3 border border-2 border-gray-300">
                        <div className="h-full bg-red-400 animate-grow-width"></div>
                      </div>
                      <p className="text-center text-sm">Executing Pipeline</p>
                    </div>
                  </div>
                ))
                : null}
            </div>
          </div>
          <div
            className={`${(sharedValue && sharedValue.length) > 0 ? "" : "hidden"
              } w-full flex justify-end`}
          >
            <button
              onClick={() => {
                setopen_pipeline_window(true);
                window.scrollTo(0, 0); // (x-coordinate, y-coordinate)
              }}
              disabled={!(sharedValue && sharedValue.length > 0)}
              className={`${sharedValue && sharedValue.length > 0
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                : "bg-blue-300 cursor-not-allowed"
                } w-max h-max py-3 px-2 rounded-md text-white`}
            >
              Schedule Pipelines
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
