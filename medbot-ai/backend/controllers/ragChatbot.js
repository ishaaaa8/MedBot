const { ChatOllama } = require("@langchain/ollama"); // ✅ Use local DeepSeek via Ollama
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Document } = require("langchain/document");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OllamaEmbeddings } = require("@langchain/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const fs = require("fs");
const path = require("path");

// ✅ Ensure LLM is initialized using Ollama
const deepseek = new ChatOllama({
    baseUrl: "http://localhost:11434", // ✅ Local Ollama Server
    model: "deepseek-r1:1.5b", // ✅ Make sure this model is pulled in Ollama
    temperature: 0.7,
});

// ✅ Global Prompt Template (Avoid Repeating)
const prompt = ChatPromptTemplate.fromTemplate(`
You are MedBot, an AI medical assistant. Use the retrieved medical knowledge to answer user queries with accuracy.

If the user asks something medical, retrieve relevant medical information and respond. Otherwise, generate a general answer.

Retrieved Context:
{context}

User Query:
{input}

AI Response:
`);

// ✅ Load medical knowledge into a vector store (Memory-based)
async function loadMedicalContext() {
    const filePath = path.join(__dirname, "medical_data.txt");

    let medicalText = ""; // ✅ Define outside try-catch to ensure function scope

    try {
        medicalText = fs.readFileSync(filePath, "utf-8"); // ✅ Correct path
        console.log("✅ Medical data loaded successfully!");
    } catch (error) {
        console.error("🔥 ERROR: Could not load medical_data.txt", error);
        return null; // Return null if loading fails
    }

    if (!medicalText) {
        console.error("⚠️ ERROR: medical_data.txt is empty!");
        return null;
    }

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
    const documents = await textSplitter.createDocuments([medicalText]);

    const vectorStore = await MemoryVectorStore.fromDocuments(documents, new OllamaEmbeddings());
    return vectorStore;
}

// ✅ Get Medical Response
async function getMedicalResponse(userInfo, userInput) {
    try {
        console.log("🚀 Loading medical context...");
        const vectorStore = await loadMedicalContext();

        if (!vectorStore) {
            console.error("⚠️ ERROR: Vector store could not be created.");
            return "⚠️ Sorry, I couldn't load medical data. Please try again later.";
        }

        const retriever = vectorStore.asRetriever({ k: 3 }); // Fetch top 3 relevant docs
        console.log("✅ Retriever initialized!");

        // 🔥 DEBUG: Check if retriever exists
        if (!retriever) {
            console.error("⚠️ ERROR: Retriever initialization failed!");
            return "⚠️ Sorry, retrieval failed. Try again later.";
        }

        console.log("🚀 Creating retrieval chain...");
        let retrievalChain;
        
        try {
            retrievalChain = await createRetrievalChain({
                combineDocsChain: await createStuffDocumentsChain({
                    llm: deepseek,
                    prompt: ChatPromptTemplate.fromTemplate(`
                        You are MedBot, an AI medical assistant. Use retrieved medical knowledge **and the given user medical history** to answer accurately.

                        User Medical History:
                        {user_info}

                        Retrieved Context:
                        {context}

                        User Query:
                        {input}

                        AI Response:
                    `),
                }),
                retriever: retriever,
            });
        } catch (error) {
            console.error("🔥 ERROR: Retrieval chain creation failed!", error);
            return "⚠️ Retrieval chain creation failed. Please check the logs.";
        }

        console.log("✅ Retrieval chain created successfully!");

        try {
            console.log("🚀 Invoking retrieval chain...");
            const response = await retrievalChain.invoke({
                user_info: userInfo, // Pass user medical history
                input: userInput,    // Pass user query
            });

            console.log("✅ Response received:", response);
            return response.answer; // ✅ Return chatbot response
        } catch (error) {
            console.error("🔥 ERROR: Retrieval chain invocation failed!", error);
            return "⚠️ An error occurred while generating the response.";
        }

    } catch (error) {
        console.error("🔥 ERROR: General error in getMedicalResponse", error);
        return "⚠️ An unexpected error occurred.";
    }
}

module.exports = { getMedicalResponse };