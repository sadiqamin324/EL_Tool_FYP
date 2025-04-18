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

export default function Homebox({ title, para_data }) {
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

  const navigate = useNavigate();

  function Refresh() {
    setsharedValue(null);
    setdataFlag(null);
    setwhichFlag(null);

    setTimeout(() => {
      let newFlag;
      if (title === "Source") newFlag = 0;
      else if (title === "Destination") newFlag = 1;
      else if (title === "Pipeline") newFlag = 2;

      setdataFlag(newFlag); // Update dataFlag
      setwhichFlag("data-flag"); // Update whichFlag
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
          } else if (data.message === "Recieved pipeline flag correctly") {
            navigate("/pipeline");
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
            setsave_open(false);
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

  return (
    <div className="flex flex-col w-full h-80 justify-between mb-8">
      <div
        className={`${
          dialogue_open ? "" : "hidden"
        } dialogue-box w-1/2 h-1/2 border-2 bg-white absolute`}
      >
        <div
          className={`${
            delete_box ? "" : "hidden"
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
          className={`${
            save_open ? "" : "hidden"
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
          {sharedValue?.length > 0 ? (
            sharedValue.map((row, rowIndex) => (
              <div
                className="grid grid-cols-1 border-y p-1 gap-2"
                key={rowIndex}
              >
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
                            key={unique_id}
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

      <div className="grid grid-cols-6 border-y p-1 gap-2 border-x-2 border-black">
        <p className="break-words text-center">ID</p>
        <p className="break-words lowercase text-center">{title + "_name"}</p>
        <p className="break-words lowercase text-center">{title + "_type"}</p>
        <p className="break-words text-center">port_number</p>
        <p className="break-words text-center">database_name</p>
        <p className="break-words text-center">active_status</p>
      </div>

      <div className="w-full border-x-2 border-black">
        {sharedValue?.length > 0 ? (
          sharedValue.map((row, rowIndex) => (
            <div className="grid grid-cols-6 border-y p-1 gap-2" key={rowIndex}>
              {Object.values(row).map((value, colIndex) => {
                const unique_id = `${rowIndex}-${colIndex}`;
                return (
                  <p
                    ref={(el) => {
                      if (!inputRefs.current[rowIndex]) {
                        inputRefs.current[rowIndex] = [];
                      }
                      inputRefs.current[rowIndex][colIndex] = el;
                    }}
                    key={unique_id}
                    className="break-words text-center text-gray-700"
                  >
                    {value}
                  </p>
                );
              })}
            </div>
          ))
        ) : (
          <div>
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
