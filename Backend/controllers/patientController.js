import User from "../model/User.js";
import PatientGoal from "../model/patientGoals.js";
import Reminder from "../model/Reminder.js";

// --------------------------------------------------
// GET PROFILE
// --------------------------------------------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------
// UPDATE PROFILE
// --------------------------------------------------
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.json({
      message: "Profile updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------
// GET GOALS (daily)
// --------------------------------------------------
export const getGoals = async (req, res) => {
  try {
    const goals = await PatientGoal.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(1); // only latest entry

    res.json(goals[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------
// ADD/UPDATE GOALS
// --------------------------------------------------
export const postGoals = async (req, res) => {
  try {
    const { steps, sleep, activeTime, waterIntake } = req.body;

    const goal = await PatientGoal.create({
      userId: req.user._id,
      steps,
      sleep,
      activeTime,
      waterIntake,
    });

    res.json({
      message: "Goals updated",
      data: goal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------
// GET REMINDERS
// --------------------------------------------------
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).sort({
      reminderDate: 1,
    });

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------
// ADD REMINDER
// --------------------------------------------------
export const postReminder = async (req, res) => {
  try {
    const { title, description, reminderDate } = req.body;

    const reminder = await Reminder.create({
      userId: req.user._id,
      title,
      description,
      reminderDate,
    });

    res.json({
      message: "Reminder added",
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
