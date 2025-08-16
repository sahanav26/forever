

{/*import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

export default upload;*/}
//--------------------------------------------------------------------------------//
{/* import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, uploadDir);
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload; */}
//--------------------------------------------------------------------------------//
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads directory created successfully');
} else {
    console.log('Uploads directory already exists');
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        console.log('Multer destination called for file:', file.originalname);
        console.log('Saving to directory:', uploadDir);
        callback(null, uploadDir);
    },
    filename: function(req, file, callback) {
        const filename = Date.now() + '-' + file.originalname;
        console.log('Generated filename:', filename);
        callback(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    console.log('Multer fileFilter called for:', file.originalname, 'Type:', file.mimetype);
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        console.log('File accepted:', file.originalname);
        return cb(null, true);
    } else {
        console.log('File rejected:', file.originalname, 'Invalid type');
        cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 4 // Maximum 4 files
    }
});

// Middleware to log what multer processed
export const logMulterFiles = (req, res, next) => {
    console.log('=== AFTER MULTER PROCESSING ===');
    console.log('req.files:', req.files);
    console.log('req.body:', req.body);
    
    if (req.files) {
        Object.keys(req.files).forEach(key => {
            const files = req.files[key];
            console.log(`Field ${key}:`, files.map(f => ({
                originalname: f.originalname,
                filename: f.filename,
                path: f.path,
                size: f.size,
                exists: fs.existsSync(f.path) ? 'YES' : 'NO'
            })));
        });
    }
    next();
};

export default upload;