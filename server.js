/**
 * MNL-AI Premium Website Server
 * Express.js backend with enhanced features
 * Built by Tristan Trinidad
 */

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://images.unsplash.com", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mnl-ai.com', 'https://www.mnl-ai.com'] 
    : true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit contact form submissions
  message: {
    success: false,
    error: 'Too many contact form submissions. Please try again later.',
    code: 'CONTACT_LIMIT_EXCEEDED'
  }
});

app.use(limiter);
app.use('/contact', contactLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving with optimizations
app.use(express.static(path.join(__dirname), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Cache optimization based on file type
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    } else if (path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
    }
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  next();
});

/**
 * Routes
 */

// Main page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'FILE_SERVE_ERROR'
      });
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: process.memoryUsage(),
    pid: process.pid
  };
  
  res.status(200).json(healthCheck);
});

// Contact form handler with enhanced validation and logging
app.post('/contact', async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;
    
    // Enhanced validation
    const validationErrors = validateContactForm({ name, email, company, service, message });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors,
        code: 'VALIDATION_ERROR'
      });
    }

    // Sanitize input data
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      company: company ? sanitizeInput(company) : '',
      service: sanitizeInput(service),
      message: sanitizeInput(message),
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || ''
    };

    // Log the submission
    logContactSubmission(sanitizedData);
    
    // In production, you would:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Integrate with CRM (e.g., GoHighLevel)
    // 4. Send auto-response email
    // 5. Trigger automation workflows (n8n, Zapier)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock CRM integration
    await simulateCRMIntegration(sanitizedData);
    
    // Success response
    res.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      data: {
        submissionId: generateSubmissionId(),
        estimatedResponseTime: '2-24 hours'
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR'
    });
  }
});

// API endpoint for getting service information
app.get('/api/services', (req, res) => {
  const services = [
    {
      id: 'website',
      name: 'AI-Powered Websites',
      description: 'Professional websites that convert visitors into customers',
      startingPrice: 25000,
      currency: 'PHP',
      features: [
        'Mobile-first responsive design',
        'SEO optimization included',
        'Conversion tracking setup',
        'Performance monitoring'
      ]
    },
    {
      id: 'chatbot',
      name: 'Smart AI Chatbots',
      description: '24/7 customer service that captures leads automatically',
      startingPrice: 15000,
      currency: 'PHP',
      features: [
        'Custom conversation flows',
        'Lead qualification system',
        'Multi-platform integration',
        'Analytics & insights'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Assets',
      description: 'Professional graphics and branded content',
      startingPrice: 8000,
      currency: 'PHP',
      features: [
        'Brand identity design',
        'Social media templates',
        'Marketing materials',
        'Brand guidelines'
      ]
    },
    {
      id: 'automation',
      name: 'AI Workflow Automation',
      description: 'Custom automation systems for business processes',
      startingPrice: 12000,
      currency: 'PHP',
      features: [
        'Process automation',
        'Tool integrations',
        'Data synchronization',
        'Custom workflows'
      ]
    }
  ];
  
  res.json({
    success: true,
    data: services
  });
});

// Sitemap.xml route
app.get('/sitemap.xml', (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${req.protocol}://${req.get('host')}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${req.protocol}://${req.get('host')}/#about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${req.protocol}://${req.get('host')}/#services</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${req.protocol}://${req.get('host')}/#projects</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  res.set('Content-Type', 'text/xml');
  res.send(sitemap);
});

// Robots.txt route
app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /health

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`;

  res.set('Content-Type', 'text/plain');
  res.send(robots);
});

/**
 * Helper Functions
 */

function validateContactForm(data) {
  const errors = [];
  
  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }
  
  // Service validation
  const validServices = ['website', 'chatbot', 'marketing', 'automation', 'consultation'];
  if (!data.service || !validServices.includes(data.service)) {
    errors.push({ field: 'service', message: 'Please select a valid service' });
  }
  
  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
  }
  
  return errors;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove < and > characters
    .substring(0, 1000); // Limit length
}

function logContactSubmission(data) {
  console.log('\n=== NEW CONTACT FORM SUBMISSION ===');
  console.log(`Timestamp: ${data.timestamp}`);
  console.log(`Name: ${data.name}`);
  console.log(`Email: ${data.email}`);
  console.log(`Company: ${data.company || 'Not provided'}`);
  console.log(`Service Interest: ${data.service}`);
  console.log(`Message: ${data.message}`);
  console.log(`IP: ${data.ip}`);
  console.log(`User Agent: ${data.userAgent}`);
  console.log('=====================================\n');
  
  // In production, save to database or log file
  // You could also send this data to external services like:
  // - Google Sheets via API
  // - Slack webhook
  // - Email service (SendGrid, etc.)
  // - CRM system (GoHighLevel, HubSpot, etc.)
}

async function simulateCRMIntegration(data) {
  // This is where you'd integrate with your CRM
  // For example, GoHighLevel webhook:
  /*
  try {
    const crmResponse = await fetch('https://services.leadconnectorhq.com/hooks/webhook_url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        source: 'MNL-AI Website',
        tags: [data.service, 'website-lead'],
        customFields: {
          company: data.company,
          message: data.message,
          serviceInterest: data.service
        }
      })
    });
    
    console.log('CRM integration successful:', crmResponse.status);
  } catch (error) {
    console.error('CRM integration failed:', error);
  }
  */
  
  return Promise.resolve();
}

function generateSubmissionId() {
  return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Error Handlers
 */

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Page not found',
    message: 'The requested resource does not exist',
    code: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: isDevelopment ? err.message : 'Something went wrong on our end',
    code: 'INTERNAL_ERROR',
    ...(isDevelopment && { stack: err.stack })
  });
});

/**
 * Server Startup
 */

app.listen(PORT, () => {
  console.log(`
🚀 MNL-AI Website Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📧 Contact forms will be logged to console
🔒 Security headers enabled
⚡ Rate limiting active
⏱️  Started at: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;