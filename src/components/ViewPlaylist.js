import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import {
  UtensilsCrossed,
  ArrowLeft,
  Share2,
  Heart,
  Edit2,
  Trash2,
  Loader,
} from "lucide-react";

const ViewPlaylist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuthUser();

  const [playlist, setPlaylist] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!userData) return;

      try {
        // Fetch playlist data
        const playlistResponse = await fetch(
          `http://localhost:8000/users/${userData.username}/playlists/${playlistId}`
        );
        if (!playlistResponse.ok) throw new Error("Failed to fetch playlist");
        const playlistData = await playlistResponse.json();

        setPlaylist(playlistData);
        setIsOwner(playlistData.username === userData.username);

        // Fetch restaurant details for each restaurant in the playlist
        const restaurantPromises = playlistData.restaurants.map(
          (restaurantId) =>
            fetch(`http://localhost:8000/restaurants/${restaurantId}`).then(
              (res) => res.json()
            )
        );

        const restaurantData = await Promise.all(restaurantPromises);
        setRestaurants(restaurantData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [playlistId, userData]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:8000/users/${userData.username}/playlists/${playlistId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete playlist");

      navigate("/lists");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading playlist...</span>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/lists")}
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Lists</span>
            </button>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-orange-500">
                <Share2 className="w-5 h-5" />
              </button>
              {!isOwner && (
                <button className="text-gray-600 hover:text-orange-500">
                  <Heart className="w-5 h-5" />
                </button>
              )}
              {isOwner && (
                <>
                  <button
                    onClick={() => navigate(`/playlist/${playlistId}/edit`)}
                    className="text-gray-600 hover:text-orange-500"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {playlist.name}
          </h2>
          {playlist.description && (
            <p className="text-gray-600 mb-4">{playlist.description}</p>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <span>Created by @{playlist.author}</span>
            <span className="mx-2">•</span>
            <span>{restaurants.length} restaurants</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.restaurantId}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <img
                src={restaurant.images[0]}
                alt={restaurant.name}
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
