import axios from "axios";

const API = axios.create({
  baseURL: "https://nomnomai-dvld.onrender.com",
});

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ── Auth ──────────────────────────────────────────────────────
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const getUserProfile = () => API.get("/profile");

// ── Recipes ───────────────────────────────────────────────────
export const generateRecipe = (data) => API.post("/recipes/generate", data);
export const getUserRecipes = () => API.get("/recipes");
export const getRecipeById = (id) => API.get(`/recipes/${id}`);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
export const deleteAllRecipes = () => API.delete("/recipes/all");
export const updateUserProfile = (data) => API.put("/profile", data);
