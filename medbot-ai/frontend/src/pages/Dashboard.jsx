import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MedicalForm from "../components/MedicalForm";

const Dashboard = () => {
  const [formFilled, setFormFilled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isFormFilled = localStorage.getItem("formFilled") === "true";
    setFormFilled(isFormFilled);
  }, []);

  const handleFormOpen = () => {
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    localStorage.setItem("formFilled", "true");
    setFormFilled(true);
    setShowForm(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow space-y-4">
        {!formFilled ? (
          showForm ? (
            <MedicalForm onSubmit={handleFormSubmit} />
          ) : (
            <button
              onClick={handleFormOpen}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Fill Medical Form
            </button>
          )
        ) : (
          <button
            onClick={() => navigate("/upload-prescription")}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Chat with Chatbot
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
