const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  registerHR,
  loginHR,
  forgotPasswordHR,
  resetPasswordHR,
  logoutHR,
  getHRProfile,
  updateHRProfile,
  getHRLeaveRequests,
  handleHRLeave,
  hrgetAllEmployees,
  uploadHRProfilePicture,
  removeHRProfilePicture,
} = require("../controllers/HrController");

const checkHRSession = require("../middleware/checkHRSession");

// ✅ Public routes (no session required)
router.post("/register", registerHR);
router.post("/login", loginHR);
router.post("/forgot-password", forgotPasswordHR);
router.post("/reset-password/:token", resetPasswordHR); // must stay public
router.post("/logout", logoutHR);

// ✅ Protected HR routes (require session)
router.get("/profile", checkHRSession, getHRProfile);
router.put("/profile", checkHRSession, updateHRProfile);
router.get("/leaves", checkHRSession, getHRLeaveRequests);
router.put("/leaves/:leaveId", checkHRSession, handleHRLeave);
router.get("/hr-employees", checkHRSession, hrgetAllEmployees);

router.post(
  "/upload-profile-picture",
  checkHRSession,
  upload.single("profileImage"),
  uploadHRProfilePicture
);
router.delete(
  "/remove-profile-picture",
  checkHRSession,
  removeHRProfilePicture
);

module.exports = router;
