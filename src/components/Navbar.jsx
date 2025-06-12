import { useRef, useEffect, useState } from 'react';
export default function Navbar() {
    const arrowRef = useRef(null);
    const NavRef = useRef(null)
    const [scrollFlag, setscrollFlag] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                NavRef.current.classList.replace('w-full', 'w-1/2');
                setscrollFlag(true)
            }
            else {
                NavRef.current.classList.replace('w-1/2', 'w-full')
                setscrollFlag(false)
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll)

    }, [])

    return (
        <div className='px-28 w-full flex justify-center items-center sticky top-0 h-24 z-10'>
            <div ref={NavRef} className={`navbar h-1/2 rounded-xl items-center bg-white flex w-full border-white/70 transition-all ease-in-out duration-[1000ms] ${scrollFlag ? "backdrop-blur-sm bg-white/95 border shadow-lg" : ""}`}>
                <div className="w-[35%] flex items-center">
                    <div className="w-14 h-14 bg-nova-icon bg-cover"></div>

                    <p className={` ${scrollFlag ? "hidden" : ""} text-xl font-semibold`}>Nova</p>
                    <div className={` ${scrollFlag ? "" : "hidden"} w-[1px] h-5 bg-gray-300 ml-2`}></div>
                </div>
                <div className="w-[30rem]">
                    <ul className="flex justify-between items-evenly">
                        <li className="text-slate-800 cursor-pointer font-normal text-gray-700 hover:bg-gray-200 rounded-md py-1 px-2 text-sm">Source</li>
                        <li className="text-slate-800 cursor-pointer font-normal text-gray-700 text-sm hover:bg-gray-200 rounded-md py-1 px-2">Destination</li>
                        <li className="text-slate-800 cursor-pointer font-normal text-gray-700 text-sm hover:bg-gray-200 rounded-md py-1 px-2">Pipeline</li>
                        <li className="text-slate-800 cursor-pointer font-normal text-gray-700 text-sm hover:bg-gray-200 rounded-md py-1 px-2">Schedule</li>
                        <li className="text-slate-800 cursor-pointer font-normal text-gray-700 text-sm hover:bg-gray-200 rounded-md py-1 px-2">Demo</li>
                    </ul>
                </div>
                <div className={`w-[32%] flex justify-end items-center ${scrollFlag ? "pr-2" : ""}`}>
                    <ul>
                        <li className="text-neutral-800 cursor-pointer font-normal text-gray-700 text-sm hover:bg-gray-200 rounded-md py-1 px-2">Log in</li>
                    </ul>
                </div>
            </div>
        </div>

    )
}