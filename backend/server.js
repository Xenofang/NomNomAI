require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes"); 

const app = express();

connectDB();
//connects backend with frontend 
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://nomnom-ai.vercel.app",
    "https://nom-nom-ai-roan.vercel.app",
  ],
  credentials: true
}));


app.use(express.json());


app.get("/test", (req, res) => res.json({ message: "Server is working" }));
app.use("/api", userRoutes);
app.use("/api/recipes", recipeRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
