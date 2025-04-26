import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const UploadPrescription = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)) {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please select a valid image file (jpg, jpeg, or png)");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setLoading(true);
    setError("");
        
    const formData = new FormData();
    formData.append("prescription", file);
    formData.append("userEmail", localStorage.getItem("userEmail"));

    try {
      const response = await fetch("http://localhost:5000/medical/upload-prescription", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadSuccess(true);
        setTimeout(() => navigate("/chat"), 1500);
      } else {
        setError(data.error || "Failed to upload prescription");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const skipUpload = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Upload Prescription</h1>
                <p className="text-gray-600 mt-1">Upload your prescription for better medication tracking</p>
              </div>
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
                  <h2 className="text-lg font-semibold text-gray-800">Why Upload Your Prescription?</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">1</div>
                      <h3 className="font-medium text-gray-800">Medication Tracking</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 pl-11">MedBot will track your medications and remind you when to take them.</p>
                  </div>
                  

                  <div>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">2</div>
                      <h3 className="font-medium text-gray-800">Side Effect Monitoring</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 pl-11">Get alerts about potential side effects and drug interactions.</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-600">3</div>
                      <h3 className="font-medium text-gray-800">Better Recommendations</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 pl-11">MedBot provides more personalized health insights based on your medications.</p>
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-gray-600">
                  <p className="font-medium mb-2">Accepted File Types:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>JPEG, PNG, JPG images only</li>
                    <li>Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-6 mt-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h2 className="text-lg font-semibold">Privacy Notice</h2>
                </div>
                
                <p className="text-indigo-100 text-sm">
                  Your prescription data is encrypted and stored securely. We never share your medical information with third parties.
                </p>
              </div>
            </div>
            
            {/* Right Section - Upload Form */}
            <div className="md:col-span-7 lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-gray-100">
                <div className="max-w-lg mx-auto py-8">
                  {uploadSuccess ? (
                    <div className="text-center">
                      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Successful!</h2>
                      <p className="text-gray-600 mb-4">Your prescription has been uploaded successfully.</p>
                      <p className="text-gray-600">Redirecting to chat...</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3V6" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Prescription</h2>
                      <div className="mb-6">
                        <input
                          type="file"
                          className="block w-full text-gray-800 bg-white p-3 border rounded-lg"
                          onChange={handleFileChange}
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={handleUpload}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                          disabled={loading}
                        >
                          {loading ? "Uploading..." : "Upload"}
                        </button>
                        <button
                          onClick={skipUpload}
                          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg"
                        >
                          Skip
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
