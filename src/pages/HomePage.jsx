import Tag from '../components/Tag.jsx';
import { useRef } from 'react';

export function HomePage() {
    const arrowRef = useRef(null);

    return (
        <div className="px-28">
            <div className="navbar h-24 items-center flex w-full">
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

            <div className="h-[70vh] w-full ">
                <div className="h-full py-16 rounded-[6vh] bg-black-texture bg-cover w-full flex flex-col ">
                    <div className="w-full flex justify-center mb-2">
                        <div onMouseLeave={() => {
                            arrowRef.current.classList.remove('translate-x-2', 'bg-arrow-right');
                        }}
                            onMouseOver={() => {
                                arrowRef.current.classList.add('translate-x-2', 'bg-arrow-right');
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
                    <div className="w-full flex justify-center items-center">
                        <button className="px-8 py-2 bg-white text-blue-400 font-semibold text-300 rounded-xl shadow-md shadow-gray-600/50">Start Now</button>
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
                <div className='tech-stack mt-8 grid grid-cols-1 gap-4 justify-items-center'>
                    <div className='w-full grid grid-cols-6 gap-4 items-center'> 
                        <div className='w-28 h-20 bg-postgres bg-cover'></div>
                        <div className='w-20 h-[4vh] bg-odoo bg-cover'></div>
                        <div className='w-16 h-16 bg-react bg-cover'></div>
                        <div className='w-16 h-16 bg-express bg-cover'></div>
                        <div className='w-16 h-16 bg-html bg-cover'></div>
                        <div className='w-16 h-16 bg-css bg-cover'></div>
                    </div>
                    <div className='w-full grid grid-cols-6 gap-4 justify-center items-center'>
                        <div className='ml-6 w-16 h-16 bg-sequelize bg-cover'></div>
                        <div className='w-24 h-24 bg-node bg-cover'></div>
                    </div>
                </div>
                <div className='w-full h-[100vh]'></div>
            </div>

        </div>
    )
}

// shadow-md shadow-sky-800/50