import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import {
  Search,
  ArrowLeft,
  Plus,
  X,
  Loader,
  UtensilsCrossed,
  AlertCircle,
  MapPin,
  Star,
  DollarSign,
} from "lucide-react";

const CreatePlaylist = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#f97316");
  const [searchQuery, setSearchQuery] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { userData } = useAuthUser();

  const colorPalette = [
    { value: "#f97316", name: "Orange" },
    { value: "#fb923c", name: "Light Orange" },
    { value: "#facc15", name: "Yellow" },
    { value: "#f87171", name: "Red" },
    { value: "#fbbf24", name: "Amber" },
    { value: "#f59e0b", name: "Dark Amber" },
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/restaurants", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data); // For debugging
        setAllRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);
  useEffect(() => {
    const filtered = allRestaurants.filter((restaurant) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(searchLower) ||
        (restaurant.types &&
          restaurant.types.some((type) =>
            type.toLowerCase().includes(searchLower)
          )) ||
        (restaurant.price_level &&
          restaurant.price_level.toString().includes(searchLower))
      );
    });
    setFilteredRestaurants(filtered);
  }, [searchQuery, allRestaurants]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const toggleRestaurantSelection = (restaurant) => {
    setSelectedRestaurants((prev) => {
      const isSelected = prev.find((r) => r.place_id === restaurant.place_id);
      if (isSelected) {
        return prev.filter((r) => r.place_id !== restaurant.place_id);
      } else {
        return [...prev, restaurant];
      }
    });
  };

  const getPriceLevel = (level) => {
    return level ? "$$$$".slice(0, level) : "N/A";
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Please enter a list name");
      return;
    }

    if (selectedRestaurants.length === 0) {
      setError("Please select at least one restaurant");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!userData) {
        throw new Error("You must be logged in to create a list");
      }

      const listData = {
        name: formData.name,
        description: formData.description,
        restaurants: selectedRestaurants.map((r) => r.place_id),
        color: selectedColor,
        author: userData.username,
        username: userData.username,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        `http://localhost:8000/users/${userData.username}/lists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create list");
      }

      navigate("/lists");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-orange-500"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center">
              <UtensilsCrossed className="w-6 h-6 text-orange-500" />
              <span className="ml-2 font-semibold text-gray-900">
                Create New Restaurant List
              </span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                List Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., My Favorite Italian Restaurants"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell others what this list is about..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Theme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          selectedColor === color.value
                            ? "ring-2 ring-offset-2 ring-gray-900"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Selected Restaurants
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedRestaurants.length} selected
                    </span>
                  </div>
                  {selectedRestaurants.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRestaurants.map((restaurant) => (
                        <div
                          key={restaurant.place_id}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {restaurant.name}
                          </span>
                          <button
                            onClick={() =>
                              toggleRestaurantSelection(restaurant)
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-md">
                      No restaurants selected
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="mt-6 w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Creating List...
                  </div>
                ) : (
                  "Create List"
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search restaurants by name, cuisine, or price level..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRestaurants.map((restaurant) => {
                const isSelected = selectedRestaurants.some(
                  (r) => r.place_id === restaurant.place_id
                );

                return (
                  <div
                    key={restaurant.place_id}
                    onClick={() => toggleRestaurantSelection(restaurant)}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? "ring-2 ring-orange-500" : "hover:scale-102"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {restaurant.name}
                        </h3>
                        {isSelected && (
                          <div className="bg-orange-100 rounded-full p-1">
                            <Plus className="w-4 h-4 text-orange-500 transform rotate-45" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{restaurant.address}</span>
                        {restaurant.location && (
                          <span className="ml-2 text-xs text-gray-400">
                            ({restaurant.location.lat.toFixed(4)},{" "}
                            {restaurant.location.lng.toFixed(4)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {restaurant.rating} ({restaurant.user_ratings_total}
                            )
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {getPriceLevel(restaurant.price_level)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {restaurant.types.slice(0, 3).map((type, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {type.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">
                  No restaurants found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
