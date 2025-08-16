import express from 'express'
//import { addToCart } from '../controllers/productController.js'
import authUser from '../middleware/auth.js'
import { getUserCart, updateCart, addToCart } from '../controllers/cartController.js'

const cartRouter = express.Router()

// Debug middleware to see what's hitting the routes
cartRouter.use((req, res, next) => {
    console.log(`🛒 CART ROUTE: ${req.method} ${req.path}`);
    console.log('📋 Headers received:', req.headers);
    next();
});

cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, updateCart)

export default cartRouter;