export function Button({ label }) {
    return (
        <div className="w-full flex justify-center items-center">
            <button className="px-8 py-2 bg-white text-sm text-black font-semibold rounded-xl shadow-lg shadow-white-600/50">{label}</button>
        </div>
    )
}