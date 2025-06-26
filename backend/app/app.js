import express, { urlencoded } from 'express';
import cors from 'cors';

import { upload } from '../utils/multer.js';
import cookieParser from 'cookie-parser';


// import { authMiddleware, verifyToken } from '../middleware/auth.middleware.js';
import {
  
  adminDeleteUser,
  adminLogin,
  adminProductEdit,
  adminViewController,
  authSignUpController,
  deleteProduct,
  getAllProduct,
  getProductWithId,
  loginController,
  resetPassword,
  updateProductClick,
  userForgetPassword,
  verifyOtp
} from '../controllers/user.controller.js';
import { tokenMiddleware } from '../middleware/auth.middleware.js';

const app = express();

// Middleware

app.use(cors({ origin: 'https://aesthetic-cat-f30d3d.netlify.app',credentials:true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(urlencoded({ extended: false }));


// Routes

// Auth Routes
app.post('/api/auth/signup', authSignUpController);
app.post('/api/auth/signin', loginController);
app.post('/api/auth/forgetpassword', userForgetPassword);
app.post('/api/auth/verifyotp', verifyOtp);
app.post('/api/auth/resetpassword/:id', resetPassword);


// Admin Routes
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/view/users', adminViewController);
app.delete('/api/admin/delete/user/:id', adminDeleteUser);

// ✅ Corrected: Use 'product_image' as multer field name


// ✅ If editing image too, make sure this is consistent
app.put('/api/product/edit/:id', upload.single('product_image'), adminProductEdit);

// Product Routes
app.get('/api/get/product', getAllProduct);
app.get('/api/get/product/:id', getProductWithId);
app.delete('/api/product/delete/:id', deleteProduct);
app.post('/api/update/product-click/:id', updateProductClick);


// Token check route
app.get('/checktoken', tokenMiddleware, (req, res) => {
  return res.status(200).json({ message: 'Token is valid', user: req.user });
});

export { app };
