{/*import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token){
            return res.json({success : false, message: "Not Authorized, Login Again"})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success : false, message: "Not Authorized, Login Again"})
        }
        next()
    }
    catch (error){
        console.log(error)
        res.json({ success: false, message: error.message})
    }
}

export default adminAuth*/}

{/*import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        
        // Check if token exists
        if (!token) {
            console.log('No token provided in headers');
            return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
        }

        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET not found in environment variables');
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', token_decode);
        
        // Check if decoded token matches admin credentials
        const expectedToken = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        if (token_decode !== expectedToken) {
            console.log('Token mismatch. Expected:', expectedToken, 'Got:', token_decode);
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }
        req.user = {
            role: 'admin',
            email: process.env.ADMIN_EMAIL,
            isAdmin: true
        };

        console.log('Admin authentication successful');
        next();
        
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({ success: false, message: error.message });
    }
};

export default adminAuth;*/}

import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        let token = req.headers.token;
        
        //if (token && token.startsWith('Bearer ')) {
           // token = token.slice(7);
        //} else if (req.headers.token) {
        //    token = req.headers.token;
        //}

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user is admin
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            console.log('ERROR: User is not admin. Role:', token_decode.role);
            return res.status(403).json({ success: false, message: "Not Authorized. Admin access required." });
        }
        
        req.body.userId = token_decode.id;
        req.user = { id: token_decode.id , email: token_decode.email,
            role: token_decode.role};
        
        console.log('✅ ADMIN AUTH SUCCESS');
        next();
    } catch (error) {
        console.log('❌ ADMIN AUTH ERROR:', error.message);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

export default authAdmin;