import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById } from "../services/api";
import toast from "react-hot-toast";

const RecipeDetail = () => {
  const { id } = useParams(); // gets the :id from the URL
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const { data } = await getRecipeById(id);
      setRecipe(data);
    } catch (err) {
      toast.error("Failed to load recipe.");
      navigate("/saved");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FFF8F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946]"></div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="bg-[#FFF8F0] min-h-screen p-6">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/saved")}
          className="mb-6 text-[#E63946] hover:underline flex items-center gap-2 font-medium"
        >
          ← Back to Saved Recipes
        </button>

        {/* Recipe Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-[#E63946]">

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#E63946] mb-3">{recipe.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6">
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
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#3A2E2E] mb-4">🛒 Ingredients</h2>
            <ul className="grid md:grid-cols-2 gap-2">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#E63946] font-bold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-semibold text-[#3A2E2E] mb-4">👨‍🍳 Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4 text-gray-700">
                  <span className="bg-[#E63946] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-sm text-gray-400 text-center">
            Generated on {new Date(recipe.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;