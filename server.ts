import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReviews,
  createReview,
  deleteReview,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminActivities,
  createAdminActivity,
  clearAdminActivities
} from './src/db/queries.ts';

import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS
} from './src/data/products.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for active reset codes
const resetCodes: Record<string, { code: string; expires: number }> = {};

// In-memory global setting for pay on delivery
let payOnDeliveryEnabled = true;

// --- DATABASE SEED FUNCTION ---
async function seedDatabase() {
  try {
    console.log('Checking database seed status...');
    const dbCats = await getCategories();
    if (dbCats.length === 0) {
      console.log('Seeding categories...');
      for (const cat of INITIAL_CATEGORIES) {
        await createCategory(cat);
      }
      console.log('Categories seeded successfully.');
    }

    const dbProds = await getProducts();
    if (dbProds.length === 0) {
      console.log('Seeding products...');
      for (const prod of INITIAL_PRODUCTS) {
        await createProduct(prod);
      }
      console.log('Products seeded successfully.');
    }

    const dbCoupons = await getCoupons();
    if (dbCoupons.length === 0) {
      console.log('Seeding coupons...');
      for (const coupon of INITIAL_COUPONS) {
        await createCoupon(coupon);
      }
      console.log('Coupons seeded successfully.');
    }

    const dbReviews = await getReviews();
    if (dbReviews.length === 0) {
      console.log('Seeding reviews...');
      for (const rev of INITIAL_REVIEWS) {
        await createReview(rev);
      }
      console.log('Reviews seeded successfully.');
    }

    const dbUsers = await getUsers();
    if (dbUsers.length === 0) {
      console.log('Seeding registered users...');
      const initialUsers = [
        { id: 'usr_admin', uid: 'admin-uid', email: 'admin@ayoola.com', name: 'Ayoola Admin', isAdmin: true, isSuperAdmin: false },
        { id: 'usr_super', uid: 'super-uid', email: 'ibnrosheed9@gmail.com', name: 'Ibrahim Rosheed', isAdmin: true, isSuperAdmin: true },
        { id: 'usr_cust1', uid: 'customer1-uid', email: 'customer1@gmail.com', name: 'John Doe', isAdmin: false, isSuperAdmin: false },
        { id: 'usr_cust2', uid: 'customer2-uid', email: 'customer2@gmail.com', name: 'Sarah Connor', isAdmin: false, isSuperAdmin: false }
      ];
      for (const u of initialUsers) {
        await createUser(u);
      }
      console.log('Registered users seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// --- DATABASE API ROUTES ---

// 1. Categories
app.get('/api/categories', async (req, res) => {
  try {
    const cats = await getCategories();
    res.json(cats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const cat = await createCategory(req.body);
    res.status(201).json(cat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const cat = await updateCategory(req.params.id, req.body);
    res.json(cat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const cat = await deleteCategory(req.params.id);
    res.json(cat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Products
app.get('/api/products', async (req, res) => {
  try {
    const prods = await getProducts();
    res.json(prods);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const prod = await createProduct(req.body);
    res.status(201).json(prod);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const prod = await updateProduct(req.params.id, req.body);
    res.json(prod);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const prod = await deleteProduct(req.params.id);
    res.json(prod);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const revs = await getReviews();
    res.json(revs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const rev = await createReview(req.body);
    res.status(201).json(rev);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const rev = await deleteReview(req.params.id);
    res.json(rev);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Coupons
app.get('/api/coupons', async (req, res) => {
  try {
    const coups = await getCoupons();
    res.json(coups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/coupons', async (req, res) => {
  try {
    const coup = await createCoupon(req.body);
    res.status(201).json(coup);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/coupons/:id', async (req, res) => {
  try {
    const coup = await updateCoupon(req.params.id, req.body);
    res.json(coup);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/coupons/:id', async (req, res) => {
  try {
    const coup = await deleteCoupon(req.params.id);
    res.json(coup);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Orders
app.get('/api/orders', async (req, res) => {
  try {
    const ords = await getOrders();
    res.json(ords);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const ord = await createOrder(req.body);
    res.status(201).json(ord);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const ord = await updateOrderStatus(req.params.id, req.body.status);
    res.json(ord);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const ord = await deleteOrder(req.params.id);
    res.json(ord);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Users
app.get('/api/users', async (req, res) => {
  try {
    const registered = await getUsers();
    res.json(registered);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:email', async (req, res) => {
  try {
    const user = await updateUser(req.params.email, req.body);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:email', async (req, res) => {
  try {
    const user = await deleteUser(req.params.email);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Admin Activities
app.get('/api/admin-activities', async (req, res) => {
  try {
    const acts = await getAdminActivities();
    res.json(acts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin-activities', async (req, res) => {
  try {
    const act = await createAdminActivity(req.body);
    res.status(201).json(act);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin-activities', async (req, res) => {
  try {
    await clearAdminActivities();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Settings for POD
app.get('/api/settings/pod', (req, res) => {
  res.json({ enabled: payOnDeliveryEnabled });
});

app.post('/api/settings/pod', (req, res) => {
  if (req.body && typeof req.body.enabled === 'boolean') {
    payOnDeliveryEnabled = req.body.enabled;
  }
  res.json({ enabled: payOnDeliveryEnabled });
});


// --- EMAIL RESET ENDPOINTS (PRESERVED) ---
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
  await seedDatabase();

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
