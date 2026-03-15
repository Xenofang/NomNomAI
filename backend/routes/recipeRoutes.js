const express = require("express");
const router = express.Router();
const {
  generateRecipe,
  getUserRecipes,
  getRecipeById,
  deleteRecipe,
  deleteAllRecipes
} = require("../controllers/recipeController");
const protect = require("../middleware/authMiddleware");

// @route   POST /api/recipes/generate
router.post("/generate", protect, generateRecipe);

// @route   GET /api/recipes
router.get("/", protect, getUserRecipes);

// @route   GET /api/recipes/:id
router.get("/:id", protect, getRecipeById);

// @route   DELETE /api/recipes/all
router.delete("/all", protect, deleteAllRecipes);

// @route   DELETE /api/recipes/:id
router.delete("/:id", protect, deleteRecipe);


module.exports = router;