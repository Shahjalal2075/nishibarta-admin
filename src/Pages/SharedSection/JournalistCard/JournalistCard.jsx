import { Ban, Pencil } from 'lucide-react';
import React from 'react';

const JournalistCard = ({j}) => {
    return (
        <div
            className="relative bg-gradient-to-br from-white via-blue-50 to-white border border-blue-100 rounded-2xl shadow-md p-5 flex justify-between items-center hover:shadow-xl transition flex-col md:flex-row gap-4 ms:gap-0"
        >
            <div className="flex items-center gap-5 flex-col md:flex-row">
                <img
                    src={j.profile}
                    alt={j.username}
                    className="w-16 h-16 rounded-full border border-blue-300 object-cover shadow-sm"
                />
                <div className="text-sm text-gray-800 flex flex-col items-start">
                    <p><span className="font-semibold text-blue-600">Username:</span> {j.username}</p>
                    <p><span className="font-semibold text-pink-500">Email:</span> {j.email}</p>
                    <p><span className="font-semibold text-green-600">Phone:</span> {j.phone}</p>
                    <p><span className="font-semibold text-purple-500">City:</span> {j.city}</p>
                    <p><span className="font-semibold text-indigo-600">Level:</span> {j.level}</p>
                </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 items-end sm:items-center">
                <button className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm">
                    <Pencil size={16} /> Edit
                </button>
                <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm">
                    <Ban size={16} /> Ban
                </button>
            </div>
        </div>
    );
};

export default JournalistCard;