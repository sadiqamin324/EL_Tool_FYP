import Navbar from "../components/Navbar";
import Homebox from "../components/HomeBox";
// import { DialogueBox } from "../components/HomeBox.jsx";
import { useState } from "react";
import { DataContext, DialogueContext } from "../components/Context";
import { SourceDestinationflag } from "../components/Context";
import { useRef } from "react";
import Footer from '../components/Footer.jsx'
export default function Home() {

  const [modifier, setmodifier] = useState(null);
  const [close_rest, setclose_rest] = useState(false);
  const dialogShown = useRef(false);
  return (
    <div>
      {/* <DataContext.Provider value={{ sharedValue, setsharedValue }}> */}
      <SourceDestinationflag.Provider value={{ modifier, setmodifier }}>
        <DialogueContext.Provider value={{ dialogShown }}>
          <div >
            <Navbar />
            <div className="px-28 mt-12 h-max">
              <div className="rounded-md">
                <div className="title">
                  <p className="text-black font-semibold text-lg">Sources - Destinations - Pipelines</p>
                  <p className="text-sm text-neutral-500 font-normal">View and manage your configured sources, destinations and pipelines</p>
                </div>
                {/* <div className="mt-32 h-max border">
                  <div className="categories flex justify-between items-center w-1/4 h-[8vh] text-sm text-gray-900">
                    <div><p>Sources</p></div>
                    <div><p>Destinations</p></div>
                    <div><p>Pipelines</p></div>
                  </div>
                  <div className="tracker h-[3px] bg-blue-700 rounded-full"></div>
                </div>

                <div>
                  <div className="w-full rounded-md items-center bg-slate-100 h-[8vh] grid grid-cols-6">
                    <p className="text-sm text-neutral-500">Source name</p>
                    <p className="text-sm text-neutral-500">Source type</p>
                    <p className="text-sm text-neutral-500">User name</p>
                    <p className="text-sm text-neutral-500">Host</p>
                    <p className="text-sm text-neutral-500">Database name</p>
                    <p className="text-sm text-neutral-500">Active status</p>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="grid grid-cols-1 grid-rows-3 w-5/6 gap-x-16 gap-y-8">
                <Homebox title="Source" />
                <Homebox title="Destination" />
                <Homebox title="Pipeline" />
              </div>
            </div>
            <Footer />
          </div>
          {/* <DialogueBox /> */}

        </DialogueContext.Provider>
      </SourceDestinationflag.Provider>
      {/* </DataContext.Provider> */}
    </div >
  );
}
