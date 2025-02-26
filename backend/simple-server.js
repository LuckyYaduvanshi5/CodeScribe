const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Configure middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Simple documentation endpoint
app.post('/api/generate-doc', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const API_KEY = 'AIzaSyDGI2I1xUaJvJJ5rjoQLtfPC3v5pTCQaig'; // Replace with your key
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    console.log(`Processing ${language} code, length: ${code.length}`);
    
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [{
          parts: [{ 
            text: `Generate documentation for this ${language} code:\n\n${code}` 
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]) {
      return res.json({ documentation: response.data.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: 'Invalid API response structure' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate documentation',
      details: error.response?.data || error.message
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`- Access test page at http://localhost:${PORT}/direct-test.html`);
  console.log(`- API endpoint at http://localhost:${PORT}/api/generate-doc`);
});
