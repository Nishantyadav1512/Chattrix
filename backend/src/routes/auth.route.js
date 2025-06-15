import express from "express";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

// Route to handle user signup
router.post("/signup", signup);

// Route to handle user login
router.post("/login", login);

// Route to handle user logout
router.post("/logout", logout);

router.put("/update-profile",protectRoute ,updateProfile);

router.get("/check",protectRoute, checkAuth)

export default router;
