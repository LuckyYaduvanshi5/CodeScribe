const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const apiRoutes = require('./routes/api');

// Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CodeScribe API Server', 
    status: 'running',
    endpoints: {
      documentation: '/api/generate-documentation',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- API endpoint: http://localhost:${PORT}/api`);
  console.log(`- Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;