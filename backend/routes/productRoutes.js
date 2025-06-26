
import express from "express"

import { showProductWithDate } from "../controllers/displayByDate.js"
import { generateWithPrompt } from "../controllers/displayWithAPrompt.js";
import { adminAddProduct } from "../controllers/user.controller.js";
import { upload } from "../utils/multer.js";
import { displayAllPictures } from "../controllers/displayAllPictures.js";
import { displayPicturesByCategories } from "../controllers/displayPicturesByCategories.js";
const router = express.Router();

router.get("/displayByDate",showProductWithDate);
router.get("/displayByPrompt",generateWithPrompt);
router.get("/getAllProducts",displayAllPictures);
router.get("/displayPicturesByCategory",displayPicturesByCategories);
router.post('/api/admin/add/product', upload.single('product_image'), adminAddProduct);

 //router.post('/api/admin/add/product', adminAddProduct);

export const productRoutes = router;