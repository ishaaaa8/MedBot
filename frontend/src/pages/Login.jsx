import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);
      if (email === "admin@gmail.com") {
        navigate("/adminDashboard"); // Redirect to admin dashboard
      }
      if(email != "admin@gmail.com") {
        navigate("/dashboard"); // Redirect to regular dashboard
      }
      
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <div className="bg-white/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to MedBot</h2>
          <p className="text-indigo-100 mt-1">Login to access your health assistant</p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center ${
                isLoading 
                  ? "bg-indigo-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Create Account
              </Link>
            </p>
          </div>

          {/* Button to sign in as Admin */}
          <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                        Signup as admin?
                        <Link to="/adminlogin" className="font-medium text-indigo-600 hover:text-indigo-500">
                          Log in as Admin
                        </Link>
                </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     // Reset error state
//     setError("");
    
//     if (!email.trim() || !password.trim()) {
//       setError("Please fill in all fields");
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
      
//       const res = await axios.post("http://localhost:5000/auth/login", {
//         email,
//         password,
//       });
      
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userEmail", email);
//       if (email === "admin@gmail.com") {
//         navigate("/adminDashboard"); // Redirect to admin dashboard
//       }
//       if(email != "admin@gmail.com") {
//         navigate("/dashboard"); // Redirect to regular dashboard
//       }
      
//     } catch (error) {
//       console.error("Login Failed:", error.response?.data || error.message);
//       setError(error.response?.data?.message || "Invalid credentials. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
//           <div className="bg-white/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-white">Welcome to MedBot</h2>
//           <p className="text-indigo-100 mt-1">Login to access your health assistant</p>
//         </div>
        
//         <div className="p-6">
//           {error && (
//             <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {error}
//             </div>
//           )}
          
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                   </svg>
//                 </div>
//                 <input
//                   id="email"
//                   type="email"
//                   placeholder="your.email@example.com"
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
            
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
            
//             <button 
//               type="submit" 
//               disabled={isLoading}
//               className={`w-full py-2 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center ${
//                 isLoading 
//                   ? "bg-indigo-300 cursor-not-allowed" 
//                   : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : "Sign In"}
//             </button>
//           </form>
          
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{" "}
//               <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 Create Account
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// // CODE 1 WORKING
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // const Login = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const navigate = useNavigate();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await axios.post("http://localhost:5000/auth/login", {
// //         email,
// //         password,
// //       });
// //       alert("Login Successful!");
// //       localStorage.setItem("token", res.data.token);
// //       localStorage.setItem("userEmail", email);
// //       navigate("/dashboard"); // Redirect after login
// //     } catch (error) {
// //       console.error("Login Failed:", error.response.data);
// //       alert("Invalid credentials");
// //     }
// //   };

// //   return (
// //     <div className="bg-white p-8 rounded-lg shadow-md w-96">
// //       <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
// //       <form onSubmit={handleLogin} className="mt-4">
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           className="w-full p-2 border rounded mb-3"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="w-full p-2 border rounded mb-3"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />
// //         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
// //           Login
// //         </button>
// //       </form>
// //       <p className="mt-3 text-sm text-center">
// //         Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a>
// //       </p>
// //     </div>
// //   );
// // };

// // export default Login;
