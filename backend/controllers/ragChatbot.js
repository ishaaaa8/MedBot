const { ChatOllama } = require("@langchain/ollama"); 
const { OllamaEmbeddings } = require("@langchain/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const Prescription = require("../models/Prescription");
const Medical = require("../models/MedicalForm"); 

const fs = require("fs");
const path = require("path");

const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");

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

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_TOKEN, // safer than hardcoding
    model: "sentence-transformers/all-MiniLM-L6-v2" // or any compatible model
  });


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

// const { ChatOllama } = require("@langchain/ollama"); // Use local DeepSeek via Ollama
// const { ChatPromptTemplate } = require("@langchain/core/prompts");
// const { Document } = require("langchain/document");
// const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
// const { createRetrievalChain } = require("langchain/chains/retrieval");
// const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// const { OllamaEmbeddings } = require("@langchain/ollama");
// const { MemoryVectorStore } = require("langchain/vectorstores/memory");
// const Prescription = require("../models/Prescription");
// const Medical = require("../models/MedicalForm"); 

// const Groq = require("groq-sdk");
// const groq = new Groq({
//     apiKey: "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", 
//     model: "llama-3.1-8b-instant", 
//     temperature: 0.7,
// });


// //Initialize in-memory vector store (replace with Pinecone/Weaviate for production)
// const embeddings = new OllamaEmbeddings(
//     {
//         model: "mxbai-embed-large:latest",
//         temperature: 1,
//         baseUrl: "http://localhost:11434",
//     }
// );

// async function storeUserMedicalData(userEmail) {
//     try {
//         console.log(` Fetching medical data for ${userEmail}`);
        
//         // Fetch prescriptions
//         const userPrescriptions = await Prescription.find({ userEmail });
//         // console.log("Shan" + userPrescriptions);
//         // Fetch medical form details
//         const userMedicalForm = await Medical.findOne({ email: userEmail });

//         // console.log("isha" + userMedicalForm);
//         if (!userPrescriptions.length && !userMedicalForm) {
//             console.warn(` No medical records found for ${userEmail}.`);
//             return null;
//         }

//         //  Extract & format prescription details
//         const prescriptionText = userPrescriptions.length 
//             ? userPrescriptions.map(p => p.extractedText).join("\n") 
//             : "No prescriptions found.";

//         console.log("Prescription Text: ", prescriptionText);
//         //  Extract & format medical form details
//         const medicalFormText = userMedicalForm
//   ? `**Age:** ${userMedicalForm.age}\n**Allergies:** ${userMedicalForm.allergies?.join(", ") || "N/A"}\n**Conditions:** ${userMedicalForm.medical_conditions?.join(", ") || "N/A"}\n**Medications:** ${userMedicalForm.medications?.join(", ") || "N/A"}`
//   : "No medical form details available.";

// console.log("Medical Form Text:", medicalFormText);


//         //  Combine both into structured history
//         const userMedicalHistory = ` **User Medical History**\n\n **Prescriptions:**\n${prescriptionText}\n\n **Medical Form Details:**\n${medicalFormText}`;
        
//         console.log(" Compiled User Medical History:\n", userMedicalHistory);

//         //  Split text into chunks
//         const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
//         const docs = await splitter.createDocuments([userMedicalHistory]);

//         //  Store in vector database
//         const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
//         console.log(` User medical data stored in vector DB for ${userEmail}`);

//         return { vectorStore, userMedicalHistory };

//     } catch (error) {
//         console.error(`ERROR: Failed to store user medical data in vector DB for ${userEmail}`, error);
//         return null;
//     }
// }

// // Get Medical Response
// async function getMedicalResponse(userEmail, userInput) {
//     try {
//         console.log("Loading medical context...");

//         // Store user medical data in vector DB
//         const userData = await storeUserMedicalData(userEmail);
//         if (!userData) {
//             return "No medical history found. Please upload your medical details.";
//         }

//         const { vectorStore, userMedicalHistory } = userData;

//         // Retrieve relevant documents
//         const retriever = vectorStore.asRetriever({ k: 5 });

//         console.log("Retriever initialized!");
//         const retDocs  = await retriever.getRelevantDocuments(userInput);
//         const context = retDocs.map(doc => doc.pageContent).join("\n\n");
//         console.log("Retrieved Documents:\n", context);
//         // Create retrieval chain
//         console.log("Creating retrieval chain...");
       

//         console.log("Retrieval chain created successfully!");
//         const promptText = ` You are MedBot, a **highly intelligent AI medical assistant**. Your goal is to provide **medically accurate, highly personalized responses** based on:
                        
//                         - **The user's retrieved medical history** (prescriptions, conditions, allergies, medications).
//                         - **Relevant medical knowledge**.
                        
//                          **Instructions:**
//                         1. Analyze the **user's medical history**.
//                         2️. Understand the **current query**.
//                         3️. If the query relates to health, **tailor your response using their history**.
//                         4️.  Offer **clear explanations and actionable advice in readable points**.
//                         5.  If the query is general, respond normally.
//                         6. First answer the user of query and mention yout thinking at last seperately.
//                         7. Response should be user understandable.


//                          **User's Medical History:**
//                         ${userMedicalHistory}

//                          **Retrieved Medical Knowledge:**
//                         ${context}

//                          **User's Query:**
//                         ${userInput}

//                          **MedBot's Response:**`

   
//     const chatCompletion = await groq.chat.completions.create({
//         messages: [
//             { role: "user", content: promptText },
//         ],
//         model: "llama-3.1-8b-instant",
//         temperature: 0.7,
//         max_tokens: 500,
//         top_p: 1,
//     });

//     const content = chatCompletion.choices[0]?.message.content || "{}";

//     console.log(content);
//     return content;

//     } catch (error) {
//         console.error("ERROR: General error in getMedicalResponse", error);
//         return "An unexpected error occurred.";
//     }
// }

// module.exports = { getMedicalResponse };