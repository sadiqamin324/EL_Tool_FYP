import React, { forwardRef } from "react";

const InputBox = forwardRef(
  (
    { label, type = "text", top = 4, box_with = "full", input_width = "full" },
    ref
  ) => {
    return (
      <div className={`relative mt-${top} w-${box_with}`}>
        <div className="inline-block px-2 h-5 bg-white absolute -top-2 left-4">
          <p className="text-center text-xs text-gray-600">{label}</p>
        </div>
        <input
          ref={ref}
          className={`w-${input_width} h-[3rem] p-2 text-md focus:outline-none font-inter border border-red-600 rounded-lg`}
          type={type}
        />
      </div>
    );
  }
);
export default InputBox;
