import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect DB + Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Allow multiple origins
const allowedOrigins = ['http://localhost:5173']; // add your frontend deployed URL here

// ✅ Stripe webhook BEFORE body-parser
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ✅ Root route (health check)
app.get('/', (req, res) => {
  res.send('🟢 Backend is running!');
});

// ✅ API routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
