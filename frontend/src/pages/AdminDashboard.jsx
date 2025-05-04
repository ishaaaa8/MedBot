import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [distressUsers, setDistressUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('https://medbot-backend.onrender.com/api/admin/distress-users')
            .then(response => {
                setDistressUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching distress users:", error);
                setIsLoading(false);
            });
    }, []);

    const handleLogout = () => {
        // Add logout logic here (e.g., clearing tokens, redirecting)
        alert("Logged out");
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full">
            {/* Top Bar */}
            <div className="w-full flex justify-between items-center px-8 py-4 bg-white border-b shadow-sm">
                <h1 className="text-2xl font-bold text-purple-700">MEDBOT-AI</h1>
                <button
                    onClick={handleLogout}
                    className="text-red-600 border border-red-500 hover:bg-red-50 px-5 py-2 rounded-lg font-medium transition-all duration-300"
                >
                    Logout
                </button>
            </div>
            
            {/* Page Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Admin Dashboard – Distressed Users
                    </h2>
                    <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        Total Users: {isLoading ? "..." : distressUsers.length}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : distressUsers.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-lg">No distressed users found at this time.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {distressUsers.map(user => (
                            <div
                                key={user._id}
                                className="bg-white p-6 rounded-xl border-l-4 border-l-red-500 border-t border-r border-b border-purple-100 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md relative"
                            >
                                {/* Alert Icon */}
                                <div className="absolute top-3 right-3 text-red-500 animate-pulse text-lg">🚨</div>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold shadow-inner mb-4">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800">{user.username}</h4>
                                    <p className="text-sm text-gray-600 mt-1 mb-4">📧 {user.email}</p>
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2.5 px-6 rounded-lg shadow transition-all duration-300 flex items-center justify-center">
                                        <span>View Details</span>
                                        <span className="ml-2">→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const AdminDashboard = () => {
//     const [distressUsers, setDistressUsers] = useState([]);

//     useEffect(() => {
//         // Fetch distressed users from the backend
//         axios.get('https://medbot-backend.onrender.com/api/admin/distress-users')
//             .then(response => {
//                 setDistressUsers(response.data);
//             })
//             .catch(error => {
//                 console.error("Error fetching distress users:", error);
//             });
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <div className="max-w-7xl mx-auto">
//                 <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
//                     Distressed Users Dashboard
//                 </h1>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
//     {distressUsers.map(user => (
//         <div
//             key={user._id}
//             className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-500 ease-in-out border-2 border-red-400 hover:border-red-600 relative overflow-hidden"
//         >
//             {/* ALERT ICON */}
//             <div className="absolute top-4 right-4 text-red-500 animate-pulse">
//                 🚨
//             </div>

//             <div className="flex flex-col items-center">
//                 {/* User Initial Circle */}
//                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold mb-4 shadow-inner">
//                     {user.username?.charAt(0).toUpperCase()}
//                 </div>

//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.username}</h2>
//                 <p className="text-gray-600 text-sm mb-4">📧 {user.email}</p>

//                 {/* View Details Button */}
//                 <button className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
//                     View Details
//                 </button>
//             </div>
//         </div>
//     ))}
// </div>

//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;
