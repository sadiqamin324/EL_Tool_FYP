import Navbar from "../components/Navbar";
import Homebox from "../components/HomeBox";
import DropdownForm from "../components/forms";
export default function Home() {
    return (
        <div>
            <Navbar />
            <div className="flex justify-center mt-8">
                <div className="grid grid-cols-2 grid-rows-2 gap-x-16 gap-y-8">
                    <Homebox title="Source" />
                    <Homebox title="Destination" />
                    <Homebox title="Pipeline" />
                </div>
            </div>
            {/* Add Dropdown Form here */}
            <div className="mt-8 flex justify-center">
                <DropdownForm />
            </div>
        </div>
    );
}