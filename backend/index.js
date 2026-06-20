import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main translation API route using the official MyMemory API
app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;
        if (!text || !targetLanguage) {
            return res.status(400).json({ error: "Missing required data fields." });
        }

        // Map languages to standard pairs (Source Language is auto-detected)
        const langCodes = { 
            'English': 'en', 'Hindi': 'hi', 'Spanish': 'es', 
            'French': 'fr', 'Telugu': 'te', 'Tamil': 'ta', 
            'German': 'de', 'Arabic': 'ar', 'Japanese': 'ja' 
        };
        
        const targetCode = langCodes[targetLanguage] || 'en';

        // Fetching directly from MyMemory's free API endpoint
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${targetCode}`
        );
        
        const data = await response.json();

        if (data.responseData && data.responseData.translatedText) {
            res.json({ translation: data.responseData.translatedText });
        } else {
            throw new Error("Invalid API response format");
        }

    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: "Translation endpoint failed internally." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Stable Cloud Translation Server is running smoothly on port ${PORT}`);
});
