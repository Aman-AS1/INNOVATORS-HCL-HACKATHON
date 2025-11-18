import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin
} from "../controllers/admin.controller.js";
import { adminAuthMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(adminAuthMiddleware, logoutAdmin);

export default router;
