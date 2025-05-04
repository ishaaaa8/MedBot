import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [distressUsers, setDistressUsers] = useState([]);

    useEffect(() => {
        // Fetch distressed users from the backend
        axios.get('https://medbot-backend.onrender.com/api/admin/distress-users')
            .then(response => {
                setDistressUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching distress users:", error);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Distressed Users Dashboard
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
    {distressUsers.map(user => (
        <div
            key={user._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-500 ease-in-out border-2 border-red-400 hover:border-red-600 relative overflow-hidden"
        >
            {/* ALERT ICON */}
            <div className="absolute top-4 right-4 text-red-500 animate-pulse">
                🚨
            </div>

            <div className="flex flex-col items-center">
                {/* User Initial Circle */}
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold mb-4 shadow-inner">
                    {user.username?.charAt(0).toUpperCase()}
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.username}</h2>
                <p className="text-gray-600 text-sm mb-4">📧 {user.email}</p>

                {/* View Details Button */}
                <button className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                    View Details
                </button>
            </div>
        </div>
    ))}
</div>

            </div>
        </div>
    );
};

export default AdminDashboard;
