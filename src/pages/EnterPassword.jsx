import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState, useEffect } from "react";
import Inputbox from "../components/InputBox.jsx";
import { DialogueContext, isHidden } from "../components/Context.js";
import { Password } from "../components/Context.js";

export default function PasswordBox() {
  const InputBox = useRef(null);
  const ButtonRef = useRef(null);
  const DialogueDiv = useRef(null);
  const { Global_Password, setGlobal_Password } = useContext(Password);
  const navigate = useNavigate(null);
  const [showPassword, setShowPassword] = useState(false);


  async function HandleButton() {
    if (InputBox.current.value.trim() !== "") {
      try {
        const response = await fetch(
          "http://localhost:5000/validate-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: InputBox.current.value }),
          }
        );

        const data = await response.json();
        if (data.success) {
          alert("Connected to System DB successfully");
          sessionStorage.setItem('db_password', InputBox.current.value);
          setGlobal_Password(InputBox.current.value);

          navigate("/landingpage")
        } else {
          alert("Wrong password, retry!");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  useEffect(() => {
    const handleInput = () => {
      if (InputBox.current.value.trim() !== "") {
        ButtonRef.current.classList.replace("bg-blue-300", "bg-blue-500");
        ButtonRef.current.classList.replace("cursor-auto", "cursor-pointer");
      } else {
        ButtonRef.current.classList.replace("bg-blue-500", "bg-blue-300");
        ButtonRef.current.classList.replace("cursor-pointer", "cursor-auto");
      }
    };

    const inputElement = InputBox.current;
    if (inputElement) {
      inputElement.addEventListener("input", handleInput);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("input", handleInput);
      }
    };
  }, []);


  return (
    <div
      ref={DialogueDiv}
      className="z-20 ml-96 mt-40 w-1/2 h-1/2 bg-white rounded-lg absolute"
    >
      <div className="h-2/3 w-full flex flex-col justify-center items-center">
        <label className="font-semibold" htmlFor="">
          Enter system database password
        </label>
        <Inputbox
          ref={InputBox}
          input_width="full"
          box_with="1/2"
          top={2}
          type={showPassword ? "text" : "password"}
          label="password"
        />

        <div className="tickbox flex w-1/2 ml-2 mt-1 justify-start items-center">
          <p
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            className="underline text-gray-600 cursor-pointer text-xs"
          >
            Show password
          </p>
        </div>
        <button
          onClick={HandleButton}
          ref={ButtonRef}
          className="w-1/6 h-1/6 my-2 mx-2 bg-blue-300 rounded-md text-white cursor-auto"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
