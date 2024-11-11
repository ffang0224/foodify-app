import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import sampleRestaurantData from "../sample-data/sampleRestaurantData";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-bold ml-2 text-orange-500 tracking-tight">
              Foodify
            </h1>
          </div>

          {/* Navigation Control - Back to Lists */}
          <button
            onClick={() => navigate("/lists")}
            className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Lists</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewPlaylist = ({ userPlaylists }) => {
  const { playlistId } = useParams();
  const playlist = userPlaylists[playlistId];

  if (!playlist) {
    return <p className="text-gray-600 text-center p-4">Playlist not found</p>;
  }

  // Filter restaurants in the playlist
  const selectedRestaurants = sampleRestaurantData.filter((restaurant) =>
    playlist.restaurants.includes(restaurant.restaurantId)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar /> {/* Consistent NavBar added */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {playlist.name}
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {selectedRestaurants.map((restaurant) => (
            <div
              key={restaurant.restaurantId}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
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
                    <span className="font-medium">Cuisine:</span>{" "}
                    {restaurant.cuisines}
                  </p>
                  <p>
                    <span className="font-medium">Price Range:</span>{" "}
                    {restaurant.priceRange}
                  </p>
                  <p>
                    <span className="font-medium">Popular Dishes:</span>{" "}
                    {restaurant.popularDishes.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPlaylist;
