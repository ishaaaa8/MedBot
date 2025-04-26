import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("formFilled"); // Clear medical form status
    navigate("/login");
  };

  return (
    <nav className="w-full fixed top-0 left-0 bg-white border-b border-gray-200 text-gray-800 flex justify-between items-center px-4 md:px-8 py-3 shadow-sm z-50">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">MedBot</h1>
      </div>
      
      <button 
        onClick={handleLogout} 
        className="bg-white border border-red-500 text-red-500 px-4 py-1.5 text-sm font-medium rounded-full hover:bg-red-50 transition-all duration-300 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;


// code 1 working
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("token");
//     localStorage.removeItem("formFilled"); // Clear medical form status
//     navigate("/login");
//   };

//   return (
//     <nav className="w-full fixed top-0 left-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex justify-between items-center px-10 py-4 shadow-md z-50">
//       <h1 className="text-2xl font-bold tracking-wide">MedBot Dashboard</h1>
//       <button 
//         onClick={handleLogout} 
//         className="bg-red-500 px-5 py-2 text-lg font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
//       >
//         Logout
//       </button>
//     </nav>
//   );
// };

// export default Navbar;
