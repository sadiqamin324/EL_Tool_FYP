export function HomePage() {
    return (
        <div>
            <div className="navbar px-28 h-24 items-center flex w-full">
                <div className="w-[35%] flex items-center">
                    <div className="w-14 h-14 bg-nova-icon bg-cover"></div>
                    <p className="text-xl font-semibold">Nova</p>
                </div>
                <div className="w-[33%]">
                    <ul className="flex justify-between items-evenly">
                        <li className="text-slate-800 cursor-pointer inline-block text-sm">Source</li>
                        <li className="text-slate-800 cursor-pointer inline-block text-sm">Destination</li>
                        <li className="text-slate-800 cursor-pointer inline-block text-sm">Pipeline</li>
                        <li className="text-slate-800 cursor-pointer inline-block text-sm">Schedule</li>
                    </ul>
                </div>
                <div className="w-[32%] flex justify-end items-center">
                    <ul>
                        <li className="text-neutral-800 cursor-pointer inline-block text-sm">Log in</li>
                    </ul>
                </div>
            </div>

            <div className="px-32 h-[70vh] w-full">
                <div className="h-full py-16 rounded-[6vh] bg-black bg-black-texture bg-cover w-full flex flex-col shadow-xl shadow-sky-800/50">
                    <div className="w-full flex justify-center mb-2">
                        <div className="h-8 w-[28%] cursor-pointer flex justify-center items-center bg-white rounded-full">
                            <div className="w-4 h-4 bg-add-browser bg-cover mr-1"></div>
                            <p className="text-xs">Nova 1.1 - Customer accessibility dashboards </p>
                            <div className=" w-4 h-4 bg-down-arrow bg-cover -rotate-90"></div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center mb-5 items-center">
                        <div className="w-[50%]">
                            <p className="text-5xl text-white text-center">Semantic Data Layer <a className="text-blue-300">Architecture</a></p>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center mb-5">
                        <div className="w-[30%]">
                            <p className="text-md text-white text-center">Extract your data, build your dashboard, bring your business together.</p>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <button className="px-8 py-2 bg-white text-blue-400 font-semibold text-300 rounded-xl shadow-md shadow-gray-600/50">Start Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}