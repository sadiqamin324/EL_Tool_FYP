export default function Homebox({ title, source }) {
    return (
        <div className="flex flex-col h-80 justify-between">
            <div className="flex justify-between items-center">

                <p className="font-Inter text-2xl">{title}</p>
                <div>
                    <a href={source} className="h-10 w-10 rounded-full border-black border text-2xl flex justify-center mt-1 cursor-pointer font-bold">
                        +
                    </a>
                </div>

            </div >
            <div className="grid grid-cols-7 outline-debug grid-rows-7 w-64 h-64 cursor-pointer">
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
                <div className="border border-black"></div>
            </div>
        </div >
    )
}