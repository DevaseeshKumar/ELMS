import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import EmployeeNavbar from "../components/EmployeeNavbar";
import Footer from "../components/Footer";
import { useEmployeeSession } from "../hooks/useEmployeeSession";
import Avatar from "../components/Avatar";

const EmployeeProfile = () => {
  const { employee, loading } = useEmployeeSession();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { token } = useParams(); // used if reset password via email link

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    department: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newPassword, setNewPassword] = useState(""); // for reset password flow

  // 🔹 Fetch employee profile
  useEffect(() => {
    if (!employee && !loading) navigate("/employee/login");
    if (employee) {
      setProfile(employee);
      setFormData({
        username: employee.username || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
      });
    }
  }, [employee, loading, navigate]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Update profile info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/employee/update-profile/${employee._id}`, formData);
      toast.success("Profile updated successfully!");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile!");
    }
  };

  // 🔹 Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      await axios.post(`/api/employee/change-password/${employee._id}`, {
        oldPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password!");
    }
  };

  // 🔹 Upload new profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`/api/employee/upload-image/${employee._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile picture updated!");
      setProfile({ ...profile, image: res.data.image });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image!");
    }
  };

  // 🔹 Remove profile image
  const handleRemoveImage = async () => {
    try {
      await axios.delete(`/api/employee/remove-image/${employee._id}`);
      toast.success("Profile picture removed!");
      setProfile({ ...profile, image: null });
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove image!");
    }
  };

  // 🔹 Reset password (token-based via email)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Enter a new password");
    try {
      await axios.post(`/api/employee/reset-password/${token}`, { newPassword });
      toast.success("Password reset successful!");
      setNewPassword("");
      navigate("/employee/login");
    } catch (err) {
      console.error(err);
      toast.error("Invalid or expired reset link!");
    }
  };

  if (loading || !profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EmployeeNavbar />
      <ToastContainer position="top-center" />
      <div className="flex flex-col items-center mt-10 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
          <div className="flex flex-col items-center">
            <Avatar src={profile.image} alt="Employee" size={100} />
            <button
              onClick={() => fileInputRef.current.click()}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Upload Image
            </button>
            <button
              onClick={handleRemoveImage}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Remove Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* Profile Info Update */}
          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Update Profile</h2>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Department"
              className="w-full border p-2 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Save Changes
            </button>
          </form>

          {/* Password Change */}
          <form onSubmit={handlePasswordChange} className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-gray-700">Change Password</h2>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              placeholder="Old Password"
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="New Password"
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              placeholder="Confirm New Password"
              className="w-full border p-2 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Change Password
            </button>
          </form>

          {/* Reset Password (via token link) */}
          {token && (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-3">
              <h2 className="text-xl font-semibold text-gray-700">Reset Password</h2>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                className="w-full border p-2 rounded-lg"
              />
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeProfile;
