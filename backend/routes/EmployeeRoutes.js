const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authEmployee = require("../middleware/authEmployee");

const {
  loginEmployee,
  forgotPasswordEmployee,
  resetPasswordEmployee,
  applyLeave,
  getLoggedInEmployee,
  getMyLeaves,
  getMyProfile,
  updateMyProfile,
  uploadEmployeeProfilePicture,
  removeEmployeeProfilePicture,
} = require("../controllers/EmployeeController");

// ✅ Public Routes (no auth required)
router.post("/login", loginEmployee);
router.post("/forgot-password", forgotPasswordEmployee);
router.post("/reset-password/:token", resetPasswordEmployee);

// ✅ Protected Routes (require session login)
router.post("/apply-leave", authEmployee, applyLeave);
router.get("/me", authEmployee, getLoggedInEmployee);
router.get("/my-profile", authEmployee, getMyProfile);
router.put("/my-profile", authEmployee, updateMyProfile);
router.get("/my-leaves", authEmployee, getMyLeaves);

// ✅ Logout (session clear)
router.post("/logout", authEmployee, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// ✅ Profile Picture Upload/Remove
router.post(
  "/upload-profile-picture",
  authEmployee,
  upload.single("profileImage"),
  uploadEmployeeProfilePicture
);

router.delete(
  "/remove-profile-picture",
  authEmployee,
  removeEmployeeProfilePicture
);

module.exports = router;
