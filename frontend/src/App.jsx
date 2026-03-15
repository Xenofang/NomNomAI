import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Recipe from "./pages/Recipe";
import Saved from "./pages/Saved";
import Login from "./pages/login/Login";
import Register from "./pages/login/register";
import RecipeDetail from "./pages/RecipeDetails";
import Profile from "./pages/Profile"
import EditProfile from "./pages/EditProfile";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />, // layout wrapper
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/recipe",
        element: <Recipe />,
      },
      {
        path: "/saved",
        element: <Saved />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/saved/:id",
        element: <RecipeDetail />,
      },
      {
        path:"/profile", //no id needed because the profile secction awlays a logged in user
        element:<Profile/>
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
