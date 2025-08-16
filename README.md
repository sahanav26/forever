# E-Commerce Website (MERN Stack)

## Description
This project is a complete e-commerce platform developed using the MERN (MongoDB, Express, React, Node.js) stack. It provides users with a seamless shopping experience, featuring authentication, product browsing, cart management, order placement, and secure payment options. The admin dashboard enables efficient store management, including product uploads, order tracking, and inventory control.

## Features
- **Frontend**:Built with Vite + React, featuring pages for Home, Collections, Product Details, Cart, Orders, Login, About, and Contact.
- **Backend**: Powered by Node.js and Express for APIs, authentication, and database operations.
- **Authentication**: Secure user and admin authentication using JWT.
- **Product Management**: Admins can upload, edit, and delete products from admin dashboard.
- **Cart & Order Management**: Users can manage their cart, place orders, and view order history.
- **Payment Integration**: Integrated with Stripe and Razorpay for secure transactions.
- **Image Uploads**: Efficient product image storage using Cloudinary and Multer.
- **Deployment**:Fully hosted on Vercel for easy accessibility.

## Project Structure
1. **Frontend**: React app with routing and UI components.
2. **Backend**: API development with Express and MongoDB.
3. **Authentication**:User registration, login, and admin validation.
4. **Product Features**:Product upload, display, and management.
5. **Cart & Orders**:Cart functionality and order tracking.
6. **Admin Dashboard**: Centralized control for products and orders.
7. **Payments**: Secure payment processing with Stripe and Razorpay
8. **Image Uploads**: Implemented using Cloudinary and Multer.
9. **Deployment**: Final hosting on Vercel.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mern-ecommerce.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mern-ecommerce
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   cd ../admin
   npm install
   ```
4. Start the development servers:
   ```bash
   cd frontend
   npm run dev
   ```
   ```bash
   cd backend
   npm run dev
   ```
   ```bash
   cd admin
   npm run start

## Tech Stack

**Frontend**: React, Redux, React Router

**Backend**: Node.js, Express, MongoDB

**Authentication**: JWT

**Payment**s: Stripe, Razorpay

**Image Storage**: Cloudinary, Multer

**Deployment**: Vercel

## Deployment Instructions

Push the project to GitHub.

Connect the repository to Vercel.

Deploy frontend and backend separately.

## License

This project is licensed under the MIT License.
