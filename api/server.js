/**
 * Pascal Travels & Tours — Serverless API Handler for Vercel
 * 
 * This is the entry point for Vercel Functions.
 * It wraps the Express server to work as a serverless function.
 */

'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configuration and store
const config = {
  nodeEnv: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000,
  pesalinkProvider: process.env.PESALINK_PROVIDER || 'none',
  wuMode: process.env.WU_MODE || 'mock',
  dbEnabled: process.env.DB_ENABLED === 'true',
  allowedOrigins: ['localhost', 'vercel.app', 'pascaltours.com', '*']
};

// In-memory store for serverless (data resets per invocation)
const store = {
  jobs: [],
  visaApplications: [],
  quickApplications: [],
  agents: [],
  referralCodes: [],
  payments: [],
  bookings: [],
  
  async createJob(job) {
    this.jobs.push(job);
    return job;
  },
  async getJobs(filter = {}) {
    return this.jobs.filter(job => {
      if (filter.country) return job.country === filter.country;
      return true;
    });
  }
};

// Create Express app
const app = express();

/* ---- Security middleware ---- */
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

/* ---- CORS ---- */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ---- Logging ---- */
app.use(morgan('dev'));

/* ---- JSON body parsing ---- */
app.use(express.json({ limit: '1mb' }));

/* ---- HEALTH CHECK ---- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: 'vercel', time: new Date().toISOString() });
});

/* ---- JOBS API ---- */
app.get('/api/jobs', (req, res) => {
  const country = req.query.country;
  const jobs = country 
    ? store.jobs.filter(j => j.country === country)
    : store.jobs;
  res.json({ jobs });
});

app.post('/api/jobs', (req, res) => {
  const { title, country, description } = req.body;
  if (!title || !country) {
    return res.status(400).json({ error: 'Missing title or country' });
  }
  const job = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    country,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  store.jobs.push(job);
  res.status(201).json({ job });
});

/* ---- VISA APPLICATIONS ---- */
app.get('/api/visa-applications', (req, res) => {
  res.json({ applications: store.visaApplications });
});

app.post('/api/visa-applications', (req, res) => {
  const { fullName, email, phone, nationality, passportNumber, destinationCountry, visaType } = req.body;
  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const application = {
    id: Math.random().toString(36).substr(2, 9),
    fullName,
    email,
    phone,
    nationality: nationality || '',
    passportNumber: passportNumber || '',
    destinationCountry: destinationCountry || '',
    visaType: visaType || '',
    status: 'RECEIVED',
    createdAt: new Date().toISOString()
  };
  store.visaApplications.push(application);
  res.status(201).json({ application });
});

/* ---- QUICK APPLICATIONS ---- */
app.get('/api/quick-applications', (req, res) => {
  res.json({ applications: store.quickApplications });
});

app.post('/api/quick-applications', (req, res) => {
  const { name, email, countryInterest, message } = req.body;
  if (!name || !email || !countryInterest) {
    return res.status(400).json({ error: 'Missing required fields: name, email, countryInterest' });
  }
  const application = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    countryInterest,
    message: message || '',
    status: 'RECEIVED',
    createdAt: new Date().toISOString()
  };
  store.quickApplications.push(application);
  res.status(201).json({ application });
});

/* ---- AGENTS ---- */
app.get('/api/agents', (req, res) => {
  res.json({ agents: store.agents });
});

app.post('/api/agents/register', (req, res) => {
  const { agencyName, registrationNumber, contactPersonName, contactPersonEmail, phone, countryOperation, password } = req.body;
  const required = ['agencyName', 'registrationNumber', 'contactPersonName', 'contactPersonEmail', 'phone', 'countryOperation', 'password'];
  for (const field of required) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }
  const agent = {
    id: Math.random().toString(36).substr(2, 9),
    agencyName,
    registrationNumber,
    contactPersonName,
    contactPersonEmail,
    phone,
    countryOperation,
    status: 'PENDING',
    approved: false,
    createdAt: new Date().toISOString()
  };
  store.agents.push(agent);
  res.status(201).json({ message: 'Agent registered successfully', agent });
});

/* ---- PAYMENTS/BOOKINGS ---- */
app.post('/api/payments/bookings', (req, res) => {
  const { packageId, packageTitle, applicantName, email, phone, amount, currency } = req.body;
  if (!packageId || !applicantName || !email || !phone || !amount) {
    return res.status(400).json({ error: 'Missing required fields: packageId, applicantName, email, phone, amount' });
  }
  const booking = {
    id: Math.random().toString(36).substr(2, 9),
    bookingRef: 'TT-' + Math.floor(100000 + Math.random() * 900000),
    packageId,
    packageTitle: packageTitle || '',
    applicantName,
    email,
    phone,
    amountCurrency: currency || 'KES',
    amountTotal: Number(amount),
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  store.bookings.push(booking);
  res.status(201).json({ booking });
});

/* ---- REFERRALS ---- */
app.post('/api/referrals/generate', (req, res) => {
  const { agentId, commissionRate } = req.body;
  const code = 'PASCAL-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  const referral = {
    id: Math.random().toString(36).substr(2, 9),
    code,
    agentId: agentId || '',
    commissionRate: commissionRate || 0,
    createdAt: new Date().toISOString()
  };
  store.referralCodes.push(referral);
  res.status(201).json({ code: referral });
});

app.get('/api/referrals/stats', (req, res) => {
  const agentId = req.query.agentId;
  const stats = {
    agentId,
    totalCodes: store.referralCodes.filter(r => r.agentId === agentId).length,
    totalEarnings: 0
  };
  res.json(stats);
});

/* ---- APPLICATION TRACKING ---- */
app.get('/api/track-application', (req, res) => {
  const { id, email } = req.query;
  const q = String(id || email || '').toLowerCase();
  
  if (!q) {
    return res.status(400).json({ error: 'ID or email required' });
  }
  
  const searches = [
    ...store.visaApplications,
    ...store.quickApplications,
    ...store.bookings
  ];
  
  const found = searches.find(item => {
    const itemId = String(item.id || '').toLowerCase();
    const itemEmail = String(item.email || '').toLowerCase();
    return itemId === q || itemEmail === q;
  });
  
  if (!found) {
    return res.status(404).json({ found: false, message: 'Application not found' });
  }
  
  res.json({ found: true, application: found });
});

/* ---- 404 Handler ---- */
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/* ---- Error Handler ---- */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
module.exports = app;
