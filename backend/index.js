import express from 'express';
import cors from 'cors';
import { translate } from '@vitalets/google-translate-api';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so your React frontend (port 5173) can communicate smoothly
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Main translation API route
app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;
        if (!text || !targetLanguage) {
            return res.status(400).json({ error: "Missing required data fields." });
        }

        // Complete dictionary mapping your frontend language array strings to ISO 639-1 language codes
        const langCodes = { 
            'English': 'en', 
            'Hindi': 'hi', 
            'Spanish': 'es', 
            'French': 'fr', 
            'Telugu': 'te', 
            'Tamil': 'ta', 
            'German': 'de', 
            'Arabic': 'ar', 
            'Japanese': 'ja' 
        };
        
        const targetCode = langCodes[targetLanguage] || 'en';

        // Execute the free translation lookup
        const result = await translate(text, { to: targetCode });
        
        // Return the final result format expected by your React Axios state update handler
        res.json({ translation: result.text });
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: "Translation endpoint failed internally." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Translation Server is running smoothly on http://localhost:${PORT}`);
});