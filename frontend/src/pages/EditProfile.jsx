import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../services/api";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleUpdateProfile = async () => {
    try {
      const payload = {
        name,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      const { data } = await updateUserProfile(payload);

      // Update context with new name so navbar updates too
      login(data, token);
      toast.success("Profile updated successfully! ✅");
      setPasswordData({ currentPassword: "", newPassword: "" });
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="bg-[#FFF8F0] min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-t-4 border-[#E63946]">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-[#3A2E2E] mb-6">
          Edit Profile
        </h1>

        {/* Current Name shown */}
        <p className="text-sm text-gray-400 text-center mb-6">
          Editing profile for <span className="text-[#E63946] font-medium">{user?.email}</span>
        </p>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 mt-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          />
        </div>

        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter current password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
            className="w-full border border-gray-300 mt-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          />
        </div>

        {/* New Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            className="w-full border border-gray-300 mt-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdateProfile}
          className="w-full bg-[#E63946] text-white py-2 rounded-lg hover:bg-[#d62839] font-semibold transition"
        >
          Update Profile
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="mt-3 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-medium transition text-gray-600"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default EditProfile;