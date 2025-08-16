{/*import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"

//global variables
const currency = "usd" // Set your desired currency here
const deliveryCharges = 10.00 // Set your desired delivery charges here

//GATEWAY INITIALIZATION
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address} = req.body
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: "Order Placed"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Placing orders using stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address} =req.body
    const {origin} = req.headers;
     const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }
    const newOrder = new orderModel(orderData)
    await newOrder.save()  
    
    const line_items = items.map((item) =>({
       price_data: {
           currency: currency,
           product_data: {
               name: item.name,
               images: [item.image],
           },
           unit_amount: item.price * 100,
       },
       quantity: item.quantity,
    }))

    line_items.push({
        price_data: {
            currency: currency,
            product_data: {
                name: "Delivery Charges",
            },
            unit_amount: deliveryCharges * 100,
        },
        quantity: 1 ,
    })

    const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items: line_items,
        mode: "payment",
    })

    res.json({success: true, session_url: session.url})
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

//verify payment using stripe
const verifyStripe = async (req, res) => {

    const {orderId , success,userId} = req.body;

    try{

         const userId = req.body.userId || req.user?.id;
        
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }

        if(success === 'true'){
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}});
            res.json({success: true, message: "Payment Successful"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: "Payment Failed"});
        }
    }
    catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// Placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {

}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try{
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// User order data for frontend
const userOrders = async (req, res) => {
    try{
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success: true, orders})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Update order status
const updateStatus = async (req, res) => {
    try{
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order Status Updated"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export { verifyStripe, placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, updateStatus, userOrders} */}

import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import razorpay from "razorpay"
import crypto from 'crypto'

//global variables
const currency = "usd" // Set your desired currency here
const deliveryCharges = 10.00 // Set your desired delivery charges here

//GATEWAY INITIALIZATION
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address} = req.body
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: "Order Placed"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Placing orders using stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address} = req.body
    const {origin} = req.headers;
    
     const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }
    const newOrder = new orderModel(orderData)
    await newOrder.save()  
    
    const line_items = items.map((item) =>({
       price_data: {
           currency: currency,
           product_data: {
               name: item.name,
               images: [item.image],
           },
           unit_amount: item.price * 100,
       },
       quantity: item.quantity,
    }))

    line_items.push({
        price_data: {
            currency: currency,
            product_data: {
                name: "Delivery Charges",
            },
            unit_amount: deliveryCharges * 100,
        },
        quantity: 1 ,
    })

    const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items: line_items,
        mode: "payment",
    })

    return res.status(200).json({
  success: true,
  url: session.url
});

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

//verify payment using stripe
const verifyStripe = async (req, res) => {
    try {
        const {orderId, success, userId} = req.body;
        
        console.log('Verify Stripe Request:', { orderId, success, userId }); // Debug log
        console.log('Request user from middleware:', req.user); // Debug log
        
        // Get userId from request body or middleware (req.user.id is set by auth middleware)
        const currentUserId = userId || req.user?.id;
        
        if (!currentUserId) {
            console.log('No userId found in request');
            return res.json({ success: false, message: "User not authenticated" });
        }

        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        if (success === 'true') {
            // Update order payment status
            const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {payment: true}, {new: true});
            
            if (!updatedOrder) {
                return res.json({ success: false, message: "Order not found" });
            }
            
            // Clear user's cart
            await userModel.findByIdAndUpdate(currentUserId, {cartData: {}});
            
            console.log('Payment successful for order:', orderId);
            res.json({success: true, message: "Payment Successful"});
        } else {
            // Delete the order if payment failed
            const deletedOrder = await orderModel.findByIdAndDelete(orderId);
            
            if (!deletedOrder) {
                return res.json({ success: false, message: "Order not found" });
            }
            
            console.log('Payment failed for order:', orderId);
            res.json({success: false, message: "Payment Failed"});
        }
    }
    catch (error) {
        console.log('Verify Stripe Error:', error);
        res.json({success: false, message: error.message});
    }
}

// Placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {
 try {

    const { userId, items, amount, address} = req.body
    
    
     const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }
    const newOrder = new orderModel(orderData)
    await newOrder.save()

    const options = {
        amount: amount * 100,  // Convert to paise
        currency: 'INR',
        receipt: newOrder._id.toString()
    }

    await razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
            console.error('Razorpay Order Creation Error:', error);
            return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
        }
        console.log('Razorpay Order Created:', order);
        res.json({ success: true, order });
    });

 } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
 }
}

const verifyRazorpay = async (req, res) => {
    console.log('🔍 verifyRazorpay function called');
    console.log('📨 Request body:', req.body);
    console.log('👤 User from middleware:', req.user);
    
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        // Check if all required fields are present
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            console.log('❌ Missing required fields');
            return res.json({ success: false, message: "Missing payment details" });
        }
        
        // Get userId from middleware
        const userId = req.user?.id;
        console.log('👤 User ID from middleware:', userId);
        
        if (!userId) {
            console.log('❌ User not authenticated');
            return res.json({ success: false, message: "User not authenticated" });
        }

        // Verify signature for security
        console.log('🔐 Verifying signature...');
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        console.log('🔍 Expected signature:', expectedSign);
        console.log('🔍 Received signature:', razorpay_signature);

        if (razorpay_signature !== expectedSign) {
            console.log('❌ Signature verification failed');
            return res.json({ success: false, message: "Invalid signature" });
        }

        console.log('✅ Signature verified successfully');

        // Fetch order info from Razorpay
        console.log('📞 Fetching order info from Razorpay...');
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        console.log('📋 Razorpay Order Info:', orderInfo);

        // Find the order in your database using the receipt (which is the MongoDB _id)
        console.log('🔍 Looking for order in database with ID:', orderInfo.receipt);
        const order = await orderModel.findById(orderInfo.receipt);
        
        if (!order) {
            console.log('❌ Order not found in database');
            return res.json({ success: false, message: "Order not found in database" });
        }

        console.log('📋 Found order in database:', order);

        // Update order payment status to true
        console.log('💾 Updating order payment status...');
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderInfo.receipt, 
            { 
                payment: true,
                paymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id
            },
            { new: true }
        );
        
        console.log('✅ Order updated:', updatedOrder);
        
        // Clear user's cart
        console.log('🛒 Clearing user cart...');
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        
        console.log('✅ Payment verification completed successfully');
        res.json({ success: true, message: "Payment Successful" });

    } catch (error) {
        console.error('🔥 verifyRazorpay Error:', error);
        res.json({ success: false, message: error.message });
    }
}
{/*const verifyRazorpay = async (req, res) => {
    try {
        const {userId , razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
           await orderModel.findByIdAndDelete(orderInfo.receipt);
           await userModel.findByIdAndUpdate(userId, {cartData: {}});
           res.json({success : true, message: "Payment Successful"})
    } 
        else {
            res.json({success: false, message: "Payment Failed"});
        }
    } catch (error) {
        console.log('Verify Razorpay Error:', error);
        res.json({success: false, message: error.message});
    }
} */}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try{
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// User order data for frontend
const userOrders = async (req, res) => {
    try{
        // Get userId from middleware or request body
        const userId = req.body.userId || req.user?.id;
        
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }
        
        const orders = await orderModel.find({userId})
        res.json({success: true, orders})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Update order status
const updateStatus = async (req, res) => {
    try{
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order Status Updated"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export { verifyStripe,verifyRazorpay, placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, updateStatus, userOrders }