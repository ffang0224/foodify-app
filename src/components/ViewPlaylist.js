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
  MapPin,
  Star,
  DollarSign,
} from "lucide-react";

const ViewPlaylist = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuthUser();

  const [list, setList] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const getPriceLevel = (level) => {
    return level ? "$$$$".slice(0, level) : "N/A";
  };

  useEffect(() => {
    const fetchListData = async () => {
      if (!userData) return;

      try {
        // Fetch list data
        const listResponse = await fetch(
          `http://localhost:8000/users/${userData.username}/lists/${listId}`
        );
        if (!listResponse.ok) throw new Error("Failed to fetch list");
        const listData = await listResponse.json();

        setList(listData);
        setIsOwner(listData.username === userData.username);

        // Fetch restaurant details for each restaurant in the list
        const restaurantPromises = listData.restaurants.map((restaurantId) =>
          fetch(`http://localhost:8000/restaurants/${restaurantId}`).then(
            (res) => {
              if (!res.ok)
                throw new Error(`Failed to fetch restaurant ${restaurantId}`);
              return res.json();
            }
          )
        );

        const restaurantData = await Promise.all(restaurantPromises);
        setRestaurants(restaurantData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListData();
  }, [listId, userData]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/users/${userData.username}/lists/${listId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete list");

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
          <span>Loading list...</span>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">List not found</div>
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
                    onClick={() => navigate(`/lists/${listId}/edit`)}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{list.name}</h2>
          {list.description && (
            <p className="text-gray-600 mb-4">{list.description}</p>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <span>Created by @{list.author}</span>
            <span className="mx-2">•</span>
            <span>{restaurants.length} restaurants</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.place_id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {restaurant.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {restaurant.address}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {restaurant.rating} ({restaurant.user_ratings_total})
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPlaylist;
