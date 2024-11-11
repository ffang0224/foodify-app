import React, { useState } from "react";
import sampleRestaurantData from "../sample-data/sampleRestaurantData";
import { useNavigate } from "react-router-dom";

const CreatePlaylist = ({ onSave }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#f97316"); // Default color
  const navigate = useNavigate();

  // Color palette
  const colorPalette = [
    "#f97316", // Orange
    "#fb923c", // Light orange
    "#facc15", // Yellow
    "#f87171", // Red
    "#fbbf24", // Amber
    "#f59e0b", // Dark amber
  ];

  const toggleRestaurantSelection = (restaurantId) => {
    setSelectedRestaurants((prevSelected) =>
      prevSelected.includes(restaurantId)
        ? prevSelected.filter((id) => id !== restaurantId)
        : [...prevSelected, restaurantId]
    );
  };

  const handleSave = () => {
    if (playlistName.trim() && selectedRestaurants.length > 0) {
      onSave({ name: playlistName, restaurants: selectedRestaurants, color: selectedColor });
      navigate("/lists");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Playlist</h2>
      <input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Color selection */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose a Color</h3>
      <div className="flex space-x-4 mb-6">
        {colorPalette.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              backgroundColor: color,
              border: selectedColor === color ? "2px solid #333" : "none",
            }}
            className="w-10 h-10 rounded-full cursor-pointer transition transform hover:scale-105"
          />
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sampleRestaurantData.map((restaurant) => (
          <div
            key={restaurant.restaurantId}
            onClick={() => toggleRestaurantSelection(restaurant.restaurantId)}
            className={`bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer ${
              selectedRestaurants.includes(restaurant.restaurantId)
                ? "border-2 border-blue-500"
                : "border border-gray-300"
            }`}
          >
            <img
              src={restaurant.images[0]}
              alt={`${restaurant.name}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {restaurant.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Cuisine:</span> {restaurant.cuisines}
                </p>
                <p>
                  <span className="font-medium">Price Range:</span> {restaurant.priceRange}
                </p>
                <p>
                  <span className="font-medium">Popular Dishes:</span> {restaurant.popularDishes.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
      >
        Save Playlist
      </button>
    </div>
  );
};

export default CreatePlaylist;
