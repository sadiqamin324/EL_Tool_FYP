export function LoaderPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="z-50 flex flex-col items-end relative">
        {/* Animated Dot */}
        <span className="relative flex size-3 top-2 left-1">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
        </span>

        {/* Processing Box */}
        <div className="border w-max h-max bg-white border-gray-300 p-4 rounded-lg shadow-md">
          <p className="text-sky-400 font-semibold text-lg tracking-wide">
            Processing your data...
          </p>
        </div>
      </div>
    </div>
  );
}
