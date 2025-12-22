// Minimal Express proxy for Gemini API calls (CommonJS)
// Usage: set GEMINI_API_KEY in environment and run `node server/chat-proxy.cjs`

// load .env from project root if present
try { require('dotenv').config(); } catch (e) { /* ignore */ }
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('GEMINI_API_KEY not set. The proxy will return 500 for requests.');
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: 'GEMINI API key missing on server' });
    const { messages } = req.body;
    // Basic request to Google's Gemini REST endpoint (example)
    const body = {
      input: messages.map(m => ({ role: m.role, content: m.content })).join('\n'),
      // Model selection and other params may vary
    };

    const response = await fetch('https://api.generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ prompt: body.input })
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => `status ${response.status}`);
      console.error('Gemini responded with non-OK:', response.status, txt);
      return res.status(502).json({ error: `Upstream error: ${txt}` });
    }

    const json = await response.json();
    const reply = json?.candidates?.[0]?.content || json?.output_text || JSON.stringify(json);
    res.json({ reply });
  } catch (err) {
    console.error('chat proxy error', err);
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: 'GEMINI API key missing on server' });
    const { text } = req.body;
    const prompt = `Summarize the following content in plain language for a non-technical user:\n\n${text}`;
    const response = await fetch('https://api.generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => `status ${response.status}`);
      console.error('Gemini summarize responded non-OK:', response.status, txt);
      return res.status(502).json({ error: `Upstream error: ${txt}` });
    }

    const json = await response.json();
    const summary = json?.candidates?.[0]?.content || json?.output_text || '';
    res.json({ summary });
  } catch (err) {
    console.error('summarize proxy error', err);
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Chat proxy running on http://localhost:${PORT}`);
});
