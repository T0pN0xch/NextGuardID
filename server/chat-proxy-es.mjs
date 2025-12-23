// Minimal Express proxy for Gemini API calls
// Usage: set GEMINI_API_KEY in environment and run `node server/chat-proxy-es.mjs`

import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';
const PINATA_JWT = process.env.VITE_WEB3_STORAGE_TOKEN;

// Blockchain config
const CONTRACT_ADDRESS = "0xb81988826bA44D5657309690b79a1137786cEb3d";
const RPC_URL = "https://rpc-amoy.polygon.technology/";
const IDENTITY_AUDIT_ABI = [
  "event IdentityUsed(bytes32 indexed userHash, string platformId, string actionType, uint256 timestamp, string ipfsHash)",
  "event ConsentGranted(bytes32 indexed userHash, string platformId, uint256 timestamp, string ipfsHash)",
  "event ConsentRevoked(bytes32 indexed userHash, string platformId, uint256 timestamp, string ipfsHash)",
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, IDENTITY_AUDIT_ABI, provider);

if (!API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set. The proxy will return 500 for requests.');
} else {
  console.log('✅ GEMINI_API_KEY loaded successfully');
}

if (!PINATA_JWT) {
  console.warn('⚠️  VITE_WEB3_STORAGE_TOKEN not set. IPFS fetch will fail.');
} else {
  console.log('✅ PINATA_JWT loaded successfully');
}

// =====================
// BLOCKCHAIN QUERY UTILS
// =====================

function hashMyKad(mykadNumber) {
  return ethers.keccak256(ethers.toUtf8Bytes(mykadNumber));
}

async function fetchFromIPFS(cid) {
  if (!PINATA_JWT) {
    console.warn('⚠️  No Pinata JWT token for fetching IPFS data');
    return null;
  }

  try {
    // Try fetching from Pinata gateway
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`, {
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });

    if (response.ok) {
      return await response.json();
    }
    
    // Fallback to public gateway
    const fallback = await fetch(`https://cloudflare-ipfs.com/ipfs/${cid}`);
    if (fallback.ok) {
      return await fallback.json();
    }

    return null;
  } catch (err) {
    console.error('❌ Error fetching from IPFS:', err.message);
    return null;
  }
}

async function getUserIdentityHistory(mykadNumber) {
  try {
    const userHash = hashMyKad(mykadNumber);
    const events = [];

    console.log(`📋 Querying blockchain for user: ${userHash.substring(0, 10)}...`);

    // Get current block to limit query range (last 10000 blocks ~= last 1-2 days on Polygon)
    let fromBlock = 0;
    try {
      const currentBlock = await provider.getBlockNumber();
      fromBlock = Math.max(0, currentBlock - 100000); // Query last 100k blocks (reasonable limit)
      console.log(`📦 Current block: ${currentBlock}, querying from block ${fromBlock}`);
    } catch (err) {
      console.warn('⚠️  Could not get current block, querying from genesis');
    }

    // Query all events related to this user with timeout
    let identityUsedEvents = [];
    let consentGrantedEvents = [];
    let consentRevokedEvents = [];

    try {
      // Set a timeout for blockchain queries (10 seconds)
      const queryTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Blockchain query timeout')), 10000)
      );

      identityUsedEvents = await Promise.race([
        contract.queryFilter(
          contract.filters.IdentityUsed(userHash),
          fromBlock,
          'latest'
        ),
        queryTimeout
      ]);
    } catch (err) {
      console.warn('⚠️  IdentityUsed query failed, using empty list:', err.message);
    }

    try {
      const queryTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Blockchain query timeout')), 10000)
      );

      consentGrantedEvents = await Promise.race([
        contract.queryFilter(
          contract.filters.ConsentGranted(userHash),
          fromBlock,
          'latest'
        ),
        queryTimeout
      ]);
    } catch (err) {
      console.warn('⚠️  ConsentGranted query failed, using empty list:', err.message);
    }

    try {
      const queryTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Blockchain query timeout')), 10000)
      );

      consentRevokedEvents = await Promise.race([
        contract.queryFilter(
          contract.filters.ConsentRevoked(userHash),
          fromBlock,
          'latest'
        ),
        queryTimeout
      ]);
    } catch (err) {
      console.warn('⚠️  ConsentRevoked query failed, using empty list:', err.message);
    }

    // Process IdentityUsed events
    for (const event of identityUsedEvents) {
      const [userHash, platformId, actionType, timestamp, ipfsHash] = event.args;
      let metadata = null;
      
      if (ipfsHash && ipfsHash !== '' && ipfsHash.startsWith('Qm')) {
        metadata = await fetchFromIPFS(ipfsHash);
      }

      events.push({
        type: 'IDENTITY_USED',
        platformId,
        actionType,
        timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
        ipfsHash,
        metadata,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      });
    }

    // Process ConsentGranted events
    for (const event of consentGrantedEvents) {
      const [userHash, platformId, timestamp, ipfsHash] = event.args;
      let metadata = null;
      
      if (ipfsHash && ipfsHash !== '' && ipfsHash.startsWith('Qm')) {
        metadata = await fetchFromIPFS(ipfsHash);
      }

      events.push({
        type: 'CONSENT_GRANTED',
        platformId,
        timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
        ipfsHash,
        metadata,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      });
    }

    // Process ConsentRevoked events
    for (const event of consentRevokedEvents) {
      const [userHash, platformId, timestamp, ipfsHash] = event.args;
      let metadata = null;
      
      if (ipfsHash && ipfsHash !== '' && ipfsHash.startsWith('Qm')) {
        metadata = await fetchFromIPFS(ipfsHash);
      }

      events.push({
        type: 'CONSENT_REVOKED',
        platformId,
        timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
        ipfsHash,
        metadata,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      });
    }

    // Sort by timestamp (most recent first)
    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return events;
  } catch (err) {
    console.error('❌ Error querying blockchain history:', err.message);
    throw err;
  }
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

