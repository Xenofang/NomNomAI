const Groq = require("groq-sdk");
const Recipe = require("../models/Recipe");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─────────────────────────────────────────────────────────────
// Language names map
// ─────────────────────────────────────────────────────────────
const languageNames = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  ar: "Arabic",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  de: "German",
  pt: "Portuguese",
  ru: "Russian",
  it: "Italian",
  tr: "Turkish",
  bn: "Bengali",
};

// ─────────────────────────────────────────────────────────────
// Helper: build Groq prompt
// ─────────────────────────────────────────────────────────────
const buildPrompt = ({
  prompt,
  ingredientInput,
  cuisine,
  diet,
  cookingTimeFilter,
  language,
}) => {
  const langName = languageNames[language] || "English";

  if (prompt && prompt.trim() !== "") {
    return `
      A user wants a recipe. Their request: "${prompt}"
      Generate the recipe and respond in ${langName} language.
      Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
      {
        "title": "Recipe Title",
        "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
        "instructions": ["Step 1", "Step 2"],
        "cookingTime": "30 minutes",
        "servings": "4"
      }
    `;
  }

  return `
    Generate a recipe using the following details:
    ${ingredientInput ? `- Ingredients: ${ingredientInput}` : ""}
    ${cuisine && cuisine !== "Any" ? `- Cuisine: ${cuisine}` : ""}
    ${diet && diet !== "Any" ? `- Diet: ${diet}` : ""}
    ${cookingTimeFilter && cookingTimeFilter !== "No Limit" ? `- Must be ready in: ${cookingTimeFilter}` : ""}
    Generate the recipe and respond in ${langName} language.
    Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
    {
      "title": "Recipe Title",
      "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
      "instructions": ["Step 1", "Step 2"],
      "cookingTime": "30 minutes",
      "servings": "4"
    }
  `;
};

// ─────────────────────────────────────────────────────────────
// @desc    Generate a recipe using Groq AI and save it
// @route   POST /api/recipes/generate
// @access  Private
// ─────────────────────────────────────────────────────────────
const generateRecipe = async (req, res) => {
  const {
    prompt,
    ingredientInput,
    cuisine,
    diet,
    cookingTimeFilter,
    language,
  } = req.body;

  if (!prompt?.trim() && !ingredientInput?.trim()) {
    return res
      .status(400)
      .json({ message: "Please enter a prompt or provide ingredients." });
  }

  try {
    const lang = language || "en";

    // Step 1 — Build prompt and call Groq
    const groqPrompt = buildPrompt({
      prompt,
      ingredientInput,
      cuisine,
      diet,
      cookingTimeFilter,
      language: lang,
    });

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: groqPrompt }],
    });

    const rawText = result.choices[0].message.content;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const recipeData = JSON.parse(cleaned);

    // Step 2 — Check if recipe with same title already exists for this user
    const existingRecipe = await Recipe.findOne({
      user: req.user._id,
      title: recipeData.title,
    });

    if (existingRecipe) {
      // Return existing recipe with alreadySaved flag
      return res.status(200).json({
        ...existingRecipe.toObject(),
        alreadySaved: true,
      });
    }

    // Step 3 — Save new recipe to MongoDB
    const recipe = await Recipe.create({
      user: req.user._id,
      prompt: prompt || "",
      ingredientInput: ingredientInput || "",
      cuisine: cuisine || "Any",
      diet: diet || "Any",
      cookingTimeFilter: cookingTimeFilter || "No Limit",
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      cookingTime: recipeData.cookingTime,
      servings: recipeData.servings,
      language: lang,
    });

    return res.status(201).json({
      ...recipe.toObject(),
      alreadySaved: false,
    });
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get all recipes for the logged-in user
// @route   GET /api/recipes
// @access  Private
// ─────────────────────────────────────────────────────────────
const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching recipes." });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get a single recipe by ID
// @route   GET /api/recipes/:id
// @access  Private
// ─────────────────────────────────────────────────────────────
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized." });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe." });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
// ─────────────────────────────────────────────────────────────
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized." });
    }
    await recipe.deleteOne();
    res.json({ message: "Recipe deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe." });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Delete ALL recipes for the logged-in user
// @route   DELETE /api/recipes/all
// @access  Private
// ─────────────────────────────────────────────────────────────
const deleteAllRecipes = async (req, res) => {
  try {
    await Recipe.deleteMany({ user: req.user._id });
    res.json({ message: "All recipes deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateRecipe,
  getUserRecipes,
  getRecipeById,
  deleteRecipe,
  deleteAllRecipes,
};
