const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const Prescription = require("../models/Prescription");
const Medical = require("../models/MedicalForm"); 

const fs = require("fs");
const path = require("path");


const axios = require("axios");
const { Embeddings } = require("@langchain/core/embeddings");

class CustomNgrokEmbeddings extends Embeddings {
    constructor({ apiUrl }) {
        super();
        this.apiUrl = apiUrl;
    }

    async embedDocuments(texts) {
        const embeddings = await Promise.all(texts.map(text => this.embedQuery(text)));
        return embeddings;
    }

    async embedQuery(text) {
        try {
            const response = await axios.post(this.apiUrl, { text });
            return response.data; // array of floats
        } catch (error) {
            console.error("Embedding API error:", error.message);
            throw new Error("Failed to fetch embedding from custom API");
        }
    }
}
const embeddings = new CustomNgrokEmbeddings({
    apiUrl: "https://4f35-14-139-238-98.ngrok-free.app/",
});


const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant", 
    temperature: 0.7,
});

// const embeddings = new OllamaEmbeddings({
//     model: "mxbai-embed-large:latest",
//     temperature: 1,
//     baseUrl: "http://localhost:11434",
// });



async function fetchMedicalData(userEmail) {
    try {
        console.log(`Fetching medical data for ${userEmail}...`);
        const userPrescriptions = await Prescription.find({ userEmail });
        const userMedicalForm = await Medical.findOne({ email: userEmail });

        if (!userPrescriptions.length && !userMedicalForm) {
            console.warn(`No medical records found for ${userEmail}.`);
            return null;
        }

        const prescriptionText = formatPrescriptionData(userPrescriptions);
        const medicalFormText = formatMedicalFormData(userMedicalForm);

        return {
            prescriptionText,
            medicalFormText,
            fullMedicalHistory: combineMedicalHistory(prescriptionText, medicalFormText)
        };
    } catch (error) {
        console.error(`ERROR fetching medical data for ${userEmail}:`, error);
        return null;
    }
}

function formatPrescriptionData(prescriptions) {
    return prescriptions.length 
        ? prescriptions.map(p => p.extractedText).join("\n")
        : "No prescriptions found.";
}

function formatMedicalFormData(medicalForm) {
    if (!medicalForm) return "No medical form details available.";
    
    return `**Age:** ${medicalForm.age}\n**Allergies:** ${medicalForm.allergies?.join(", ") || "N/A"}\n**Conditions:** ${medicalForm.medical_conditions?.join(", ") || "N/A"}\n**Medications:** ${medicalForm.medications?.join(", ") || "N/A"}`;
}

function combineMedicalHistory(prescriptionText, medicalFormText) {
    return ` **User Medical History**\n\n **Prescriptions:**\n${prescriptionText}\n\n **Medical Form Details:**\n${medicalFormText}`;
}

async function storeUserMedicalData(userEmail) {
    const medicalData = await fetchMedicalData(userEmail);
    if (!medicalData) return null;

    const { fullMedicalHistory } = medicalData;

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
    const docs = await splitter.createDocuments([fullMedicalHistory]);

    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    console.log(`User medical data stored in vector DB for ${userEmail}`);

    return { vectorStore, fullMedicalHistory };
}

async function getMedicalResponse(userEmail, userInput) {
    try {
        console.log(" Loading medical context...");

        const userData = await storeUserMedicalData(userEmail);
        if (!userData) return " No medical history found. Please upload your medical details.";

        const { vectorStore, fullMedicalHistory } = userData;
        const retriever = vectorStore.asRetriever({ k: 5 });

        console.log(" Retriever initialized!");
        const retDocs = await retriever.getRelevantDocuments(userInput);
        const context = retDocs.map(doc => doc.pageContent).join("\n\n");

        const promptText = generatePromptText(fullMedicalHistory, context, userInput);

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: promptText }],
            model: "deepseek-r1-distill-llama-70b",
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
        });

        const content = chatCompletion.choices[0]?.message.content || "{}";
        console.log(content);
        return content;

    } catch (error) {
        console.error(" ERROR in getMedicalResponse:", error);
        return " An unexpected error occurred.";
    }
}

function generatePromptText(medicalHistory, context, userInput) {
    return `You are MedBot, a **highly intelligent AI medical assistant**. Your goal is to provide **medically accurate, highly personalized responses** based on:
                        
        - **The user's retrieved medical history** (prescriptions, conditions, allergies, medications).
        - **If you are unsure of the answer, you can say "I'm Sorry, Please consult a specialist"**.
        - **If user is depressed, highly anxious, or in distress, please respond the user appropriately and assist the user by providing admin email id "admin@gmail.com" to seek mental health support**.
        -**Respond the user in a friendly manner**.
        - **Relevant medical knowledge**.
        
        **Instructions:**
        1. Analyze the **user's medical history**.
        2. Understand the **current query**.
        3. If the query relates to health, **tailor your response using their history**.
        4. Offer **clear explanations and actionable advice**.
        5. If the query is general, respond normally.
        6. First answer the user of query and mention your thinking at last separately.
        7. Response should be user understandable.
        8. Response should be in points.
        
         **User's Medical History:**
        ${medicalHistory}

         **Retrieved Medical Knowledge:**
        ${context}

         **User's Query:**
        ${userInput}

         **MedBot's Response:**`;
}

module.exports = { getMedicalResponse };