// =====================
// AUDIT TRAIL ENDPOINTS
// =====================

// GET /api/audit/history/:mykadNumber
// Returns complete identity audit trail from blockchain
app.get('/api/audit/history/:mykadNumber', async (req, res) => {
  try {
    const { mykadNumber } = req.params;
    
    if (!mykadNumber) {
      return res.status(400).json({ error: 'MyKad number required' });
    }

    console.log(`📋 Fetching audit history for MyKad: ${mykadNumber.substring(0, 4)}****`);
    const history = await getUserIdentityHistory(mykadNumber);

    res.json({
      success: true,
      mykadNumber: mykadNumber.substring(0, 6) + '****', // Partially masked
      totalRecords: history.length,
      records: history,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ /api/audit/history error:', err.message);
    res.status(500).json({ 
      error: 'Failed to fetch audit history', 
      details: err.message 
    });
  }
});

// GET /api/audit/consent/:mykadNumber
// Returns only consent-related events
app.get('/api/audit/consent/:mykadNumber', async (req, res) => {
  try {
    const { mykadNumber } = req.params;
    
    if (!mykadNumber) {
      return res.status(400).json({ error: 'MyKad number required' });
    }

    const history = await getUserIdentityHistory(mykadNumber);
    const consentRecords = history.filter(r => 
      r.type === 'CONSENT_GRANTED' || r.type === 'CONSENT_REVOKED'
    );

    res.json({
      success: true,
      mykadNumber: mykadNumber.substring(0, 6) + '****',
      totalConsentRecords: consentRecords.length,
      records: consentRecords,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ /api/audit/consent error:', err.message);
    res.status(500).json({ 
      error: 'Failed to fetch consent records', 
      details: err.message 
    });
  }
});

// GET /api/audit/ipfs/:cid
// Fetch metadata from IPFS
app.get('/api/audit/ipfs/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    
    if (!cid || !cid.startsWith('Qm')) {
      return res.status(400).json({ error: 'Valid IPFS CID required' });
    }

    console.log(`📦 Fetching IPFS metadata: ${cid}`);
    const metadata = await fetchFromIPFS(cid);

    if (!metadata) {
      return res.status(404).json({ error: 'IPFS content not found', cid });
    }

    res.json({
      success: true,
      cid,
      metadata,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ /api/audit/ipfs error:', err.message);
    res.status(500).json({ 
      error: 'Failed to fetch IPFS metadata', 
      details: err.message 
    });
  }
});

// POST /api/audit/export
// Export complete audit trail as JSON
app.post('/api/audit/export', async (req, res) => {
  try {
    const { mykadNumber } = req.body;
    
    if (!mykadNumber) {
      return res.status(400).json({ error: 'MyKad number required' });
    }

    console.log(`📊 Exporting audit trail for MyKad: ${mykadNumber.substring(0, 4)}****`);
    const history = await getUserIdentityHistory(mykadNumber);

    const exportData = {
      exportedAt: new Date().toISOString(),
      mykadNumber: mykadNumber.substring(0, 6) + '****',
      totalRecords: history.length,
      auditTrail: history,
      summary: {
        identityUsed: history.filter(r => r.type === 'IDENTITY_USED').length,
        consentGranted: history.filter(r => r.type === 'CONSENT_GRANTED').length,
        consentRevoked: history.filter(r => r.type === 'CONSENT_REVOKED').length
      }
    };

    // Set headers for download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=identity-audit-trail.json');
    
    res.json(exportData);
  } catch (err) {
    console.error('❌ /api/audit/export error:', err.message);
    res.status(500).json({ 
      error: 'Failed to export audit trail', 
      details: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Chat proxy running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   /api/chat`);
  console.log(`   /api/summarize`);
  console.log(`   /api/audit/history/:mykadNumber`);
  console.log(`   /api/audit/consent/:mykadNumber`);
  console.log(`   /api/audit/ipfs/:cid`);
  console.log(`   /api/audit/export`);
  console.log(`   /health`);
});
