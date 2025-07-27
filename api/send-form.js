import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      subject: 'Yeni Form Başvurusu',
      text: `Ad: ${name}\nEmail: ${email}\nMesaj: ${message}`
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    return res.status(500).json({ error: error.message });
  }
}
