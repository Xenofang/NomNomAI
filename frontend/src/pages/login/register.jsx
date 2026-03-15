import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      // Step 1 — Register the user
      await registerUser(formData);

      // Step 2 — Auto login right after registration
      const { data } = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Step 3 — Save to context + localStorage (so navbar shows name)
      const { token, ...userData } = data;
      login(userData, token);

      // Step 4 — Toast + redirect to home
      toast.success(`Welcome, ${userData.name}! 🎉`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-[#3A2E2E]">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Start generating delicious recipes
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E63946] hover:bg-[#d62839] text-white py-2 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="grow h-px bg-gray-300"></div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition"
            onClick={()=>{}}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="google" className="w-5" />
            
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="facebook" className="w-5" />
            Continue with Facebook
          </button>
          <button className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition">
            <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="apple" className="w-5" />
            Continue with Apple
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#E63946] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;