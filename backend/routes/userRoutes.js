
import express from "express"
const router = express.Router();

import { getUserDetails } from "../controllers/getUserDetails.js";
import { tokenMiddleware } from "../middleware/auth.middleware.js";
import { subscribe } from "../controllers/subsciption.js";
import { createPayment, verifyPayment } from "../controllers/payments.js";
import { findReferal } from "../controllers/findReferal.js";
import { createReferal } from "../controllers/createReferal.js";
import { requestOtpController } from "../controllers/requestOtpController.js";
import { verifyOtpController } from "../controllers/verifyOtpContrroller.js";
import { profile } from "../controllers/profile.js";
import { downloadWithLogo } from "../controllers/downloadWithLogo.js";
import { upload } from "../utils/multer.js";


router.post('/request-otp', requestOtpController);
router.post('/verify-otp', verifyOtpController);
router.post('/profile',upload.single('logo'), tokenMiddleware,profile)


router.get("/getUserDetails",tokenMiddleware,getUserDetails);
router.post("/subscription",tokenMiddleware,subscribe);
router.post("/createPayment",tokenMiddleware,createPayment)
router.post("/verifyPayment",tokenMiddleware,verifyPayment)
router.post("/createReferal",createReferal)
router.post("/findReferal",findReferal)
router.get("/downloadWithLogo", downloadWithLogo);

export const userRoutes = router;