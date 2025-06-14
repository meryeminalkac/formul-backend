require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: ['https://formul-deploy-5.onrender.com'], // 🛠️ REPLACE with your actual frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: '*',
};

app.use(cors(corsOptions));
// <- handles all OPTIONS preflight

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Form Submission Route
app.post('/send-form', async (req, res) => {
  const { name, phone, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: 'meryeminalkac80@gmail.com', // Change this to your real email
    subject: 'New Quote Request from Website',
    text: `
      Name: ${name}
      Phone: ${phone}
      Email: ${email}
      Message: ${message}
    `,
  };
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Form sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Form submission failed' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});

