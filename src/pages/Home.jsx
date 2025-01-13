import Navbar from "../components/Navbar";
import Homebox from "../components/HomeBox";

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className="flex justify-center mt-8">
                <div className="grid grid-cols-2 grid-rows-2 gap-x-16 gap-y-8">
                    <Homebox source={"http://localhost:5173/dropdown"} title="Source" />
                    <Homebox destination={"http://localhost:5173/dropdown"} title="Destination" />
                    <Homebox title="Pipeline" />
                </div>
            </div>
        </div>
    );
}