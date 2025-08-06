/**
 * MNL-AI Premium Website Server - Simplified Version
 * Express.js backend with core features only
 * Built by Tristan Trinidad
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use(express.static(path.join(__dirname), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
});

/**
 * Routes
 */

// Main page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0'
  });
});

// Contact form handler
app.post('/contact', (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (name, email, message)'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Log the submission
    console.log('\n=== NEW CONTACT FORM SUBMISSION ===');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Company: ${company || 'Not provided'}`);
    console.log(`Service: ${service || 'Not specified'}`);
    console.log(`Message: ${message}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('=====================================\n');

    // Success response
    res.json({
      success: true,
      message: 'Thank you! We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.'
    });
  }
});

// API endpoint for services
app.get('/api/services', (req, res) => {
  const services = [
    {
      id: 'website',
      name: 'AI-Powered Websites',
      startingPrice: 25000,
      currency: 'PHP'
    },
    {
      id: 'chatbot',
      name: 'Smart AI Chatbots',
      startingPrice: 15000,
      currency: 'PHP'
    },
    {
      id: 'marketing',
      name: 'Marketing Assets',
      startingPrice: 8000,
      currency: 'PHP'
    },
    {
      id: 'automation',
      name: 'AI Workflow Automation',
      startingPrice: 12000,
      currency: 'PHP'
    }
  ];
  
  res.json({ success: true, data: services });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Page not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MNL-AI Website running on port ${PORT}`);
  console.log(`📧 Contact form submissions logged to console`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
