{/*import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';

//App config
const app = express()
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();

// middlewares
app.use(cors({
  origin: ['http://localhost:5173'],  // future-safe
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 
  credentials: true
}));
app.use(express.json());

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/cloudinary', cloudinaryRoutes);

app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(port, ()=> console.log('Server started on port: ' + port)); 
//-----------------------------------------------//
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Must be before all routes
app.use(cors({
  origin: 'http://localhost:5174',
   
  credentials: true,
}));

// Other middlewares
app.use(express.json());

// Connect DB and Cloudinary
connectDB();
connectCloudinary();

// ✅ API routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/cloudinary', cloudinaryRoutes);

// Test route
app.get('/', (req, res) => {
  res.send("API working");
});

app.listen(port, () => console.log(`Server started on port: ${port}`));  */}

//-----------------------------------------------//

{/*import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS Configuration - Allow multiple origins
app.use(cors({
  origin: [
    
    'http://localhost:5174'
      // Add any other ports you use
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'], // Add 'token' header
  credentials: true,
}));

// Handle preflight requests
app.options('*', cors());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.headers.token) {
    console.log('Token present in headers');
  }
  next();
});

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect DB and Cloudinary
connectDB();
connectCloudinary();

// API routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/cloudinary', cloudinaryRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: "API working", 
    timestamp: new Date().toISOString(),
    cors: "enabled"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(port, () => console.log(`Server started on port: ${port}`));*/}

import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

//App config
const app = express()
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(port, ()=> console.log('Server started on port: ' + port));