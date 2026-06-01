const express = require("express");
const limiter = require("express-rate-limit");
const router = express.Router();
const {
  generateRecipe,
  getUserRecipes,
  getRecipeById,
  deleteRecipe,
  deleteAllRecipes
} = require("../controllers/recipeController");
const protect = require("../middleware/authMiddleware");

const recipeLimiter = limiter({
  windowMs: 15 * 60 * 1000,     
  max: 100, // limit each IP to 100 recipe generations per 15 minutes
  message: "Too many recipe generation requests, please try again later."
});

// @route   POST /api/recipes/generate
router.post("/generate", protect, recipeLimiter, generateRecipe );

// @route   GET /api/recipes
router.get("/", protect, getUserRecipes);

// @route   GET /api/recipes/:id
router.get("/:id", protect, getRecipeById);

// @route   DELETE /api/recipes/all
router.delete("/all", protect, deleteAllRecipes);

// @route   DELETE /api/recipes/:id
router.delete("/:id", protect, deleteRecipe);


module.exports = router;