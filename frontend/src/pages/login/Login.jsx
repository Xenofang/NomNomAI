import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await loginUser(formData);
      const { token, ...userData } = data;
      login(userData, token);
      toast.success(`Welcome back, ${userData.name}! 👋`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-[#3A2E2E]">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Login to access your saved recipes
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E63946] hover:bg-[#d62839] text-white py-2 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="grow h-px bg-gray-300"></div>
        </div>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#E63946] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
