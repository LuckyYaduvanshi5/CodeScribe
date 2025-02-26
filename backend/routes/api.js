const express = require('express');
const router = express.Router();
const documentationController = require('../controllers/documentationController');

// Documentation generation route
router.post('/generate-documentation', documentationController.generateDocumentation);

// API health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

module.exports = router;