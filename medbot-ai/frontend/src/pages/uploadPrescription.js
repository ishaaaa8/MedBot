import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadPrescription = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      navigate("/chat"); // Skip upload if no file selected
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("prescription", file);
    formData.append("userEmail", localStorage.getItem("userEmail")); // Attach user email if needed

    try {
      const response = await fetch("http://localhost:5000/api/upload-prescription", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    setLoading(false);
    navigate("/chat"); // Proceed to chatbot
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Upload Your Prescription (Optional)</h2>
        
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="border p-2 rounded w-full mb-4"
        />

        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload & Continue"}
          </button>

          <button
            onClick={() => navigate("/chat")}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Continue Without Uploading
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
