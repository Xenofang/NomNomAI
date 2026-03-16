# NomNom AI 🍜🤖

NomNom AI is a full-stack AI-powered recipe generator built with the MERN stack. It allows users to generate recipes using AI, save them to their account, and view their personal recipe collection through a clean and responsive interface.

## Live Demo

Add your deployed links here:

- Project NomNom Ai: [Live Website](https://nomnom-ai.vercel.app/)


---

## Features

- AI-generated recipes based on user input
- User authentication with JWT
- Save recipes to personal account
- View saved recipes
- Delete recipes
- Responsive frontend UI
- User-specific recipe history using MongoDB references

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### AI
- Groq API

### Deployment
- Frontend: Add platform name
- Backend: Add platform name
- Database: MongoDB Atlas

---

## How It Works

1. User enters ingredients or recipe-related input.
2. Frontend sends the request to the backend.
3. Backend sends a prompt to the Groq AI API.
4. Groq generates a recipe.
5. The generated recipe is stored in MongoDB.
6. Saved recipes are fetched using the logged-in user's ID.
7. Frontend displays the recipes in the UI.

---

## Project Structure

```bash
NomNom-AI/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

####Web  ScreenShots
---
Home page

![](https://github.com/Xenofang/NomNomAI/blob/dc4ff4252bfb3e5ec4f89b1b9d6630b9ee4df627/websiteImages/Screenshot%202026-03-16%20112122.png )
---
Recipe generation page

![](https://github.com/Xenofang/NomNomAI/blob/dc4ff4252bfb3e5ec4f89b1b9d6630b9ee4df627/websiteImages/Screenshot%202026-03-16%20110640.png)
---
Saved recipes page

![](https://github.com/Xenofang/NomNomAI/blob/dc4ff4252bfb3e5ec4f89b1b9d6630b9ee4df627/websiteImages/Screenshot%202026-03-16%20112013.png)
---
Profile page

![](https://github.com/Xenofang/NomNomAI/blob/dc4ff4252bfb3e5ec4f89b1b9d6630b9ee4df627/websiteImages/Screenshot%202026-03-16%20112041.png
)
---
Register Page

![](https://github.com/Xenofang/NomNomAI/blob/dc4ff4252bfb3e5ec4f89b1b9d6630b9ee4df627/websiteImages/Screenshot%202026-03-16%20112104.png
)
---
Login page

![](https://github.com/Xenofang/NomNomAI/blob/dc4ff4252bfb3e5ec4f89b1b9d6630b9ee4df627/websiteImages/Screenshot%202026-03-16%20112053.png)
---
