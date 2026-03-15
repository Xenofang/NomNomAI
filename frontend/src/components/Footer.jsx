import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#3A2E2E] text-[#FFF8F0] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-[2fr_1fr_1fr] gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-[#F4A261]">
            Nom-Nom Ai
          </h2>
          <p className="mt-4 text-sm text-gray-300">
            Turn your everyday ingredients into delicious meals using the power
            of AI. Cook smarter and waste less food.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-4 text-[#F4A261]">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#E63946] cursor-pointer"><a href="/">Home</a></li>
            <li className="hover:text-[#E63946] cursor-pointer">
              <a href="/recipe">Generate Recipe</a>
            </li>
            <li className="hover:text-[#E63946] cursor-pointer">
              <a href="/saved">Saved Recipes</a>
            </li>
            
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4 text-[#F4A261]">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#E63946] cursor-pointer">
              Cooking Tips
            </li>
            <li className="hover:text-[#E63946] cursor-pointer">
              Healthy Diets
            </li>
            <li className="hover:text-[#E63946] cursor-pointer">
              Cuisine Guide
            </li>
            <li className="hover:text-[#E63946] cursor-pointer">Support</li>
          </ul>
          <p className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-2 rounded-md text-sm mt-2">
            ⚠️ Note: The resource section is not working right now.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#5a4747] text-center py-4 text-sm text-gray-300">
        © 2026 AI Recipe Generator • Built with ❤️ for food lovers
      </div>
    </footer>
  );
};

export default Footer;
