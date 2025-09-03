import express, { Router } from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar ,getMessage,sendMessage} from "../controllers/message.controller.js";
const router = express.Router();


router.get("/user",protectRoute,getUsersForSidebar)
router.get("/:id",protectRoute,getMessage)
router.post("/send/:id",protectRoute,sendMessage)

export default router