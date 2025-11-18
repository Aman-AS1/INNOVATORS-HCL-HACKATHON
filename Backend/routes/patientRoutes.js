import express from "express";
import {
  getProfile,
  updateProfile,
  getGoals,
  postGoals,
  getReminders,
  postReminder,
} from "../controllers/patientController.js";

//import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in patients allowed
// router.use(protect);
// router.use(restrictTo("patient"));

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

router.get("/goals", getGoals);
router.post("/goals", postGoals);

router.get("/reminders", getReminders);
router.post("/reminders", postReminder);

export default router;
