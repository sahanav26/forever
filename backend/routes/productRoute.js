{/*import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([{name:'image1', maxCount:1}, {name:'image2', maxCount:1}, {name:'image3', maxCount:1}, {name:'image4', maxCount:1}]), addProduct);
productRouter.get('/list', listProducts);
productRouter.post('/single', singleProduct);
productRouter.post('/remove', adminAuth, removeProduct);

export default productRouter; */}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload ,{ logMulterFiles }from '../middleware/multer.js';

const productRouter = express.Router();

// Debug middleware
productRouter.use((req, res, next) => {
     console.log(`\n=== PRODUCT ROUTE HIT ===`);
    console.log(`Product Route Hit: ${req.method} ${req.originalUrl}`);
    console.log('Request headers:', req.headers);
    next();
});

// Add product - with file upload and admin auth
productRouter.post('/add', 
    (req, res, next) => {
        console.log('Step 1: Before adminAuth');
        next();
    },
    adminAuth,
     (req, res, next) => {
        console.log('Step 2: After adminAuth, before multer');
        console.log('User authenticated:', req.user ? 'YES' : 'NO');
        next();
    }, // Check admin first
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]), // Handle multiple file uploads
    (req, res, next) => {
        console.log('Step 3: After multer, before logging');
         next();
    },
    logMulterFiles,
    (req, res, next) => {
        console.log('Step 4: After multer, before addProduct');
        console.log('Files uploaded:', req.files);
        next();
    },
    addProduct
);

// Debug route to test file upload without full processing
productRouter.post('/test-upload', 
    adminAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    logMulterFiles,
    (req, res) => {
        console.log('=== TEST UPLOAD ROUTE ===');
        
        res.json({
            success: true,
            message: 'Files uploaded successfully to multer',
            filesReceived: req.files ? Object.keys(req.files).length : 0,
            body: req.body
        });
    }
);

// List products
productRouter.get('/list', listProducts);

// Remove product
productRouter.post('/remove', adminAuth, removeProduct);

// Single product
productRouter.post('/single', singleProduct);

// Test route
productRouter.get('/test', (req, res) => {
    console.log('Product test route hit');
    res.json({ 
        success: true, 
        message: 'Product routes are working',
        timestamp: new Date().toISOString()
    });
});

productRouter.post('/test-upload', 
    adminAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    logMulterFiles,
    (req, res) => {
        console.log('=== TEST UPLOAD ROUTE ===');
        
        res.json({
            success: true,
            message: 'Files uploaded successfully to multer',
            filesReceived: req.files ? Object.keys(req.files).length : 0,
            body: req.body
        });
    }
);

export default productRouter; 

