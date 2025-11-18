import { Router } from "express";
import {
  registerUser,
  loginUser,

  editProfile,
  logoutUser,
  refreshAccessToken
  
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/edit-profile").post(authMiddleware,editProfile)



export default router;
