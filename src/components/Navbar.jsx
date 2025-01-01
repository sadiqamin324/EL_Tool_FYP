export default function Navbar(){
    return(
        <div className="h-20 w-full flex justify-center items-center border-black border-b-2">
            <ul className="flex justify-between w-[20rem]">
                <li className="font-Inter font-medium text-lg cursor-pointer">Source</li>
                <li className="font-Inter font-medium text-lg cursor-pointer">Destination</li>
                <li className="font-Inter font-medium text-lg cursor-pointer">Pipeline</li>
            </ul>
        </div>
    )
}