import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MedicalForm from "../components/MedicalForm";

const Dashboard = () => {
  const [formFilled, setFormFilled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    const currentUser = localStorage.getItem("userEmail");
    const storedUser = localStorage.getItem("lastUser");
  
    if (currentUser !== storedUser) {
      localStorage.setItem("lastUser", currentUser);
      localStorage.removeItem("formFilled"); // Reset form for new users
    }

    const isFormFilled = localStorage.getItem("formFilled") === "true";
    setFormFilled(isFormFilled);
    setLoading(false);
  }, [navigate]);

  const handleFormOpen = () => {
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    localStorage.setItem("formFilled", "true");
    setFormFilled(true);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Dashboard Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome to MedBot</h1>
                <p className="text-gray-600 mt-1">Your personal health assistant and medical companion</p>
              </div>
              
              {formFilled && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Medical Profile Complete
                </div>
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Section - Information */}
            <div className="md:col-span-5 lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">How It Works</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">1</div>
                      <h3 className="font-medium text-gray-800">Complete Medical Profile</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 pl-11">Fill out your medical information to help us personalize your experience.</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">2</div>
                      <h3 className="font-medium text-gray-800">Upload Prescriptions (Optional)</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 pl-11">Add your prescriptions for better medication tracking and reminders.</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">3</div>
                      <h3 className="font-medium text-gray-800">Chat with MedBot</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 pl-11">Ask health questions, get medication reminders, or discuss symptoms.</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">4</div>
                      <h3 className="font-medium text-gray-800">Get Personalized Insights</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 pl-11">Receive tailored health information based on your profile and conversations.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-6 mt-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h2 className="text-lg font-semibold">Important Notice</h2>
                </div>
                
                <p className="text-indigo-100 text-sm">
                  MedBot is not a replacement for professional medical advice. Always consult with your healthcare provider for medical concerns.
                </p>
              </div>
            </div>
            
            {/* Right Section - Call to Action */}
            <div className="md:col-span-7 lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-gray-100 flex flex-col justify-center items-center text-center">
                {!formFilled ? (
                  showForm ? (
                    <MedicalForm onSubmit={handleFormSubmit} />
                  ) : (
                    <div className="max-w-lg mx-auto py-8">
                      <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Medical Profile</h2>
                      <p className="text-gray-600 mb-8">Before chatting with MedBot, we need to gather some basic medical information to provide you with personalized care.</p>
                      <button
                        onClick={handleFormOpen}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-medium px-8 py-3 rounded-lg shadow-md transition duration-300 flex items-center gap-2 mx-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Start Medical Form
                      </button>
                    </div>
                  )
                ) : (
                  <div className="max-w-lg mx-auto py-8">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">You're Ready to Proceed!</h2>
                    <p className="text-gray-600 mb-8">Your medical profile is complete. Would you like to upload your prescriptions or start chatting with MedBot right away?</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => navigate("/upload-prescription")}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-medium px-6 py-3 rounded-lg shadow-md transition duration-300 flex items-center gap-2 justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Prescriptions
                      </button>
                      
                      <button
                        onClick={() => navigate("/chat")}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg font-medium px-6 py-3 rounded-lg shadow-md transition duration-300 flex items-center gap-2 justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Skip & Start Chatting
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import MedicalForm from "../components/MedicalForm";

// const Dashboard = () => {
//   const [formFilled, setFormFilled] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check authentication
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
    
//     const currentUser = localStorage.getItem("userEmail");
//     const storedUser = localStorage.getItem("lastUser");
  
//     if (currentUser !== storedUser) {
//       localStorage.setItem("lastUser", currentUser);
//       localStorage.removeItem("formFilled"); // Reset form for new users
//     }

//     const isFormFilled = localStorage.getItem("formFilled") === "true";
//     setFormFilled(isFormFilled);
//     setLoading(false);
//   }, [navigate]);

//   const handleFormOpen = () => {
//     setShowForm(true);
//   };

//   const handleFormSubmit = () => {
//     localStorage.setItem("formFilled", "true");
//     setFormFilled(true);
//     setShowForm(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="pt-20 pb-10 px-4">
//         <div className="max-w-screen-xl mx-auto">
//           {/* Dashboard Header */}
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Welcome to MedBot</h1>
//                 <p className="text-gray-600 mt-1">Your personal health assistant and medical companion</p>
//               </div>
              
//               {formFilled && (
//                 <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Medical Profile Complete
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* Main Content */}
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//             {/* Left Section - Information */}
//             <div className="md:col-span-5 lg:col-span-4">
//               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="bg-blue-100 p-2 rounded-lg">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <h2 className="text-lg font-semibold text-gray-800">How It Works</h2>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">1</div>
//                       <h3 className="font-medium text-gray-800">Complete Medical Profile</h3>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1 pl-11">Fill out your medical information to help us personalize your experience.</p>
//                   </div>
                  
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">2</div>
//                       <h3 className="font-medium text-gray-800">Chat with MedBot</h3>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1 pl-11">Ask health questions, get medication reminders, or discuss symptoms.</p>
//                   </div>
                  
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">3</div>
//                       <h3 className="font-medium text-gray-800">Get Personalized Insights</h3>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1 pl-11">Receive tailored health information based on your profile and conversations.</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-6 mt-6 text-white">
//                 <div className="flex items-center gap-3 mb-3">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                   <h2 className="text-lg font-semibold">Important Notice</h2>
//                 </div>
                
//                 <p className="text-indigo-100 text-sm">
//                   MedBot is not a replacement for professional medical advice. Always consult with your healthcare provider for medical concerns.
//                 </p>
//               </div>
//             </div>
            
//             {/* Right Section - Call to Action */}
//             <div className="md:col-span-7 lg:col-span-8">
//               <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-gray-100 flex flex-col justify-center items-center text-center">
//                 {!formFilled ? (
//                   showForm ? (
//                     <MedicalForm onSubmit={handleFormSubmit} />
//                   ) : (
//                     <div className="max-w-lg mx-auto py-8">
//                       <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//                         </svg>
//                       </div>
//                       <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Medical Profile</h2>
//                       <p className="text-gray-600 mb-8">Before chatting with MedBot, we need to gather some basic medical information to provide you with personalized care.</p>
//                       <button
//                         onClick={handleFormOpen}
//                         className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-medium px-8 py-3 rounded-lg shadow-md transition duration-300 flex items-center gap-2 mx-auto"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                         </svg>
//                         Start Medical Form
//                       </button>
//                     </div>
//                   )
//                 ) : (
//                   <div className="max-w-lg mx-auto py-8">
//                     <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                       </svg>
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-2">You're Ready to Chat!</h2>
//                     <p className="text-gray-600 mb-8">Your medical profile is complete. Start chatting with MedBot to get personalized health assistance.</p>
//                     <button
//                       onClick={() => navigate("/chat")}
//                       className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg font-medium px-8 py-3 rounded-lg shadow-md transition duration-300 flex items-center gap-2 mx-auto"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                       </svg>
//                       Start Chatting Now
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// CODE 1 WORKING
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import MedicalForm from "../components/MedicalForm";

// const Dashboard = () => {
//   const [formFilled, setFormFilled] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const currentUser = localStorage.getItem("userEmail"); // Store user's email on login
//     const storedUser = localStorage.getItem("lastUser");
  
//     if (currentUser !== storedUser) {
//       localStorage.setItem("lastUser", currentUser);
//       localStorage.removeItem("formFilled"); // Reset form for new users
//     }

//     const isFormFilled = localStorage.getItem("formFilled") === "true";
//     setFormFilled(isFormFilled);
//   }, []);

//   const handleFormOpen = () => {
//     setShowForm(true);
//   };

//   const handleFormSubmit = () => {
//     localStorage.setItem("formFilled", "true");
//     setFormFilled(true);
//     setShowForm(false);
//   };

//   return (
//     <div className="min-h-screen flex flex-col pt-16 bg-gray-100">
//       <Navbar />
//       <div className="flex flex-col items-center justify-center flex-grow space-y-6">
//         {!formFilled ? (
//           showForm ? (
//             <MedicalForm onSubmit={handleFormSubmit} />
//           ) : (
//             <button
//               onClick={handleFormOpen}
//               className="bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//             >
//               Fill Medical Form
//             </button>
//           )
//         ) : (
//           <button
//             onClick={() => navigate("/upload-prescription")}
//             className="bg-green-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
//           >
//             Chat with Chatbot
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
