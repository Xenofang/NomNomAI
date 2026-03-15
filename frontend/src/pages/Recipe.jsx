import React, { useState, useEffect } from "react";
import { generateRecipe, getUserRecipes } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────
// RecipeResult Component
// ─────────────────────────────────────────────────────────────
const RecipeResult = ({ recipe }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-md border-t-4 border-[#E63946]">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#E63946] mb-2">
        {recipe.title}
      </h2>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-6">
        {recipe.cookingTime && (
          <span className="bg-orange-50 px-3 py-1 rounded-full">⏱ {recipe.cookingTime}</span>
        )}
        {recipe.servings && (
          <span className="bg-orange-50 px-3 py-1 rounded-full">🍽 Serves {recipe.servings}</span>
        )}
        {recipe.cuisine && recipe.cuisine !== "Any" && (
          <span className="bg-orange-50 px-3 py-1 rounded-full">🌍 {recipe.cuisine}</span>
        )}
        {recipe.diet && recipe.diet !== "Any" && (
          <span className="bg-orange-50 px-3 py-1 rounded-full">🥗 {recipe.diet}</span>
        )}
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-[#3A2E2E] mb-3">🛒 Ingredients</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.ingredients.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
              <span className="text-[#E63946] font-bold mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-[#3A2E2E] mb-3">👨‍🍳 Instructions</h3>
        <ol className="space-y-3">
          {recipe.instructions.map((step, i) => (
            <li key={i} className="flex gap-3 text-gray-700 text-sm">
              <span className="bg-[#E63946] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* View in Saved */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500 text-center">
        ✅ Recipe saved! View it in{" "}
        <Link to="/saved" className="text-[#E63946] font-medium hover:underline">
          Saved Recipes
        </Link>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Recipe Page
// ─────────────────────────────────────────────────────────────
const Recipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [cookingTimeFilter, setCookingTimeFilter] = useState("");
  const [language, setLanguage] = useState("en"); // ← language state inside component
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentRecipes, setRecentRecipes] = useState([]);

  const recommended = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  ];

  useEffect(() => {
    if (user) fetchRecentRecipes();
  }, [user]);

  const fetchRecentRecipes = async () => {
    try {
      const { data } = await getUserRecipes();
      setRecentRecipes(data.slice(0, 4));
    } catch (err) {
      console.error("Failed to fetch recent recipes");
    }
  };

  const checkAuth = () => {
    if (!user) {
      toast.error("Please login to generate recipes!");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleQuickGenerate = async () => {
  if (!checkAuth()) return;
  if (!prompt.trim()) return toast.error("Please enter what you'd like to eat!");
  setLoading(true);
  setRecipe(null);
  try {
    const { data } = await generateRecipe({ prompt, language });
    setRecipe(data);

    // Check if already in saved
    const alreadySaved = recentRecipes.some(
      (r) => r.title.toLowerCase() === data.title.toLowerCase()
    );
    if (data.alreadySaved) {
      toast("This recipe is already in your saved list! 📋", { icon: "⚠️" });
    } else {
      toast.success("Recipe generated and saved! 🍳");
    }

    fetchRecentRecipes();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to generate recipe.");
  } finally {
    setLoading(false);
  }
};

const handleDetailedGenerate = async () => {
  if (!checkAuth()) return;
  if (!ingredientInput.trim()) return toast.error("Please enter some ingredients!");
  setLoading(true);
  setRecipe(null);
  try {
    const { data } = await generateRecipe({
      ingredientInput,
      cuisine,
      diet,
      cookingTimeFilter,
      language,
    });
    setRecipe(data);

    // Check if already in saved
    const alreadySaved = recentRecipes.some(
      (r) => r.title.toLowerCase() === data.title.toLowerCase()
    );
    if (alreadySaved) {
      toast("This recipe is already in your saved list! 📋", { icon: "⚠️" });
    } else {
      toast.success("Recipe generated and saved! 🍳");
    }

    fetchRecentRecipes();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to generate recipe.");
  } finally {
    setLoading(false);
  }
};

  // Language dropdown — reused in both forms
  const LanguageSelect = () => (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm"
    >
      <option value="en">🌐 English</option>
      <option value="hi">Hindi</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="ar">Arabic</option>
      <option value="zh">Chinese</option>
      <option value="ja">Japanese</option>
      <option value="ko">Korean</option>
      <option value="de">German</option>
      <option value="pt">Portuguese</option>
      <option value="ru">Russian</option>
      <option value="it">Italian</option>
      <option value="bn">Bengali</option>
      <option value="tr">Turkish</option>
    </select>
  );




  return (
    <div className="bg-[#FFF8F0] min-h-screen p-4 sm:p-6">

      {/* Quick Prompt Section */}
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-[#3A2E2E] mb-4">
          What would you like to eat today?
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuickGenerate()}
            placeholder="e.g. Something spicy with chicken..."
            className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm sm:text-base"
          />
          <button
            onClick={handleQuickGenerate}
            disabled={loading}
            className="bg-[#E63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60 text-sm sm:text-base whitespace-nowrap"
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </button>
        </div>

        {/* Language selector for quick form */}
        <div className="mt-3">
          <LanguageSelect />
        </div>
      </div>

      {/* Detailed Form Section */}
      <div className="max-w-4xl mx-auto mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-[#3A2E2E] mb-4 sm:mb-6">
          Get a Recipe According to You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            placeholder="Ingredients (e.g. chicken, rice, garlic)"
            className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm"
          />
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm"
          >
            <option value="">Select Cuisine</option>
            <option>Indian</option>
            <option>Italian</option>
            <option>Chinese</option>
            <option>Mexican</option>
            <option>American</option>
            <option>Thai</option>
            <option>Japanese</option>
            <option>Korean</option>
          </select>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm"
          >
            <option value="">Select Diet</option>
            <option>Vegetarian</option>
            <option>Non-Vegetarian</option>
            <option>Vegan</option>
            <option>Keto</option>
            <option>High Protein</option>
            <option>Gluten Free</option>
          </select>
          <select
            value={cookingTimeFilter}
            onChange={(e) => setCookingTimeFilter(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] text-sm"
          >
            <option value="">Cooking Time (No Limit)</option>
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>45 minutes</option>
            <option>1 hour</option>
          </select>

          {/* Language selector spans full width */}
          <div className="sm:col-span-2">
            <LanguageSelect />
          </div>
        </div>

        <button
          onClick={handleDetailedGenerate}
          disabled={loading}
          className="mt-4 sm:mt-6 w-full bg-[#E63946] hover:bg-[#d62839] text-white py-3 rounded-lg font-semibold disabled:opacity-60 text-sm sm:text-base"
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium text-sm sm:text-base">
            AI is cooking your recipe... 🍳
          </p>
        </div>
      )}

      {/* Generated Recipe Result */}
      {recipe && !loading && <RecipeResult recipe={recipe} />}

      {/* Recent + Recommended Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-10">

        {/* Recent Recipes */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-[#3A2E2E] mb-4">
            Recent Recipes
          </h3>
          {recentRecipes.length === 0 ? (
            <p className="text-gray-400 text-sm">No recipes yet. Generate your first one!</p>
          ) : (
            <ul className="space-y-3">
              {recentRecipes.map((r) => (
                <li
                  key={r._id}
                  className="p-3 bg-[#FFF8F0] rounded-md text-gray-700 text-sm hover:bg-orange-100 transition"
                >
                  <Link to={`/saved/${r._id}`} className="flex items-center gap-2">
                    🍴 {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommended Images */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-[#3A2E2E] mb-4">
            Recommended Recipes
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recommended.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="recipe"
                className="w-32 sm:w-40 h-24 sm:h-28 object-cover rounded-lg shrink-0 hover:scale-105 transition"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;