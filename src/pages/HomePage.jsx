import Tag from '../components/Tag.jsx';
import { useRef, useEffect, useState } from 'react';
import { Button } from '../components/Button.jsx';
import { TechLogo } from '../components/TechLogos.jsx';
import React from 'react';
import { BiBarChartSquare } from 'react-icons/bi';
import Charts from '../components/Charts.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

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
            className="">
            <Navbar />
            <div className="px-28 h-[70vh] w-full">
                <div id='section' className="h-full py-16 rounded-[6vh] bg-black bg-black-texture bg-cover w-full flex flex-col ">
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
                    <div className="w-full  flex justify-center mb-5 items-center">
                        <div className="w-[50%]">
                            <p className="text-5xl text-white text-center">Semantic Data Layer <a className="text-blue-300">Architecture</a></p>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center mb-5">
                        <div className="w-[30%]">
                            <p className="text-md text-white text-center">Extract your data, build your dashboard, bring your business together.</p>
                        </div>
                    </div>
                    <Button href={"./home"} label={"Start now"} />

                </div>

            </div>
            <div className='w-full px-28'>
                <div className="w-full mt-16 rounded-2xl h-[110vh] py-4 bg-gray-200 flex justify-center items-center">
                    <Tag label='Hammad' translateX={['-30vw', '20vw', '30vw', '-30vw']} translateY={['10vh', '20vh', '-30vh', '10vh']} />

                    <Tag label='Salman' translateX={['-20vw', '30vw', '40vw', '-20vw']} translateY={['-20vh', '10vh', '-5vh', '-20vh']} />

                    <Tag label='Sadiq' translateX={['0vw', '30vw', '20vw', '0vw']} translateY={['50vh', '40vh', '-20vh', '50vh']} />

                    <div className="bg-white bg-graphs-piechart rounded-2xl border border-gray-300 bg-cover w-[98%] h-full">

                        <Tag label='Safee' translateX={['0vw', '45vw', '30vw', '0vw']} translateY={['0vh', '45vh', '70vh', '0vh']} />
                    </div>
                </div>
            </div>
            <div className='px-28 w-full mt-16'>
                <div>
                    <p className='text-sm text-gray-800 text-center font-normal'>Powering data insights for today's startups and tomorrow's leaders.
                    </p>
                </div>
            </div>
            <div className='px-28 tech-stack mt-8 grid grid-cols-1 gap-y-8 justify-items-center'>
                <div className='w-full flex justify-between items-center'>
                    <div className='w-14 h-16 bg-postgres bg-cover'></div>
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
            <div className='px-28 w-full h-[95vh] mt-16'>
                <div className='w-full h-full relative rounded-[6vh] bg-black bg-new-texture flex flex-col items-center pt-28'>
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
                        <Button href={"./home"} label={"Get started today"} />
                    </div>
                    <div className='mt-28'>
                        <div className='bg-nova-icon-wob block my-0 p-0 bg-cover w-24 h-24 rounded-lg shadow-lg shadow-sky-600/60'></div>
                    </div>

                    {/* Tech Container */}

                    <div className='absolute top-56 left-20 w-[12rem] h-[40vh]  logos grid grid-cols-1 grid-rows-3'>
                        <TechLogo justify='end' width={'10'} height={'12'} logo={'postgres'} />
                        <TechLogo justify='start' width={'10'} height={'10'} logo={'sequelize'} />
                        <TechLogo justify='end' width={'8'} height={'8'} logo={'mysql'} />
                    </div>

                    <div className='absolute top-56 right-20 w-[12rem] h-[40vh]  logos grid grid-cols-1 grid-rows-3'>
                        <TechLogo justify='start' width={'8'} height={'8'} logo={'apache'} />
                        <TechLogo justify='end' width={'10'} height={'10'} logo={'yarn'} />
                        <TechLogo justify='start' width={'8'} height={'8'} logo={'mongodb'} />
                    </div>
                </div>

            </div>


            <div className='px-28 w-full h-[120vh] mt-16'>
                <div className='w-full h-full relative rounded-[6vh] bg-black bg-space flex flex-col items-center pt-28'>
                    <div className="rounded-full w-max px-2 h-max py-1 bg-white flex justify-center items-center">
                        <div className="w-4 h-4 bg-db-logo bg-cover mr-1"></div>
                        <div className='text-xs font-medium'>Accessible for all</div>
                    </div>
                    <div className='w-full flex justify-center mt-2'>
                        <p className='text-5xl text-white'>Filter your sources your way</p>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <p className='w-2/3 text-white text-center'>Nova provides a process to filter your sources and select the desired table and columns.</p>
                    </div>
                    <div className='mt-6'>
                        <Button href={"./home"} label={"Configure a source"} />
                    </div>
                </div>

            </div>


            <div className='px-28 w-full h-max mt-16'>
                <div className='w-full h-full relative rounded-[6vh] flex flex-col items-center pt-28'>
                    <div className="rounded-full w-max px-3 h-max py-2 bg-slate-100 border border-gray-200 flex justify-center items-center">
                        <div className="w-4 h-4 bg-db-logo bg-cover mr-1"></div>
                        <div className='text-xs text-black font-medium'>View your data</div>
                    </div>
                    <div className='w-full flex justify-center mt-2'>
                        <p className='text-5xl text-center text-black'>Visualize data</p>
                    </div>
                    <div className='w-full flex justify-center mt-2'>
                        <p className='text-5xl text-center text-black'>with real-time insights</p>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <p className='w-2/3 text-black text-center'>Visualize your data in a variety of ways thanks to a robust set of visualizations. Whether it’s as a table, a chart, or a single value — you’re in control.</p>
                    </div>
                    <div className='w-full grid grid-cols-3 mt-16 justify-center gap-4 items-center'>
                        <Charts title={"User Signups"} keys={[{ "orange-400": "Supercart +users" }, { "sky-400": "Non-premium users" }]} pic={"yarn"} YCordinates={['1/2023', '2/2023', '3/2023', '4/2023']} label={"Year"} icon={BiBarChartSquare} textDescription={["Line chart.", "Customize bar orientation, trends, goal line, axis scale, bar colors, stacking, etc."]} />

                        <Charts title={"Number of orders by city"} keys={[{ "orange-600": "Toronto" }, { "blue-300": "Vancouver" }, { "purple-500": "Montreal" }, { "yellow-400": "Ottawa" }]} pic={"barchart"} YCordinates={['1/2023', '2/2023', '3/2023', '4/2023']} label={"Year"} icon={BiBarChartSquare} textDescription={["Bar chart.", "Customize line style, axis scale, trend lines, showing values on graph, and more."]} />

                        <Charts title={"Revenue by city"} height='[60%]' keys={[{ "orange-600": "Toronto" }, { "blue-300": "Vancouver" }, { "purple-500": "Montreal" }]} pic={"piechart"} YCordinates={['1/2023', '2/2023', '3/2023', '4/2023']} icon={BiBarChartSquare} textDescription={["Pie Chart.", "Customize Other category, colors, showing percentages, legend style and more."]} />

                        <Charts title={"Average order vs. volume"} keys={[{ "orange-600": "Toronto" }, { "blue-300": "Vancouver" }, { "purple-500": "Montreal" }, { "yellow-400": "Ottawa" }]} pic={"dotted-pattern"} label={"Average order value"} YCordinates={['10', '20', '30', '40']} icon={BiBarChartSquare} textDescription={["Scatter chart.", "Customize bubble size, trends, axis scale, colors, legend behavior and more. "]} />

                        <Charts title={"Average order by store"} keys={[{ "orange-600": "Toronto" }, { "blue-300": "Vancouver" }, { "purple-500": "Montreal" }]} pic={"area-chart"} YCordinates={['10', '20', '30', '40']} label={"Average order value"} icon={BiBarChartSquare} textDescription={["Area chart.", "Customize line order, stacking, showing values on graph, goal lines, and more. "]} />

                        <Charts title={"Customer spending"} keys={[]} pic={""} icon={BiBarChartSquare} textDescription={[" Single value.", "Customize trends, sub-header, style, date formats, prefix, suffix, and more."]} />
                    </div>


                </div>

            </div>
            <Footer />

        </div >
    )
}

// shadow-md shadow-sky-800/50