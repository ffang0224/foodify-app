import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { Plus, Library, Loader, Star } from "lucide-react";
import RestaurantListCard from './ListCard';

const ListsPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuthUser();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [incentiveMessage, setIncentiveMessage] = useState("");

  // Helper function to process restaurant data in lists
  const processRestaurantData = (lists) => {
    return lists.map(list => ({
      ...list,
      restaurants: list.restaurants.map(restaurant => ({
        id: restaurant.additional_info?.gmaps?.place_id ||
          restaurant.additional_info?.yelp?.yelp_id ||
          'unknown',
        name: restaurant.name?.gmaps || restaurant.name?.yelp || 'Unknown Restaurant',
        rating: restaurant.ratings?.gmaps?.rating ||
          restaurant.ratings?.yelp?.rating ||
          0,
        totalRatings: (restaurant.ratings?.gmaps?.total_ratings || 0) +
          (restaurant.ratings?.yelp?.total_ratings || 0),
        address: restaurant.location?.gmaps?.address ||
          (restaurant.location?.yelp?.address ?
            `${restaurant.location.yelp.address.address1}, ${restaurant.location.yelp.address.city}` :
            'Address unavailable'),
        types: [...new Set([
          ...(restaurant.types?.gmaps || []),
          ...(restaurant.types?.yelp || [])
        ])].map(type => type.replace(/_/g, ' ')),
        price_level: restaurant.price_level?.composite?.average ||
          restaurant.price_level?.gmaps?.normalized ||
          restaurant.price_level?.yelp?.normalized ||
          null
      }))
    }));
  };

  useEffect(() => {
    const fetchLists = async () => {
      if (!userData) return;

      try {
        const response = await fetch(
          `http://localhost:8000/users/${userData.username}/lists`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lists");
        }

        const userLists = await response.json();
        // Process the lists with the new restaurant data structure
        const processedLists = processRestaurantData(userLists);
        setLists(processedLists);

        // Calculate incentive message
        const numLists = processedLists.length;
        const nextMilestone = Math.ceil((numLists + 1) / 10) * 10;
        const points = (nextMilestone / 10) * 10;
        const firstName = userData.firstName;

        if (numLists > 0 && numLists % 10 === 0) {
          // Update points on the server
          await fetch(
            `http://localhost:8000/users/${userData.username}/updatePoints`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ points }),
            }
          );
        }

        setIncentiveMessage(
          `Keep going, ${firstName}! Create ${nextMilestone - numLists
          } more list${nextMilestone - numLists > 1 ? "s" : ""} to reach ${nextMilestone
          } lists and earn ${points} points.`
        );
      } catch (err) {
        console.error("Error fetching lists:", err);
        setError(err.message || "Failed to load lists");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [userData]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="w-5 h-5 animate-spin text-orange-500" />
          <span className="text-xl font-semibold">Loading lists...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {error && (
        <div className="mb-8 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {incentiveMessage && (
        <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-md shadow-lg animate-pulse">
          <h3 className="text-yellow-600 font-semibold text-xl">
            Keep Going!
          </h3>
          <p className="text-gray-700">{incentiveMessage}</p>
        </div>
      )}

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 hover:text-orange-500 transition-all duration-300">
              Your Lists
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage your restaurant collections
            </p>
          </div>
          <button
            onClick={() => navigate("/create-playlist")}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all shadow-xl transform"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New List
          </button>
        </div>

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lists.map((list) => (
              <RestaurantListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg shadow-md">
            <Library className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-4">
              You haven't created any lists yet
            </p>
            <button
              onClick={() => navigate("/create-playlist")}
              className="text-xl text-orange-500 hover:text-orange-600 font-semibold transition-all duration-200"
            >
              Create Your First List
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ListsPage;