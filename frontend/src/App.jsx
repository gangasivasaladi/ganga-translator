import React, { useState } from 'react';
import axios from 'axios';

// Reusable Panel Component to keep code DRY and easy to maintain
function TranslatorPanel({ 
  label, 
  badgeColor, 
  buttonColor, 
  focusRing,
  sourceLang, 
  setSourceLang, 
  targetLang, 
  text, 
  setText, 
  translatedOutput, 
  loading, 
  languages, 
  onTranslate 
}) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className={`font-bold uppercase tracking-wider text-xs px-3 py-1 rounded-full border ${badgeColor}`}>
            {label}
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-400">Speaks:</span>
            <select 
              value={sourceLang} 
              onChange={(e) => setSourceLang(e.target.value)}
              className={`bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 ${focusRing} cursor-pointer`}
            >
              {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Type something in ${sourceLang}...`}
          className={`w-full h-32 p-4 bg-slate-900 border border-slate-700 rounded-xl resize-none text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 ${focusRing}`}
        />

        <button
          onClick={onTranslate}
          disabled={loading || !text.trim()}
          className={`mt-4 w-full ${buttonColor} text-slate-950 font-bold py-3 px-4 rounded-xl shadow-md transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {loading ? 'Translating...' : `Translate to ${targetLang} ➡️`}
        </button>
      </div>

      <div className="mt-6 p-4 bg-slate-900 border border-dashed border-slate-700 rounded-xl min-h-[80px] flex flex-col justify-center">
        <span className="text-xs text-slate-500 block mb-1 font-semibold uppercase tracking-wider">
          Hearing in ({targetLang}):
        </span>
        <p className="text-lg text-slate-200 font-medium whitespace-pre-wrap">
          {translatedOutput || <span className="text-slate-600 italic text-sm">Waiting for response...</span>}
        </p>
      </div>
    </div>
  );
}

function App() {
  // Person A's state
  const [textA, setTextA] = useState('');
  const [langA, setLangA] = useState('English');
  const [translatedForB, setTranslatedForB] = useState('');
  const [loadingA, setLoadingA] = useState(false);

  // Person B's state
  const [textB, setTextB] = useState('');
  const [langB, setLangB] = useState('Hindi');
  const [translatedForA, setTranslatedForA] = useState('');
  const [loadingB, setLoadingB] = useState(false);

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'Telugu', 'Tamil', 'German', 'Arabic', 'Japanese'];

  // Central Translation logic
  const handleTranslate = async (text, targetLanguage, setOutput, setLoading) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';
      const response = await axios.post(`${apiBase}/translate`, {
        text: text,
        targetLanguage: targetLanguage
      });
      setOutput(response.data.translation);
    } catch (error) {
      console.error("Translation failed:", error);
      setOutput("⚠️ Failed to connect to server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-5 text-center shadow-md">
        <h1 className="text-3xl font-extrabold text-teal-400 tracking-wide">🌐 AI Conversation Translator</h1>
        <p className="text-sm text-slate-400 mt-1">Talk across languages instantly powered by Gemini</p>
      </header>

      {/* Main Split Interface */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* Person A Side */}
        <TranslatorPanel 
          label="Person A"
          badgeColor="bg-teal-950 text-teal-400 border-teal-800"
          buttonColor="bg-teal-400 hover:bg-teal-500 text-slate-900"
          focusRing="focus:ring-teal-500"
          sourceLang={langA}
          setSourceLang={setLangA} // 🎯 FIXED: Now passing the correct state modifier function
          targetLang={langB}
          text={textA}
          setText={setTextA}
          translatedOutput={translatedForB}
          loading={loadingA}
          languages={languages}
          onTranslate={() => handleTranslate(textA, langB, setTranslatedForB, setLoadingA)}
        />

        {/* Person B Side */}
        <TranslatorPanel 
          label="Person B"
          badgeColor="bg-purple-950 text-purple-400 border-purple-800"
          buttonColor="bg-purple-400 hover:bg-purple-500 text-slate-100"
          focusRing="focus:ring-purple-500"
          sourceLang={langB}
          setSourceLang={setLangB} // 🎯 FIXED: Now passing the correct state modifier function
          targetLang={langA}
          text={textB}
          setText={setTextB}
          translatedOutput={translatedForA}
          loading={loadingB}
          languages={languages}
          onTranslate={() => handleTranslate(textB, langA, setTranslatedForA, setLoadingB)}
        />

      </main>
    </div>
  );
}

export default App;