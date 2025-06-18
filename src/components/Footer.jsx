import { PiPulseBold } from "react-icons/pi";
import { Button } from '../components/Button.jsx';
export default function Footer() {
    return (
        <div>
            <div className='footer mt-20 h-[100vh] flex justify-center'>
                <div className='bg-black flex flex-col pt-20 items-center w-[99%] h-full rounded-t-[6vh] bg-new-texture bg-cover'>
                    <div className='w-28 h-28 shadow-lg rounded-xl shadow-blue-600/50 bg-nova-icon bg-cover'></div>
                    <div className="mt-12 rounded-full w-max px-3 h-max py-2 bg-zinc-800 flex justify-center items-center">
                        <PiPulseBold className='text-white border border-white rounded-[3px] font-bold mr-2' />

                        <div className='text-xs text-white font-medium tracking-wide [2px]'>See data differently</div>
                    </div>
                    <div className='mt-2 flex flex-col gap-y-2'>
                        <p className='text-center text-5xl font-medium text-white'>Connect. Execute.</p>
                        <p className='text-center text-5xl font-medium text-white'>Visualize</p>
                    </div>
                    <div className='mt-4'>
                        <p className='text-white text-lg text-neutral-500'>The desired platform for business analytics.</p>
                    </div>
                    <div className='mt-4'>
                        <Button href={'./home'} label={"Get started - for free"} />
                    </div>
                </div>
            </div>
            <div className='h-[70vh] w-full footer px-2 pb-2 '>
                <div className='h-full rounded-b-[6vh] flex bg-gray-texture'>
                    <div className='w-1/3 ml-48 h-[60%] flex flex-col items-start justify-evenly'>
                        <div className='flex justify-center items-center'>
                            <div className='w-12 h-12 bg-nova-icon bg-cover justify-center'></div>
                            <div>
                                <p className='text-white text-lg font-semibold'>Nova</p>
                            </div>
                        </div>
                        <div>
                            <p className='text-neutral-500'>Crafted by hand — powered by data</p>
                        </div>
                        <div>
                            <p className='hover:text-neutral-500 text-neutral-300 cursor-pointer'>Credits</p>
                        </div>
                    </div>

                    <div className='flex w-[18%] flex-col mt-8 justify-evenly h-[78%]'>
                        <a className='text-sm text-neutral-500'>Features</a>
                        <a href='#section' className='hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer'>Customer Dashboards
                        </a>
                        <a href='#section' className='hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer'>Integrations
                        </a>
                        <a href='#section' className='hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer'>Editor
                        </a>
                        <a href='#section' className='hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer'>                            Visualization
                        </a>
                        <a href='#section' className='hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer'>Customization
                        </a>
                        <a href='#section' className='hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer'>Speed</a>
                        <a href='#section' className='hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer'>                            Collaboration</a>
                    </div>

                    <div className="flex w-[18%] flex-col mt-8 justify-evenly h-[78%]">
                        <a className="text-sm text-neutral-500">Company</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Pricing</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Changelog</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Careers</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Support</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Community</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Book demo</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Locations</a>
                    </div>

                    <div className="flex flex-col mt-8 justify-evenly h-[78%]">
                        <a className="text-sm text-neutral-500">Resources</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Glossary</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Privacy Policy</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Terms of Services</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Security</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Brand</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Documentation</a>
                        <a href='#section' className="hover:text-neutral-500 text-sm text-neutral-300 cursor-pointer">Reports</a>
                    </div>
                </div>
            </div>
        </div>
    )
}