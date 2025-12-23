// Minimal Express proxy for Gemini API calls
// Usage: set GEMINI_API_KEY in environment and run `node server/chat-proxy.js`

const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

if (!API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set. The proxy will return 500 for requests.');
} else {
  console.log('✅ GEMINI_API_KEY loaded successfully');
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: 'GEMINI API key missing on server' });
    const { messages } = req.body;

    // Convert messages to Gemini format
    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          }
        })
      }
    );

    const json = await response.json();
    
    if (json.error) {
      console.error('Gemini API error:', json.error);
      return res.status(500).json({ error: json.error.message });
    }

    const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    res.json({ reply });
  } catch (err) {
    console.error('❌ chat proxy error', err);
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: 'GEMINI API key missing on server' });
    const { text } = req.body;
    const prompt = `Please provide a clear and concise summary of the following content in 2-3 paragraphs, using language that a non-technical user can easily understand:\n\n${text}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          }
        })
      }
    );

    const json = await response.json();
    
    if (json.error) {
      console.error('Gemini API error:', json.error);
      return res.status(500).json({ error: json.error.message });
    }

    const summary = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ summary });
  } catch (err) {
    console.error('❌ summarize proxy error', err);
    res.status(500).json({ error: String(err) });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!API_KEY });
});

app.listen(PORT, () => {
  console.log(`🚀 Chat proxy running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints: /api/chat, /api/summarize, /health`);
});
