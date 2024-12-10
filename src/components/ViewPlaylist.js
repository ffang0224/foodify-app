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
  const [photoUrls, setPhotoUrls] = useState({});
  const [photoLoading, setPhotoLoading] = useState({});
  const [numLikes, setNumLikes] = useState({});
  const [favoritedBy, setFavoritedBy] = useState({});

  // Helper functions for the new data structure
  const getRestaurantName = (restaurant) => {
    // console.log(restaurant);
    return (
      restaurant.name?.gmaps || restaurant.name?.yelp || "Unnamed Restaurant"
    );
  };

  const getRestaurantRating = (restaurant) => {
    const gmapsRating = restaurant.ratings?.gmaps?.rating;
    const yelpRating = restaurant.ratings?.yelp?.rating;
    return gmapsRating || yelpRating || 0;
  };

  const getTotalRatings = (restaurant) => {
    const gmapsTotal = restaurant.ratings?.gmaps?.total_ratings || 0;
    const yelpTotal = restaurant.ratings?.yelp?.total_ratings || 0;
    return gmapsTotal + yelpTotal;
  };

  const getAddress = (restaurant) => {
    if (restaurant.location?.gmaps?.address) {
      return restaurant.location.gmaps.address;
    }
    if (restaurant.location?.yelp?.address) {
      const addr = restaurant.location.yelp.address;
      return `${addr.address1}${addr.address2 ? `, ${addr.address2}` : ""}, ${
        addr.city
      }, ${addr.state} ${addr.zip_code}`;
    }
    return "Address unavailable";
  };

  const getPriceLevel = (restaurant) => {
    const composite = restaurant.price_level?.composite;
    if (composite?.average)
      return "$$$$".slice(0, Math.round(composite.average));

    const gmapsPrice = restaurant.price_level?.gmaps?.normalized;
    const yelpPrice = restaurant.price_level?.yelp?.normalized;

    if (gmapsPrice !== null) return "$$$$".slice(0, gmapsPrice);
    if (yelpPrice !== null) return "$$$$".slice(0, yelpPrice);

    return "N/A";
  };

  const getTypes = (restaurant) => {
    const gmapsTypes = restaurant.types?.gmaps || [];
    const yelpTypes = restaurant.types?.yelp || [];
    return [...new Set([...gmapsTypes, ...yelpTypes])].map((type) =>
      type.replace(/_/g, " ")
    );
  };

  const getPlaceId = (restaurant) => {
    return (
      restaurant.additional_info?.gmaps?.place_id ||
      restaurant.additional_info?.yelp?.yelp_id ||
      "unknown"
    );
  };

  useEffect(() => {
    const fetchListData = async () => {
      if (!userData) return;

      try {
        // Fetch list data
        // const listResponse = await fetch(
        //   `https://foodify-backend-927138020046.us-central1.run.app/users/${userData.username}/lists/${listId}`
        // );

        const listResponse = await fetch(
          `https://foodify-backend-927138020046.us-central1.run.app/allLists/${listId}`
        );

        if (!listResponse.ok) {
          const errorText = await listResponse.text();
          console.error("List response error:", errorText);
          throw new Error(`Failed to fetch list: ${errorText}`);
        }

        const listData = await listResponse.json();
        // console.log(listData);
        setList(listData);
        setIsOwner(listData.username === userData.username);

        if (!listData.restaurants || !Array.isArray(listData.restaurants)) {
          console.error("No restaurants array in list data:", listData);
          return;
        }

        // Fetch restaurant details for each restaurant in the list
        const restaurantPromises = listData.restaurants.map(
          async (place_id) => {
            const res = await fetch(
              `https://foodify-backend-927138020046.us-central1.run.app/restaurants/${place_id}`
            );
            if (!res.ok) {
              console.error(
                `Failed to fetch restaurant ${place_id}:`,
                await res.text()
              );
              throw new Error(`Failed to fetch restaurant ${place_id}`);
            }
            return res.json();
          }
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

  useEffect(() => {
    const fetchPhotosForRestaurants = async () => {
      const newPhotoUrls = {};
      const newPhotoLoading = {};

      for (const restaurant of restaurants) {
        const placeId = restaurant.additional_info?.gmaps?.place_id;
        if (!placeId) continue;

        newPhotoLoading[placeId] = true;
        try {
          const response = await fetch(
            `https://foodify-backend-927138020046.us-central1.run.app/restaurant-photo/${placeId}`
          );
          if (response.ok) {
            const data = await response.json();
            newPhotoUrls[placeId] = data.photo_url;
          }
        } catch (error) {
          console.error("Error fetching photo for", placeId, error);
        } finally {
          newPhotoLoading[placeId] = false;
        }
      }

      setPhotoUrls(newPhotoUrls);
      setPhotoLoading(newPhotoLoading);
    };

    if (restaurants.length > 0) {
      fetchPhotosForRestaurants();
    }
  }, [restaurants]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;

    try {
      const response = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/users/${userData.username}/lists/${listId}`,
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

  const handleLike = async () => {
    if (!userData) return; // Ensure user is logged in

    try {
      const response = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/lists/${listId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.username,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like/unlike the list");
      }

      const result = await response.json();

      // Update the list's like information
      setList((prevList) => ({
        ...prevList,
        num_likes: result.num_likes,
        favorited_by: result.favorited_by,
      }));
    } catch (error) {
      console.error("Error liking/unliking the list:", error);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading list...</span>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">List not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/lists")}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Lists</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}


        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {list.name}
              </h2>
              {list.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                  {list.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Created by @{list.author}</span>
                <span className="hidden sm:inline">•</span>
                <span>{restaurants.length} restaurants</span>
                <span className="hidden sm:inline">•</span>
                <span>{list.num_likes} likes</span>
              </div>
            </div>



            <div className="flex items-center gap-4">
              <button
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
                aria-label="Share List"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {!isOwner && (
                <button
                  onClick={handleLike}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors flex items-center gap-2"
                  aria-label={list.favorited_by?.includes(userData.username) ? "Unlike List" : "Like List"}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      list.favorited_by?.includes(userData.username)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  <span>{list.num_likes}</span>
                </button>
              )}
              {isOwner && (
                <>
                  <button
                    onClick={() => navigate(`/lists/${listId}/edit`)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
                    aria-label="Edit List"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    aria-label="Delete List"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>



        <div className="grid gap-4 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <div
              key={getPlaceId(restaurant)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              {/* Restaurant Image */}
              <div className="h-40 sm:h-48 overflow-hidden">
                {photoLoading[getPlaceId(restaurant)] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <Loader className="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
                  </div>
                ) : (
                  <img
                    src={photoUrls[getPlaceId(restaurant)] || "/api/placeholder/400/300"}
                    alt={getRestaurantName(restaurant)}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Restaurant Details */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                  {getRestaurantName(restaurant)}
                </h3>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{getAddress(restaurant)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getRestaurantRating(restaurant).toFixed(1)} ({getTotalRatings(restaurant)})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getPriceLevel(restaurant)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getTypes(restaurant)
                    .slice(0, 3)
                    .map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-md"
                      >
                        {type}
                      </span>
                    ))}
                </div>

                {/* External Links */}
                <div className="flex gap-2 pt-3">
                  {restaurant.additional_info?.gmaps?.place_id && (
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${restaurant.additional_info.gmaps.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      View on Maps
                    </a>
                  )}
                  {restaurant.additional_info?.yelp?.yelp_id && (
                    <a
                      href={`https://www.yelp.com/biz/${restaurant.additional_info.yelp.yelp_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      View on Yelp
                    </a>
                  )}
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