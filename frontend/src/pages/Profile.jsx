import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserRecipes } from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchRecipes();
  }, [user]);

  const fetchRecipes = async () => {
    try {
      const { data } = await getUserRecipes();
      setRecipes(data);
    } catch (err) {
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FFF8F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E63946]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen px-4 sm:px-6 md:px-8 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center border-t-4 border-[#E63946] transition-all">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E63946] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold mx-auto mb-4 shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Name & Email */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#3A2E2E]">
            {user.name}
          </h1>

          <p className="text-gray-500 text-sm sm:text-base mt-1 break-all">
            {user.email}
          </p>

          <button
            onClick={() => navigate("/edit-profile")}
            className="mt-3 w-full bg-[#F4A261] text-white py-2 rounded-lg hover:bg-orange-400 transition"
          >
            Edit Profile
          </button>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-[#FFF8F0] rounded-xl p-5 hover:shadow-md transition">
              <p className="text-3xl font-bold text-[#E63946]">
                {recipes.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Recipes Generated</p>
            </div>

            <div className="bg-[#FFF8F0] rounded-xl p-5 hover:shadow-md transition">
              <p className="text-lg sm:text-xl font-bold text-[#E63946]">
                {recipes.length > 0
                  ? new Date(
                      recipes[recipes.length - 1].createdAt,
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Latest Recipe</p>
            </div>
          </div>

          {/* Recent Recipes */}
          {recipes.length > 0 && (
            <div className="mt-8 text-left">
              <h2 className="text-lg font-semibold text-[#3A2E2E] mb-3">
                Recent Recipes
              </h2>

              <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {recipes.slice(0, 5).map((r) => (
                  <li
                    key={r._id}
                    onClick={() => navigate(`/saved/${r._id}`)}
                    className="p-3 bg-[#FFF8F0] rounded-lg text-gray-700 text-sm cursor-pointer hover:bg-orange-100 hover:scale-[1.02] transition flex justify-between items-center"
                  >
                    <span className="font-medium truncate">🍴 {r.title}</span>

                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/saved")}
              className="flex-1 bg-[#E63946] hover:bg-[#d62839] text-white py-2.5 rounded-lg font-semibold transition transform hover:scale-[1.02]"
            >
              View Saved Recipes
            </button>

            <button
              onClick={() => navigate("/recipe")}
              className="flex-1 bg-[#F4A261] hover:bg-orange-400 text-white py-2.5 rounded-lg font-semibold transition transform hover:scale-[1.02]"
            >
              Generate Recipe
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 w-full border border-red-300 text-red-500 hover:bg-red-50 py-2.5 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
