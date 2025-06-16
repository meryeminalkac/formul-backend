require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Enhanced CORS
app.use(cors({
  origin: 'https://5beecffd.formul-deploy.pages.dev',
  methods: ['POST']
}));
app.use(express.json());
// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.status(200).send('Backend operational');
});

// Email endpoint
app.post('/send-form', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: 'meryeminalkac80@gmail.com',
      subject: 'New Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Server ready`);
});