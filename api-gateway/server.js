const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🎓 InternHub API Gateway is running!',
    services: {
      auth:    process.env.AUTH_SERVICE_URL,
      vacancy: process.env.VACANCY_SERVICE_URL,
      study:   process.env.STUDY_SERVICE_URL,
      quiz:    process.env.QUIZ_SERVICE_URL,
    }
  });
});

// Health check for all services
app.get('/health', (req, res) => {
  res.json({
    gateway: '✅ Running',
    port: process.env.PORT || 5000,
    services: {
      'auth-service':           `${process.env.AUTH_SERVICE_URL}/api/auth`,
      'vacancy-service':        `${process.env.VACANCY_SERVICE_URL}/api/vacancies`,
      'study-material-service': `${process.env.STUDY_SERVICE_URL}/api/materials`,
      'quiz-service':           `${process.env.QUIZ_SERVICE_URL}/api/quizzes`,
    }
  });
});

// ── Route Proxies ──────────────────────────────────────

// Auth Service → http://localhost:5001
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ message: 'Auth service unavailable' });
    }
  }
}));

// Vacancy Service → http://localhost:5002
app.use('/api/vacancies', createProxyMiddleware({
  target: process.env.VACANCY_SERVICE_URL,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(503).json({ message: 'Vacancy service unavailable' });
    }
  }
}));

app.use('/api/applications', createProxyMiddleware({
  target: process.env.VACANCY_SERVICE_URL,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(503).json({ message: 'Vacancy service unavailable' });
    }
  }
}));

// Study Material Service → http://localhost:5003
app.use('/api/materials', createProxyMiddleware({
  target: process.env.STUDY_SERVICE_URL,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(503).json({ message: 'Study material service unavailable' });
    }
  }
}));

// Quiz Service → http://localhost:5004
app.use('/api/quizzes', createProxyMiddleware({
  target: process.env.QUIZ_SERVICE_URL,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(503).json({ message: 'Quiz service unavailable' });
    }
  }
}));

// 404 handler
// 404 handler
app.use('*splat', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
🌐 API Gateway running on port ${PORT}
─────────────────────────────────────
📍 Routes:
  /api/auth       → Auth Service      (${process.env.AUTH_SERVICE_URL})
  /api/vacancies  → Vacancy Service   (${process.env.VACANCY_SERVICE_URL})
  /api/materials  → Study Service     (${process.env.STUDY_SERVICE_URL})
  /api/quizzes    → Quiz Service      (${process.env.QUIZ_SERVICE_URL})
─────────────────────────────────────
  `);
});