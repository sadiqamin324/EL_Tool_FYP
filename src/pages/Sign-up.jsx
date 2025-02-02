export default function SignUp() {
  const inputs = document.getElementsByTagName("input");

  async function HandleSignUpInfo() {
    var User_Info = [];

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value != "") {
        User_Info.push(inputs[i].value);
        
      }
    }
    

    if (User_Info.length == inputs.length) {
      try {
        const response = await fetch("http://localhost:5000/SignUpInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(User_Info),
        });
        console.log("🔵 Sending User Data to backend");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.success) {
          console.log("Sign Up Information reached successfully");
        } else {
          console.log("Sign Up Information failed to reach successfully");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send information to backend");
      }
    } else if (User_Info.length != inputs.length) {
        alert("Fill out all the remaining fields in the form")
    }
  }

  return (
    <div className="flex bg-[#e8e9ea] justify-center w-full items-center h-[48rem]">
      <div className="z-10  bg-back-pattern items-center bg-cover w-[25rem] h-[40rem] rounded-l-xl"></div>
      <div className="z-10  flex flex-col justify-center bg-gradient-to-b from-white-60 to-white-80 border-2 border-white items-center w-[25rem] h-[40rem] rounded-r-xl">
        <div className="flex w-[90%]">
          <p className="text-3xl font-medium text-[#8c8c8c] font-inter">
            Create An Account
          </p>
        </div>
        <div className="flex w-[90%] mb-2">
          <p className="text-xs text-[#8c8c8c]">
            Already have an account?{" "}
            <a className="underline" href="">
              Login in
            </a>
          </p>
        </div>

        <div className="flex flex-col items-center w-[90%]">
          <div className="flex my-2 w-full">
            <input
              className="p-3 text-sm mr-1 w-1/2 font-normal rounded-md text-[#a7a7a7] border-2 border-[#fb6841]"
              placeholder="First Name"
              type="text"
            />
            <input
              className="p-3 text-sm ml-1 w-1/2 font-normal rounded-md text-[#a7a7a7]"
              placeholder="Last Name"
              type="text"
            />
          </div>
          <div className="flex my-2 justify-center items-center w-full bg-white rounded-md">
            <input
              className="p-3 text-sm rounded-l-md w-full text-[#a7a7a7] font-normal"
              placeholder="Email"
              type="text"
            />
            <div className="bg-back-eye w-6 h-5 bg-cover mr-2"></div>
          </div>
          <div className="w-full">
            <input
              className="mt-2 p-3 text-sm w-full rounded-md text-[#a7a7a7] font-normal"
              placeholder="Enter your password"
              type="password"
            />
          </div>
        </div>
        <div className="my-3 flex w-[90%] items-center">
          <div className="tickbox flex justify-center items-center w-5 h-5 rounded-md bg-white mr-1">
            <div className="w-4 h-4 bg-cover bg-tick"></div>
          </div>
          <div className="ml-1">
            <p className="text-xs text-[#8c8c8c] font-inter">
              I agree to the{" "}
              <a
                className="underline font-inter text-[#8c8c8c] text-xs"
                href=""
              >
                Terms and Conditions
              </a>
            </p>
          </div>
        </div>
        <button
          className="w-[90%] p-2.5 text-white rounded-lg font-bold bg-[#fb6841]"
          onClick={HandleSignUpInfo}
        >
          Create Account
        </button>
      </div>
      <div className="rounded-full z-0 left-[55rem] bottom-[24rem] w-72 h-72 blur-xl bg-[#dc4139] absolute z-index"></div>
      <div className="rounded-full z-0 left-[40rem] bottom-[5rem] w-96 h-96 blur-xl bg-[#ffe941] absolute z-index"></div>
    </div>
  );
}
