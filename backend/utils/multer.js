import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     const uploadPath = path.join(__dirname, '../../uploads'); // Absolute path to 'uploads'
    //     cb(null, uploadPath);
    // },
    filename: function (req, file, cb) {
        const imageName = `${Date.now()}-${file.originalname}`;
        cb(null, imageName);
    }
});

const upload = multer({ storage });

export { upload };
