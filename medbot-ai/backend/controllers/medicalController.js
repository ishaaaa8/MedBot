const { MemoryVectorStore } = require("langchain/vectorstores/memory");  
const textSplitter = require("langchain/text_splitter").RecursiveCharacterTextSplitter;
const pdfParse = require("pdf-parse");
const Prescription = require("../models/Prescription");
const { OllamaEmbeddings } = require("@langchain/ollama");
const vectorStore = new MemoryVectorStore(new OllamaEmbeddings());
const fs = require("fs");

exports.storePrescriptionInVectorDB = async (extractedText, userEmail) => {
    try {
        // Split text into chunks
        const splitter = new textSplitter({ chunkSize: 500, chunkOverlap: 50 });
        const docs = await splitter.createDocuments([extractedText]);

        // Store in vector database with user reference
        await vectorStore.addDocuments(docs);

        console.log(`✅ Prescription stored in vector DB for ${userEmail}`);
    } catch (error) {
        console.error("🔥 ERROR: Failed to store prescription in vector DB", error);
    }
};

exports.uploadPrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        // console.log(req.filePath);

        const userEmail = req.body.email; // Get user email
        const filePath = req.file.path;   // Store file path

        // Extract text from the PDF
        const pdfBuffer = fs.readFileSync(req.file.path);
const pdfData = await pdfParse(pdfBuffer);
        const extractedText = pdfData.text;

        // Save to MongoDB
        const newPrescription = new Prescription({
            userEmail,
            filePath,
            extractedText
        });

        await newPrescription.save();
        res.status(200).json({ message: "Prescription uploaded successfully!", data: newPrescription });

    } catch (error) {
        console.error("🔥 ERROR: Failed to upload prescription", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
