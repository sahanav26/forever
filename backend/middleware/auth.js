{/*import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    // Fix: Get token and authorization from headers properly
    const token = req.headers.token;
    const authorization = req.headers.authorization;

     let authToken;
    
    // Support both header formats
    if (authorization && authorization.startsWith('Bearer ')) {
        authToken = authorization.substring(7);
    } else if (token) {
        authToken = token;
    }
    
    if (!authToken) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }
    
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again'})
    }
    try{
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId= token_decoded.id
        next()
    }
    catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser; */}

// auth.js middleware - Update your existing middleware to handle both header formats
{/*import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        // Get token from Authorization header or token header
        let token = req.headers.authorization;
        
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7); // Remove 'Bearer ' prefix
        } else if (req.headers.token) {
            token = req.headers.token; // Fallback to old format
        }

        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request object
        req.body.userId = token_decode.id;
        req.user = { id: token_decode.id }; // Add this for consistency
        
        console.log('Auth middleware - User ID:', token_decode.id); // Debug log
        
        next();
    } catch (error) {
        console.log('Auth middleware error:', error);
        return res.json({ success: false, message: "Token Invalid" });
    }
};

export default authUser; */}

// auth.js middleware - Simplified version without expiration checks
{/*import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        // Get token from Authorization header or token header
        let token = req.headers.authorization;
        
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7); // Remove 'Bearer ' prefix
        } else if (req.headers.token) {
            token = req.headers.token; // Fallback to old format
        }

        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        // Verify token (since there's no expiration, this will only fail if token is invalid)
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request object
        req.body.userId = token_decode.id;
        req.user = { id: token_decode.id };
        
        next();
    } catch (error) {
        console.log('Auth middleware error:', error);
        return res.json({ success: false, message: "Invalid Token" });
    }
};

export default authUser; */}


// auth.js middleware - Debug version to see what's happening
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    console.log('🔍 AUTH MIDDLEWARE DEBUG');
    console.log('📋 All headers:', JSON.stringify(req.headers, null, 2));
    console.log('🎯 Authorization header:', req.headers.authorization);
    console.log('🔑 Token header:', req.headers.token);
    console.log('📝 Request body:', req.body);
    
    try {
        // Get token from Authorization header or token header
        let token = req.headers.authorization;
        
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7); // Remove 'Bearer ' prefix
            console.log('✅ Using Bearer token format');
        } else if (req.headers.token) {
            token = req.headers.token; // Fallback to old format
            console.log('✅ Using token header format');
        } else {
            console.log('❌ No token found in any format');
        }

        console.log('🔐 Final token to verify:', token ? `${token.substring(0, 20)}...` : 'null');

        if (!token) {
            console.log('❌ AUTH FAILED: No token provided');
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        // Check JWT_SECRET
        console.log('🔒 JWT_SECRET exists:', !!process.env.JWT_SECRET);

        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded successfully:', token_decode);
        
        // Add user info to request object
        req.body.userId = token_decode.id;
        req.user = { id: token_decode.id };
        
        console.log('👤 User ID set to:', token_decode.id);
        console.log('🏁 AUTH SUCCESS - Proceeding to next middleware');
        
        next();
    } catch (error) {
        console.log('💥 AUTH MIDDLEWARE ERROR:');
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
        console.log('Full error:', error);
        
        return res.status(403).json({ success: false, message: "Token Invalid" });
    }
};

export default authUser;