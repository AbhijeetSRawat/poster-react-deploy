import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';
import dotenv from 'dotenv';
dotenv.config({});

// AuthMiddleware to validate token for protected routes
// const authMiddleware = async (req, res, next) => {
//     try {
//         const token = req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Authentication token required",
//             });
//         }

//         const decoded = jwt.verify(token,secretJwtKey);  // Use correct secret
//         console.log('Decoded Token:', decoded);  // Check the decoded token for expiry

//         const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid Token or User not found",
//             });
//         }

//         req.user = user;
//         req.token = token;
//         next();
//     } catch (error) {
//         console.error('Token verification failed:', error.message);  // Log error
//         res.status(401).json({
//             success: false,
//             message: "Unauthorized access - Invalid or expired token",
//         });
//     }
// };


// // Authenticate middleware to validate token and cookie for logged-in users
// const authenticate = async (req, res, next) => {
//     try {
//         // Check for token in both header and cookies
//         const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Authentication token required',
//             });
//         }

//         const decoded = jwt.verify(token, secretJwtKey); // secretKey from env
//         const user = await User.findById(decoded._id);

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not found',
//             });
//         }

//         req.user = user;
//         req.token = token; // Token ko req object me set kar rahe hain
//         next();
//     } catch (error) {
//         console.error('Authentication Error:', error);
//         return res.status(401).json({
//             success: false,
//             message: 'Authentication failed',
//         });
//     }
// };

// // Verify Token in Backend
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer <token>

//     if (!token) {
//         return res.status(403).json({ message: 'No token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, secretJwtKey);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         if (err instanceof jwt.TokenExpiredError) {
//             return res.status(401).json({ message: 'Token expired' });
//         }
//         res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };



const tokenMiddleware = (req, res, next) => {
   const token =
		req.header("Authorization").replace("Bearer ", "") ;
        
    if (!token) {
        return res.status(403).json({ message: 'Token required' });
    }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
     
       
        req.user = decode;
        next(); 
    
};

// export { authMiddleware, verifyToken };
export {tokenMiddleware}
