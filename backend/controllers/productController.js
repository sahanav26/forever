{/*import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
  }); */}
  

// function for add product
{/*const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // ✅ Check if files exist
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.json({ success: false, message: "At least one image is required" });
        }

        // ✅ Extract images safely
        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // ✅ Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                    folder: 'ecommerce_products' // Optional: organize uploads in a folder
                });
                return result.secure_url;
            })
        );

        // ✅ Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true : false,
            images: imagesUrl,
            date: Date.now(),
        };

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();
        
        res.json({ success: true, message: "Product Added Successfully" });

    } catch (error) {
        console.log("Error in addProduct:", error);
        res.json({ success: false, message: error.message });
    }
} */}

{/*const addProduct = async (req, res) => {
    try {
        console.log('=== ADD PRODUCT REQUEST STARTED ===');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // ✅ Check if files exist
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No files uploaded');
            return res.json({ success: false, message: "At least one image is required" });
        }

        console.log('Files received:', Object.keys(req.files));

        // ✅ Extract images safely
        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        console.log('Images to upload:', images.length);

        // ✅ Upload images to Cloudinary
        console.log('Starting Cloudinary upload...');
        let imagesUrl = await Promise.all(
            images.map(async (item, index) => {
                console.log(`Uploading image ${index + 1}:`, item.path);
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                    folder: 'ecommerce_products'
                });
                console.log(`Image ${index + 1} uploaded:`, result.secure_url);
                return result.secure_url;
            })
        );

        console.log('All images uploaded:', imagesUrl);

        // ✅ Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true : false,
            images: imagesUrl,
            date: Date.now(),
        };

        console.log('Product data to save:', productData);

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();
        
        console.log('Product saved successfully');
        res.json({ success: true, message: "Product Added Successfully" });

    } catch (error) {
        console.error("=== ERROR IN ADD PRODUCT ===");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ success: false, message: error.message });
    }
}


// function for list product
const listProducts = async (req, res) => {
    try{
        const products = await productModel.find({});
        res.json({success:true, products})
    }
    catch (error){
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product removed"})
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    }
    catch (error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }*/}

//---------------------------------------------------------------------------//

import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Enhanced function for add product with debugging
const addProduct = async (req, res) => {
    try {
        console.log('=== ADD PRODUCT REQUEST STARTED ===');
        console.log('Request method:', req.method);
        console.log('Request URL:', req.url);
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        console.log('User info:', req.user);
        
        // Check authentication first
        if (!req.user) {
            console.log('ERROR: No user found in request');
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (req.user.role !== 'admin') {
            console.log('ERROR: User is not admin. Role:', req.user.role);
            return res.status(403).json({ success: false, message: "Access denied. Admin role required." });
        }

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category) {
            console.log('ERROR: Missing required fields');
            return res.json({ 
                success: false, 
                message: "Missing required fields: name, description, price, category",
                received: { name, description, price, category }
            });
        }

        console.log('Cloudinary config check:');
        console.log('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME ? 'Set' : 'Missing');
        console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
        console.log('CLOUDINARY_SECRET_KEY:', process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Missing');

        // ✅ Check if files exist
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No files uploaded');
            return res.status(400).json({ success: false, message: "At least one image is required" });
        }

        console.log('Files received:', Object.keys(req.files));
        console.log('File details:', JSON.stringify(req.files, null, 2));

        // ✅ Extract images safely
         const image1 = req.files.image1 ? req.files.image1[0] : undefined;
        const image2 = req.files.image2 ? req.files.image2[0] : undefined;
        const image3 = req.files.image3 ? req.files.image3[0] : undefined;
        const image4 = req.files.image4 ? req.files.image4[0] : undefined;

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        console.log('Images to upload:', images.length);
        
        // Log each image details
        images.forEach((img, index) => {
            console.log(`Image ${index + 1} details:`, {
                originalname: img.originalname,
                mimetype: img.mimetype,
                size: img.size,
                path: img.path
            });
        });

        // ✅ Upload images to Cloudinary
        console.log('Starting Cloudinary upload...');
        let imagesUrl = await Promise.all(
            images.map(async (item, index) => {
                try {
                    console.log(`Uploading image ${index + 1}:`, item.path);
                    let result = await cloudinary.uploader.upload(item.path, {
                        resource_type: 'image',
                        folder: 'ecommerce_products'
                    });
                    console.log(`Image ${index + 1} uploaded successfully:`, result.secure_url);
                    return result.secure_url;
                } catch (uploadError) {
                    console.log(`Error uploading image ${index + 1}:`, uploadError);
                    throw uploadError;
                }
            })
        );

        console.log('All images uploaded:', imagesUrl);

        // Parse sizes safely
        let parsedSizes = [];
        try {
            parsedSizes = sizes ? JSON.parse(sizes) : [];
            console.log('Parsed sizes:', parsedSizes);
        } catch (sizeError) {
            console.log('Error parsing sizes:', sizeError);
            parsedSizes = [];
        }

        // ✅ Create product data object
        const productData = {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            subCategory: subCategory ? subCategory.trim() : '',
            sizes: parsedSizes,
            bestseller: bestseller === "true" || bestseller === true,
            images: imagesUrl,
            date: Date.now(),
        };

        console.log('Product data to save:', JSON.stringify(productData, null, 2));

        // ✅ Save product in DB
        console.log('Creating new product instance...');
        const product = new productModel(productData);
        
        console.log('Saving product to database...');
        const savedProduct = await product.save();
        
        console.log('Product saved successfully with ID:', savedProduct._id);
        console.log('=== ADD PRODUCT COMPLETED SUCCESSFULLY ===');
        
        res.json({ success: true, message: "Product Added Successfully", productId: savedProduct._id });

    } catch (error) {
        console.error("=== ERROR IN ADD PRODUCT ===");
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            console.error("Validation errors:", error.errors);
            return res.status(400).json({ 
                success: false, 
                message: "Validation error", 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            console.error("Duplicate key error:", error.keyValue);
            return res.status(400).json({ 
                success: false, 
                message: "Product with this name already exists"
            });
        }

        // Cloudinary specific errors
        if (error.message && error.message.includes('cloudinary')) {
            console.error("Cloudinary error detected");
            return res.status(500).json({ 
                success: false, 
                message: "Image upload failed. Please try again."
            });
        }

        console.error("=== END ERROR DETAILS ===");
        res.status(500).json({ success: false, message: error.message });
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        console.log('Fetching all products...');
        const products = await productModel.find({});
        console.log(`Found ${products.length} products`);
        res.json({success: true, products})
    }
    catch (error) {
        console.log('Error in listProducts:', error);
        res.json({success: false, message: error.message})
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
        console.log('Removing product with ID:', req.body.id);
        
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        await productModel.findByIdAndDelete(req.body.id);
        console.log('Product removed successfully');
        res.json({ success: true, message: "Product removed"})
    }
    catch (error) {
        console.log('Error in removeProduct:', error);
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        console.log('Fetching single product with ID:', req.body.productId);
        const { productId } = req.body
        const product = await productModel.findById(productId)
        console.log('Product found:', product ? 'Yes' : 'No');
        res.json({success: true, product})
    }
    catch (error) {
        console.log('Error in singleProduct:', error);
        res.json({success: false, message: error.message})
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }