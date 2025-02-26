const express = require("express");
const Medical = require("../models/MedicalForm");

const router = express.Router();

// Save Medical Details
router.post("/save", async (req, res) => {
  const { email, age, gender, medical_conditions, allergies, medications } = req.body;

  try {
    let medicalRecord = await Medical.findOne({ email });

    if (medicalRecord) {
      return res.status(400).json({ message: "Medical details already exist!" });
    }

    medicalRecord = new Medical({ email, age, gender, medical_conditions, allergies, medications });
    await medicalRecord.save();
    res.status(201).json({ message: "Medical details saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get User Medical Details
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const medicalRecord = await Medical.findOne({ email });
    if (!medicalRecord) {
      return res.status(404).json({ message: "No medical details found!" });
    }
    res.status(200).json(medicalRecord);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
