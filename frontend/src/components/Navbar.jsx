import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowOverlay(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }
  }, [open]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-linear-to-r from-orange-500 via-red-500 to-orange-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <ChefHat size={32} />
            <Link to="/">Nom-Nom Ai</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-white font-medium items-center">
            <Link
              to="/"
              className="hover:text-yellow-200 transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/recipe"
              className="hover:text-yellow-200 transition duration-200"
            >
              Generate Recipe
            </Link>
            <Link
              to="/saved"
              className="hover:text-yellow-200 transition duration-200"
            >
              Saved Recipes
            </Link>

            {user ? (
              // Logged in — show username + logout
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="text-yellow-100 font-medium hover:text-white transition"
                >
                  👋 {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-500 px-4 py-1 rounded-full font-semibold hover:bg-yellow-100 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in — show login button
              <Link
                to="/login"
                className="bg-white text-red-500 px-4 py-1 rounded-full font-semibold hover:bg-yellow-100 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform z-50 ${
            open ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          <div className="p-6 flex justify-between items-center border-b border-gray-600">
            <h2 className="font-bold text-lg">Menu</h2>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <ul className="flex flex-col p-6 space-y-4">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#F4A261]"
                  onClick={() => setOpen(false)}
                >
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link
                  to="/recipe"
                  className="hover:text-[#F4A261]"
                  onClick={() => setOpen(false)}
                >
                  👨‍🍳 Generate Recipe
                </Link>
              </li>
              <li>
                <Link
                  to="/saved"
                  className="hover:text-[#F4A261]"
                  onClick={() => setOpen(false)}
                >
                  🔖 Saved Recipes
                </Link>
              </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:text-[#F4A261]"
                onClick={() => setOpen(false)}
              >
                👤 Profile
              </Link>
            </li>
            <li>
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  🚪 Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-[#F4A261]"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>

          {/* Show username in sidebar if logged in */}
          {user && (
            <div className="px-6 text-sm text-gray-400">
              Logged in as <span className="text-white">{user.email}</span>
            </div>
          )}
        </div>

        {/* Overlay */}
        {showOverlay && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
