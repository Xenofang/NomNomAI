import React, { useState, useEffect } from "react";
import { getUserRecipes, deleteRecipe, deleteAllRecipes } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DeleteIcon from "../components/DeleteIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faLink } from "@fortawesome/free-solid-svg-icons";

// ─────────────────────────────────────────────────────────────
// RecipeCard Component
// ─────────────────────────────────────────────────────────────
const RecipeCard = ({ recipe, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-[#3A2E2E]">
            {recipe.title}
          </h3>
          <div className="flex gap-3 text-xs text-gray-500 mt-1">
            {recipe.cookingTime && <span>⏱ {recipe.cookingTime}</span>}
            {recipe.servings && <span>🍽 Serves {recipe.servings}</span>}
            {recipe.cuisine && recipe.cuisine !== "Any" && (
              <span>🌍 {recipe.cuisine}</span>
            )}
            {recipe.diet && recipe.diet !== "Any" && (
              <span>🥗 {recipe.diet}</span>
            )}
          </div>
        </div>
        <button onClick={() => onDelete(recipe._id)}>
          <DeleteIcon />
        </button>
      </div>

      {/* View Recipe Button */}
      <button
        onClick={() => navigate(`/saved/${recipe._id}`)}
        className="w-full text-left px-4 pb-3 text-sm text-[#E63946] font-medium hover:underline flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faEye} />
        View Recipe
      </button>

      {/* Recipe Video Button */}
      <button
        onClick={() => toast("Recipe video is not available currently. 🎬")}
        className="w-full text-left px-4 pb-3 text-sm text-[#E63946] font-medium hover:underline flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faLink} />
        Recipe Video
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Saved Page Component
// ─────────────────────────────────────────────────────────────
const Saved = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view saved recipes!");
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
      toast.error("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Recipe deleted!");
    } catch (err) {
      toast.error("Failed to delete recipe.");
    }
  };

  const handleDeleteAll = async () => {
    // Ask for confirmation before deleting all
    if (!window.confirm("Are you sure you want to delete ALL recipes? This cannot be undone!")) return;
    try {
      await deleteAllRecipes();
      setRecipes([]);
      toast.success("All recipes deleted!");
    } catch (err) {
      toast.error("Failed to delete all recipes.");
    }
  };

  // Filter recipes based on search
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#FFF8F0] min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold text-[#3A2E2E] mb-2 text-center">
        Your Saved Recipes
      </h1>
      <p className="text-center text-gray-500 mb-8">
        {recipes.length > 0
          ? `You have ${recipes.length} saved recipe${recipes.length > 1 ? "s" : ""}`
          : "No recipes yet"}
      </p>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946]"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-6xl mb-4">🍽</p>
          <p className="text-gray-500 text-lg">No recipes saved yet.</p>
          <button
            onClick={() => navigate("/recipe")}
            className="mt-6 bg-[#E63946] text-white px-6 py-3 rounded-xl hover:bg-[#d62839] transition"
          >
            Generate Your First Recipe
          </button>
        </div>
      )}

      {/* Search Box + Delete All Button */}
      {!loading && recipes.length > 0 && (
        <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search your recipes..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white shadow-sm"
          />
          <button
            onClick={handleDeleteAll}
            className="bg-[#F4A261] hover:bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap"
          >
            🗑 Delete All
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!loading && filteredRecipes.length === 0 && recipes.length > 0 && (
        <div className="text-center mt-10">
          <p className="text-gray-400 text-lg">
            No recipes found for "
            <span className="text-[#E63946]">{search}</span>"
          </p>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && filteredRecipes.length > 0 && (
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;