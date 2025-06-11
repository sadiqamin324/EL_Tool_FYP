export default function Charts({ title, height = '[45%]', width = "full", keys, pic, YCordinates, label, icon: Icon, textDescription }) {
    return (<div className='h-[78vh] bg-neutral-50 flex flex-col items-center pt-[.9rem] rounded-3xl'>
        <div className='h-[80%] w-[94%] shadow-md  rounded-xl bg-white'>
            <div className='title h-[10%] flex items-center border-b border-gray-300 px-4'>
                <p className='text-[13px] font-medium'>{title} </p>
            </div>
            <div className='keys h-[10%] my-2 flex items-center justify-evenly'>
                {keys?.length > 0 && (
                    keys.map((keyObj, index) => {
                        const [color, text] = Object.entries(keyObj)[0];
                        return (
                            <div key={index} className='key flex items-center'>
                                <div className={`w-3 h-3 rounded-sm bg-${color} mr-1`}></div>
                                <div className='ml-1'>
                                    <p className='text-xs'>{text}</p>
                                </div>
                            </div>
                        );
                    })
                )}

            </div>
            <div className={`graph-box w-${width} h-${height} bg-${pic} mb-10 bg-cover`}></div>
            <div className='y-cordinates flex justify-evenly items-center h-[10%]'>
                {YCordinates?.length > 0 && (

                    YCordinates.map((value, index) => {
                        <div>
                            <p key={index} className='text-gray-400 text-[13px]'>{value}</p>
                        </div>
                    }))

                }

            </div>
            <div className='label flex justify-evenly items-center h-[8%]'>
                <div>
                    <p className='text-gray-700 text-[12px] font-normal'>{label}</p>
                </div>

            </div>

        </div>
        <div className='text-description mx-2 h-[20%] flex items-center'>

            <p className='text-[15px] font-normal text-slate-800'><Icon className='inline-block text-[20px] mr-1 mb-1 text-slate-800' /><span className='font-bold'>{textDescription[0]}</span> {textDescription[1]}</p>
        </div>
    </div>)
}