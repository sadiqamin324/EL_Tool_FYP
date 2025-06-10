import Tag from '../components/Tag.jsx';
import { useRef, useEffect, useState } from 'react';
import { Button } from '../components/Button.jsx';
import { TechLogo } from '../components/TechLogos.jsx';

export function HomePage() {
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
        <div
            className="px-28">
            <div className='w-full flex justify-center items-center sticky top-0 h-24'>
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

            <div className="h-[70vh] w-full">
                <div className="h-full py-16 rounded-[6vh] bg-black-texture bg-cover w-full flex flex-col ">
                    <div className="w-full flex justify-center mb-2">
                        <div onMouseLeave={() => {
                            arrowRef.current.classList.replace('bg-arrow-right', 'bg-right');
                            arrowRef.current.classList.remove('translate-x-1');
                        }}
                            onMouseOver={() => {
                                arrowRef.current.classList.replace('bg-right', 'bg-arrow-right');
                                arrowRef.current.classList.add('translate-x-1');
                            }} className="h-8 w-[28%] cursor-pointer flex justify-center items-center bg-white rounded-full hover:shadow-xl shadow-black-600/50">
                            <div className="w-4 h-4 bg-add-browser bg-cover mr-1"></div>
                            <p className="text-xs">Nova 1.1 - Customer accessibility dashboards </p>
                            <div ref={arrowRef} className="w-4 h-4 bg-right bg-cover transform transition-transform duration-500 ease-in-out"></div>
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
                    <Button label={"Start now"} />

                </div>

            </div>
            <div className="w-full mt-16 rounded-2xl h-[110vh] py-4 bg-gray-200 flex justify-center items-center">
                <Tag label='Hammad' translateX={['-30vw', '20vw', '30vw', '-30vw']} translateY={['10vh', '20vh', '-30vh', '10vh']} />

                <Tag label='Salman' translateX={['-20vw', '30vw', '40vw', '-20vw']} translateY={['-20vh', '10vh', '-5vh', '-20vh']} />

                <Tag label='Sadiq' translateX={['0vw', '30vw', '20vw', '0vw']} translateY={['50vh', '40vh', '-20vh', '50vh']} />

                <div className="bg-white bg-graphs-piechart rounded-2xl border border-gray-300 bg-cover w-[98%] h-full">

                    <Tag label='Safee' translateX={['0vw', '45vw', '30vw', '0vw']} translateY={['0vh', '45vh', '70vh', '0vh']} />
                </div>
            </div>
            <div className='w-full mt-16'>
                <div>
                    <p className='text-sm text-gray-800 text-center font-normal'>Powering data insights for today's startups and tomorrow's leaders.
                    </p>
                </div>
            </div>
            <div className='tech-stack mt-8 grid grid-cols-1 gap-y-8 justify-items-center'>
                <div className='w-full flex justify-between items-center'>
                    <div className='w-28 h-20 bg-postgres bg-cover'></div>
                    <div className='w-[5.4rem] h-[4.2vh] bg-odoo bg-cover'></div>
                    <div className='w-16 h-16 bg-react bg-cover'></div>
                    <div className='w-16 h-16 bg-express bg-cover'></div>
                    <div className='w-16 h-16 bg-html bg-cover'></div>
                    <div className='w-16 h-16 bg-css bg-cover'></div>
                </div>
                <div className='w-[26%] flex justify-between items-center'>
                    <div className='ml-6 w-16 h-16 bg-sequelize bg-cover'></div>
                    <div className='w-24 h-24 bg-node bg-cover'></div>
                </div>
            </div>
            <div className='w-full h-[95vh] mt-16'>
                <div className='w-full h-full rounded-[6vh] bg-black bg-space flex flex-col items-center pt-36'>
                    <div className="rounded-full w-max px-2 h-max py-1 bg-white flex justify-center items-center">
                        <div className="w-4 h-4 bg-db-logo bg-cover mr-1"></div>
                        <div className='text-xs font-medium'>Data harmony</div>
                    </div>
                    <div className='w-full flex justify-center mt-2'>
                        <p className='text-5xl text-white'>Connect your data</p>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <p className='w-2/3 text-white text-center'>Nova connects a large number of databases and data warehouses seamlessly.</p>
                    </div>
                    <div className='mt-6'>
                        <Button label={"Get started today"} />
                    </div>
                    <div className='mt-16'>
                        <div className='bg-nova-icon-wob block my-0 p-0 border border-white bg-cover w-24 h-24 rounded-lg shadow-lg shadow-sky-600/60'></div>
                    </div>

                    {/* Tech Container */}

                    {/* <div className='absolute w-[14rem] h-[40vh] bg-blue-400 logos grid grid-cols-1 grid-rows-3'>
                        <TechLogo justify='end' width={'10'} height={'12'} logo={'postgres'} />
                        <TechLogo justify='start' width={'10'} height={'10'} logo={'sequelize'} />
                        <TechLogo justify='end' width={'8'} height={'8'} logo={'mysql'} />
                    </div> */}

                    <div className='absolute w-[14rem] h-[40vh] bg-blue-400 logos grid grid-cols-1 grid-rows-3'>
                        <TechLogo justify='end' width={'10'} height={'12'} logo={'apache'} />
                        <TechLogo justify='start' width={'10'} height={'10'} logo={'yarn'} />
                        <TechLogo justify='end' width={'8'} height={'8'} logo={'mysql'} />
                    </div>
                </div>

            </div>

        </div>
    )
}

// shadow-md shadow-sky-800/50