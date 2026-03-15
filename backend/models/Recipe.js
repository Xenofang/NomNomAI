const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Quick prompt (top form)
    prompt: {
      type: String,
      default: "",
    },

    // ── Detailed form (bottom form)
    ingredientInput: {
      type: String,
      default: "",
    },

    // e.g. "Italian" | "Indian" | "Mexican" | "Any"
    cuisine: {
      type: String,
      default: "Any",
    },

    // e.g. "Vegetarian" | "Vegan" | "Keto" | "Any"
    diet: {
      type: String,
      default: "Any",
    },

    // e.g. "Under 30 mins" | "Under 1 hour" | "No Limit"
    cookingTimeFilter: {
      type: String,
      default: "No Limit",
    },

    // ── AI-generated recipe fields ───────────────────────────
    title: {
      type: String,
      required: true,
    },

    ingredients: [
      {
        type: String,
      },
    ],

    instructions: [
      {
        type: String,
      },
    ],

    cookingTime: {
      type: String,
    },

    servings: {
      type: String,
    },
    language: {
      type: String,
      default: "en",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Recipe", recipeSchema);
