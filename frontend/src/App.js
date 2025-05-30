import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./pages/Chatbot";
import UploadPrescription from "./pages/uploadPrescription";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from  "./pages/AdminLogin"
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <div
  className={`min-h-screen flex flex-col transition-all duration-300 bg-cover bg-center ${
    darkMode
      ? "bg-[url('/public/medical-dark.jpg')]"
      : "bg-[url('/public/medical-dark.jpg')]"
  }`} */}
{/* > */}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/upload-prescription" element={<UploadPrescription/>}></Route>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/chat" element={<Chatbot />} />
        </Route>

        {/* Redirect Unknown Routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
