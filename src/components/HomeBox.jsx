import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./Context.js";
import { SourceDestinationflag, Title } from "./Context.js";
//initialize const for collecting source/destination tables data
let table;

export default function Homebox({ title, para_data }) {
  const [flag, setflag] = useState(null);
  const [dataFlag, setdataFlag] = useState(null);
  const [whichFlag, setwhichFlag] = useState(null);
  const [source, setsource] = useState(null);
  const [Trigger, setTrigger] = useState(0);
  const { sharedValue, setsharedValue } = useContext(DataContext);
  const { modifier, setmodifier } = useContext(SourceDestinationflag);
  const { setisSource } = useContext(Title);

  const navigate = useNavigate();

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

  function HandleDataFlag() {
    let newFlag;
    if (title == "Source") {
      newFlag = 0;
    } else if (title == "Destination") {
      newFlag = 1;
    } else if (title == "Pipeline") {
      newFlag = 2;
    }
    setdataFlag(newFlag);
    setwhichFlag("data-flag");
    setmodifier(newFlag);
    setTrigger((prev) => prev + 1);
  }

  async function sendFlagToServer(flagValue, flagtype) {
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
      console.log(data);
      if (data.success) {
        console.log("flag sent to backend");
        
        if (
          data.message == "Recieved source-destination dropdown flag correctly"
        ) {
          navigate("/dropdown");
        } else if (data.message == "Recieved pipeline flag correctly") {
          navigate("/pipeline");
        } else if (data.message == "Recieved data flag for source-dropdown") {
          setsharedValue(data.data.data);
        }
      } else {
        alert("failed to send flag to backend");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send information to backend");
    }
  }
  useEffect(() => {
    if (flag !== null) {
      sendFlagToServer(flag, whichFlag);
    }
  }, [flag, Trigger]);

  useEffect(() => {
    if (dataFlag !== null) {
      sendFlagToServer(dataFlag, whichFlag);
    }
  }, [dataFlag, Trigger]);

  return (
    <div className="flex flex-col w-full h-80 justify-between">
      <div className="flex justify-between items-center">
        <p className="font-Inter text-2xl">{title}</p>
        <div>
          <a
            onClick={HandleFlag}
            className="h-10 w-10 rounded-full border-black border text-2xl flex justify-center mt-1 cursor-pointer font-bold"
          >
            +
          </a>
        </div>
      </div>

      <div
        className="grid grid-cols-8 outline-debug grid-rows-7 h-64 cursor-pointer"
        onClick={HandleDataFlag}
      >
        {[...Array(56)].map((_, i) => (
          <div key={i} className="border border-gray-400"></div>
        ))}
      </div>
    </div>
  );
}

export function DialogueBox() {
  const [modChangeTrigger, setmodChangeTrigger] = useState(0);
  const { sharedValue } = useContext(DataContext);
  const { modifier } = useContext(SourceDestinationflag);
  table = modifier === 0 ? "source" : "destination";
  var mainbox = document.getElementsByClassName("main-box")[0];

  if (modifier == 0 || modifier == 1) {
    mainbox.classList.remove("hidden");
  }

  function CloseDialogueBox() {
    mainbox.classList.add("hidden");
  }
  return (
    <div className="main-box hidden w-[98rem] h-[99vh] flex justify-center items-center absolute top-0 ">
      <div className="w-1/2 h-2/3 border-2 border-black bg-white relative">
        <div
          className="cross flex justify-center items-center w-8 h-8 bg-red-300 hover:bg-red-500 text-white absolute top-0 right-0 cursor-pointer"
          onClick={CloseDialogueBox}
        >
          <p>X</p>
        </div>
        <table className="table-fixed border-separate border-spacing-4 border border-black">
          <thead>
            <tr className="border-2 border-black">
              <th>ID</th>
              <th>{table + "_name"}</th>
              <th>{table + "_type"}</th>
              <th>port_number</th>
              <th>host</th>
              <th>active_status</th>
            </tr>
          </thead>
          <tbody>
            {sharedValue && sharedValue.length > 0 ? (
              Object.values(sharedValue).map((row, index) => (
                <tr key={index}>
                  <td>{Object.values(row)[0]}</td>
                  <td>{Object.values(row)[1]}</td>
                  <td>{Object.values(row)[2]}</td>
                  <td>{Object.values(row)[3]}</td>
                  <td>{Object.values(row)[4]}</td>
                  <td>{Object.values(row)[5]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Source_Destination_Data.rows.forEach((row) => {
//   console.log(row.source_name);
// }
