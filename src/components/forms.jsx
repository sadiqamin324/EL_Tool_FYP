import React, { useState } from "react";

export default function DropdownForm() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="max-w-md mx-auto mt-8 border border-gray-300 p-4 rounded-md shadow-sm">
            {/* Dropdown Button */}
            <div className="mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-left border border-gray-400 p-2 rounded-md bg-white flex justify-between items-center"
                >
                    <span>Connection Type</span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                </button>
            </div>

            {/* Dropdown Form */}
            {isOpen && (
                <div className="border border-gray-300 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-4">Settings</h3>
                    <form className="space-y-4">
                        {/* Host Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Host Name</label>
                            <input
                                type="text"
                                defaultValue="localhost"
                                className="w-full border border-gray-400 p-2 rounded-md"
                            />
                        </div>

                        {/* Database Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Database Name</label>
                            <input
                                type="text"
                                defaultValue="safeeurrehman"
                                className="w-full border border-gray-400 p-2 rounded-md"
                            />
                        </div>

                        {/* Port Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Port Number</label>
                            <input
                                type="number"
                                defaultValue="5342"
                                className="w-full border border-gray-400 p-2 rounded-md"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User Name</label>
                            <input
                                type="text"
                                defaultValue="safee123"
                                className="w-full border border-gray-400 p-2 rounded-md"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                defaultValue="********"
                                className="w-full border border-gray-400 p-2 rounded-md"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                OK
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                            >
                                Test
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
