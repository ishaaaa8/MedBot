// medicalController.js
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OllamaEmbeddings } = require("@langchain/ollama");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Prescription = require("../models/Prescription");
const awsTextractOCR = require('./textractOCR.js'); // Import using CommonJS

exports.storePrescriptionInVectorDB = async (extractedText, userEmail) => {
  try {
    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
    const docs = await splitter.createDocuments([extractedText]);

    // Instantiate vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OllamaEmbeddings(
      {
        model: "llama3.2:latest",
        temperature: 1,
        baseUrl: "http://localhost:11434",
      }
    ));
    console.log(`Prescription stored in vector DB for ${userEmail}`);
  } catch (error) {
    console.error("ERROR: Failed to store prescription in vector DB", error);
  }
};

exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userEmail = req.body.userEmail || req.body.email;
    console.log("Received userEmail:", userEmail);

    const filePath = req.file.path;
    console.log("Received file path:", filePath);

    const extractedText = await awsTextractOCR(filePath); // Use CommonJS import
    console.log("Extracted Text:", extractedText);

    const newPrescription = new Prescription({
      userEmail,
      filePath,
      extractedText
    });

    await newPrescription.save();

    res.status(200).json({
      message: "Prescription uploaded and processed successfully!",
      data: newPrescription
    });

  } catch (error) {
    console.error("ERROR: Failed to upload and process prescription", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
