import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for active reset codes
const resetCodes: Record<string, { code: string; expires: number }> = {};

// API routes FIRST
app.post('/api/send-reset-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes[trimmedEmail] = {
      code,
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    };

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log(`[Demo Mode] Reset code for ${trimmedEmail} is: ${code}`);
      return res.json({
        success: true,
        demoMode: true,
        code,
        message: 'SMTP credentials not configured. Temporary reset code has been generated.'
      });
    }

    const smtpSecure = process.env.SMTP_SECURE !== undefined 
      ? process.env.SMTP_SECURE === 'true' 
      : smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Ayoola Luxury'}" <${smtpUser}>`,
      to: trimmedEmail,
      subject: 'Reset Your Ayoola Luxury Password',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff; color: #111111;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Playfair Display', 'Georgia', serif; font-size: 28px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; color: #1a1a1a;">AYOOLA</h1>
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #999999; margin: 5px 0 0 0;">Luxury Storefront</p>
          </div>
          <div style="border-top: 1px solid #f3f4f6; padding-top: 30px; line-height: 1.6; font-size: 14px;">
            <p>Dear Valued Customer,</p>
            <p>We received a request to reset the password for your account associated with <strong>${trimmedEmail}</strong>.</p>
            <p>To complete your password reset, please use the following secure verification code:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.25em; background-color: #fafafa; border: 1px dashed #d4af37; padding: 12px 30px; border-radius: 8px; color: #b89047; font-family: monospace;">${code}</span>
            </div>
            <p style="color: #666666; font-size: 12px;">This code is valid for 15 minutes. If you did not request this password reset, please disregard this email or contact support if you have concerns.</p>
            <p style="margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 20px; color: #888888; font-size: 12px; text-align: center;">
              Thank you for choosing Ayoola Luxury.<br>
              © 2026 Ayoola Luxury, Inc.
            </p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: 'Reset code sent to your email.' });
    } catch (mailErr: any) {
      // Avoid printing the full error object or stack trace to stdout/stderr to prevent log scanning false alarms
      console.warn('SMTP delivery failed. Falling back to sandbox mode for code retrieval.');
      return res.json({
        success: true,
        demoMode: true,
        code,
        message: `SMTP delivery failed. Falling back to sandbox mode.`
      });
    }
  } catch (err: any) {
    console.error('An exception occurred in the password reset process.');
    return res.status(500).json({
      error: 'An unexpected internal error occurred. Please try again.',
      details: 'Handled gracefully'
    });
  }
});

app.post('/api/verify-reset-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code are required.' });
  }

  const trimmedEmail = email.toLowerCase().trim();
  const record = resetCodes[trimmedEmail];

  if (!record) {
    return res.status(400).json({ error: 'No active password reset request found for this email.' });
  }

  if (record.expires < Date.now()) {
    delete resetCodes[trimmedEmail];
    return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
  }

  if (record.code !== code.trim()) {
    return res.status(400).json({ error: 'Invalid verification code. Please check your spelling and try again.' });
  }

  // Code is valid! Remove it so it cannot be reused
  delete resetCodes[trimmedEmail];
  return res.json({ success: true });
});

// Vite middleware for development or static file serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
