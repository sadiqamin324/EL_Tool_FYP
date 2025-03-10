import { useContext } from "react";
import "./forms.js";
import {
  CheckClassName,
  EmptyInput,
  HandleClick,
  MouseLeave,
  MouseLeaveRed,
  MouseOver,
  MouseOverRed,
  OpenDropDown,
  InsertNewUser,
} from "./forms.js";
import { Title } from "../Context.js";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/InputBox.jsx";

export default function Dropdown() {
  const { isSource } = useContext(Title);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-[49rem]">
      <div className="w-1/4 h-5/6 flex flex-col justify-center items-center border-2 border-black">
        <div
          className="p-2 w-5/6 h-[3.5rem] border border-red-600 rounded-lg flex justify-between items-center cursor-pointer"
          onClick={OpenDropDown}
        >
          <p className="font-inter">Database Source</p>
          <div className="back-arrow bg-down-arrow w-6 h-6 bg-cover"></div>
        </div>
        <div className="a1 hidden w-5/6 border border-red-500">
          <div
            className="Postgree cursor-pointer h-16 flex p-2 items-center justify-between border-b border-red-500"
            onClick={(e) => CheckClassName(e.target)}
            onMouseOver={MouseOver}
            onMouseLeave={MouseLeave}
          >
            <p className="font-inter" onMouseLeave={MouseLeave}>
              Postgree SQL
            </p>
          </div>
          <div
            className={`Odoo cursor-pointer h-16 flex p-2 items-center justify-between border-b border-red-500 ${
              isSource ? "" : "hidden"
            }`}
            onClick={(e) => CheckClassName(e.target)}
            onMouseOver={MouseOver}
            onMouseLeave={MouseLeave}
          >
            <p className="font-inter" onMouseLeave={MouseLeave}>
              Odoo
            </p>
          </div>
        </div>
        <div className="db-details hidden w-5/6 flex flex-col">
          <InputBox label="source name" />
          <InputBox label="user name" />
          <InputBox label="port" />
          <InputBox label="source host" />
          <InputBox label="database name" />
          <InputBox type="password" label="password" />
        </div>

        <div className="buttons flex w-5/6 mt-4">
          <div className="w-1/2">
            <button
              className="p-2 rounded-lg border-2 border-red-500 disabled:bg-red-200"
              onMouseOver={MouseOverRed}
              onMouseLeave={MouseLeaveRed}
              onClick={InsertNewUser}
            >
              Save
            </button>
          </div>
          <div className="flex w-1/2 justify-between">
            <button
              className="p-2 rounded-lg border-2 border-red-500"
              onClick={EmptyInput}
              onMouseOver={MouseOverRed}
              onMouseLeave={MouseLeaveRed}
            >
              Cancel
            </button>
            <button
              className="p-2 rounded-lg border-2 border-red-500"
              onMouseOver={MouseOverRed}
              onMouseLeave={MouseLeaveRed}
              onClick={HandleClick}
            >
              Test
            </button>
          </div>
        </div>
      </div>
      <div className="w-[26%] flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 w-1/3 h-3/4 my-4 mx-2 text-white rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
}
