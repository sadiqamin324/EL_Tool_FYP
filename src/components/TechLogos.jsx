export function TechLogo({ justify = "start", width, height, logo }) {
    return (
        <div className={`w-full flex justify-${justify}`} >
            <div className='bg-white rounded-full shadow-md border-gray-300 w-14 h-14 flex justify-center items-center'>
                <div className={`bg-${logo} bg-cover w-${width} h-${height}`}></div>
            </div>
        </ div>
    )
}