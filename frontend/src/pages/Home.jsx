import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const images = [
  "https://images.pexels.com/photos/262897/pexels-photo-262897.jpeg",
  "https://images.pexels.com/photos/9210/food-japanese-food-photography-sushi.jpg",
  "https://images.pexels.com/photos/5410418/pexels-photo-5410418.jpeg",
  "https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg",
  "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg",
  "https://images.pexels.com/photos/9617397/pexels-photo-9617397.jpeg",
  "https://images.pexels.com/photos/12392831/pexels-photo-12392831.jpeg",
  "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
  "https://images.pexels.com/photos/28445589/pexels-photo-28445589.jpeg"
];

// ─────────────────────────────────────────────────────────────
// ImageSlider Component
// ─────────────────────────────────────────────────────────────
const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => goToNext(), 4000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 800);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 800);
  };

  const goToIndex = (index) => {
    if (isTransitioning || index === currentIndex) return;
    stopAutoPlay();
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
      startAutoPlay();
    }, 800);
  };

  const nextIndex = (currentIndex + 1) % images.length;

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-56 sm:h-72 md:h-96 cursor-pointer"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {/* Current Image */}
      <img
        key={`current-${currentIndex}`}
        src={images[currentIndex]}
        alt="food"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: isTransitioning ? "translateX(-100%)" : "translateX(0%)",
          transition: isTransitioning ? "transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)" : "none",
          zIndex: 2,
        }}
      />

      {/* Next Image */}
      <img
        key={`next-${nextIndex}`}
        src={images[nextIndex]}
        alt="food next"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: isTransitioning ? "translateX(0%)" : "translateX(100%)",
          transition: isTransitioning ? "transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)" : "none",
          zIndex: 1,
        }}
      />

      {/* Left Arrow */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shadow-md transition text-lg"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shadow-md transition text-lg"
      >
        ›
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-5 h-2" : "bg-white/50 w-2 h-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// HomePage Component
// ─────────────────────────────────────────────────────────────
const HomePage = () => {
  return (
    <div className="bg-[#FFF8F0] min-h-screen">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3A2E2E] leading-tight">
            Turn Your Ingredients Into
            <span className="text-[#E63946]"> Delicious Recipes</span>
          </h1>
          <p className="mt-4 md:mt-6 text-gray-600 text-base md:text-lg">
            Our AI Recipe Generator helps you create amazing meals from the
            ingredients you already have.
          </p>
          <button className="mt-6 md:mt-8 bg-[#E63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-xl shadow-md transition">
            <Link to="/recipe">Generate Recipe</Link>
          </button>
        </div>

        {/* Slider */}
        <ImageSlider />
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3A2E2E] mb-8 md:mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-t-4 border-[#E63946]">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#E63946]">
                🥕 Add Ingredients
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Enter ingredients you already have in your kitchen.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-t-4 border-[#F4A261]">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#F4A261]">
                ⚙️ Choose Preferences
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Select cuisine type, diet, and cooking time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-t-4 border-[#2A9D8F] sm:col-span-2 md:col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#2A9D8F]">
                🍳 Get Your Recipe
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Our AI instantly generates a custom recipe for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED RECIPES */}
      <section className="py-12 md:py-16 bg-[#FFF8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3A2E2E] mb-8 md:mb-10">
            Recipe Inspiration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1603133872878-684f208fb84b"
                alt="Veggie Fried Rice"
                className="h-44 sm:h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-base sm:text-lg text-[#E63946]">Veggie Fried-rice</h3>
                <p className="text-gray-600 text-sm mt-1">Healthy fried rice loaded with fresh vegetables.</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                alt="Fresh Salad Bowl"
                className="h-44 sm:h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-base sm:text-lg text-[#2A9D8F]">Fresh Salad Bowl</h3>
                <p className="text-gray-600 text-sm mt-1">A refreshing mix of greens and healthy toppings.</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden sm:col-span-2 md:col-span-1">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                alt="Spicy Curry"
                className="h-44 sm:h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-base sm:text-lg text-[#F4A261]">Spicy Curry</h3>
                <p className="text-gray-600 text-sm mt-1">Flavorful curry packed with spices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-[#E63946] py-12 md:py-16">
        <div className="text-center text-white px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Ready to Cook Something Amazing?
          </h2>
          <p className="mt-4 text-base sm:text-lg opacity-90">
            Generate your custom recipe in seconds.
          </p>
          <button className="mt-6 bg-white text-[#E63946] font-semibold px-6 py-3 rounded-xl hover:bg-[#FFF8F0] transition shadow-md">
            <Link to="/recipe">Start Cooking</Link>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;