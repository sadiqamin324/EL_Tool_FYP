import Navbar from "../components/Navbar";
import Homebox from "../components/HomeBox";
// import { DialogueBox } from "../components/HomeBox.jsx";
import { useState } from "react";
import { DataContext, DialogueContext } from "../components/Context";
import { SourceDestinationflag } from "../components/Context";
import { useRef } from "react";

export default function Home() {
  
  const [modifier, setmodifier] = useState(null);
  const dialogShown = useRef(false);
  return (
    <div>
      {/* <DataContext.Provider value={{ sharedValue, setsharedValue }}> */}
        <SourceDestinationflag.Provider value={{ modifier, setmodifier }}>
          <DialogueContext.Provider value={{ dialogShown }}>
              <div >
                <Navbar />
                <div className="flex justify-center mt-8">
                  <div className="grid grid-cols-1 grid-rows-3 w-1/2 gap-x-16 gap-y-8">
                    <Homebox title="Source" />
                    <Homebox title="Destination" />
                    <Homebox title="Pipeline" />
                  </div>
                </div>
              </div>
              {/* <DialogueBox /> */}
            
          </DialogueContext.Provider>
        </SourceDestinationflag.Provider>
      {/* </DataContext.Provider> */}
    </div>
  );
}
