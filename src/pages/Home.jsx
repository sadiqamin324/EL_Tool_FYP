import Navbar from "../components/Navbar";
import Homebox from "../components/HomeBox";
import { DialogueBox } from "../components/HomeBox";
import { useState } from "react";
import { DataContext, DialogueContext } from "../components/Context";
import { isHidden } from "../components/Context";
import { SourceDestinationflag } from "../components/Context";
import PasswordBox from "../components/PasswordBox.jsx";
import { useRef } from "react";

export default function Home() {
  const [sharedValue, setsharedValue] = useState(null);
  const [modifier, setmodifier] = useState(null);
  const [ishidden, setIshidden] = useState("");
  const dialogShown = useRef(false);
  return (
    <div>
      <DataContext.Provider value={{ sharedValue, setsharedValue }}>
        <SourceDestinationflag.Provider value={{ modifier, setmodifier }}>
          <DialogueContext.Provider value={{ dialogShown }}>
            <isHidden.Provider value={{ ishidden, setIshidden }}>
              <div
                className={`${ishidden} absolute bg-slate-500 blur-xl opacity-40 w-[99rem] h-[146vh] z-10`}
              ></div>
              <PasswordBox />
              <div className={`${ishidden === "" ? "blur-lg" : "blur-0"}`}>
                <Navbar />
                <div className="flex justify-center mt-8">
                  <div className="grid grid-cols-1 grid-rows-3 w-1/2 gap-x-16 gap-y-8">
                    <Homebox title="Source" />
                    <Homebox title="Destination" />
                    <Homebox title="Pipeline" />
                  </div>
                </div>
              </div>
              <DialogueBox />
            </isHidden.Provider>
          </DialogueContext.Provider>
        </SourceDestinationflag.Provider>
      </DataContext.Provider>
    </div>
  );
}
