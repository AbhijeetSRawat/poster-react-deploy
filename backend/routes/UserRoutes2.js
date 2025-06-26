
import express from "express"
import { getAllUsers } from "../controllers/getAllUsers.js";


const router = express.Router();

router.get("/getAllUsers",getAllUsers)

export const userRoutes2 = router;