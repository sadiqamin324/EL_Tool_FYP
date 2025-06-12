import React from "react";

export default function AccountSettings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 flex justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8">

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-400 p-1 rounded-full">
            <img
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              src="https://via.placeholder.com/150"
              alt=""
            />
          </div>
          <input
            type="file"
            className="mt-4 text-sm text-gray-700"
          />
        </div>

        {/* Input Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="First Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Country"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Language"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-6 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
