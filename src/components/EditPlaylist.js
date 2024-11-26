// The EditPlaylist component includes the following key features:

// 1. Fetches existing list details on mount
// 2. Pre-populates the form with existing list name and description
// 3. Loads existing restaurants into the selected restaurants list
// 4. Provides a search functionality to add new restaurants
// 5. Allows removing existing restaurants
// 6. Validates form before submission
// 7. Sends a PUT request to update the list
// 8. Handles loading and error states
// 9. Provides navigation back to the list view

// Key differences from a create playlist page:

// 1. Uses a PUT method instead of POST
// 2. Pre-populates existing data
// 3. Fetches existing restaurant details

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Loader, 
  MapPin, 
  Star, 
  DollarSign 
} from 'lucide-react';

const EditPlaylist = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuthUser();

  // Form state
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // UI and error state
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing list details on component mount
  useEffect(() => {
    const fetchListDetails = async () => {
      if (!userData) return;

      try {
        // Fetch list details
        const listResponse = await fetch(
          `http://localhost:8000/users/${userData.username}/lists/${listId}`
        );

        if (!listResponse.ok) {
          const errorText = await listResponse.text();
          throw new Error(`Failed to fetch list: ${errorText}`);
        }

        const listData = await listResponse.json();

        // Validate ownership
        if (listData.username !== userData.username) {
          throw new Error('You are not authorized to edit this list');
        }

        // Set initial form values
        setListName(listData.name);
        setListDescription(listData.description || '');

        // Fetch full restaurant details
        const restaurantPromises = listData.restaurants.map(async (place_id) => {
          const res = await fetch(`http://localhost:8000/restaurants/${place_id}`);
          if (!res.ok) {
            console.error(`Failed to fetch restaurant ${place_id}:`, await res.text());
            throw new Error(`Failed to fetch restaurant ${place_id}`);
          }
          return res.json();
        });

        const restaurantData = await Promise.all(restaurantPromises);
        setSelectedRestaurants(restaurantData);
      } catch (err) {
        console.error("Error fetching list details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [listId, userData]);

  // Helper functions for search and restaurant selection
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/restaurants/search?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Search failed: ${errorText}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const addRestaurant = (restaurant) => {
    // Prevent duplicates
    if (!selectedRestaurants.some(r => 
      r.additional_info?.gmaps?.place_id === restaurant.additional_info?.gmaps?.place_id &&
      r.additional_info?.yelp?.yelp_id === restaurant.additional_info?.yelp?.yelp_id
    )) {
      setSelectedRestaurants([...selectedRestaurants, restaurant]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeRestaurant = (restaurantToRemove) => {
    setSelectedRestaurants(
      selectedRestaurants.filter(r => 
        r.additional_info?.gmaps?.place_id !== restaurantToRemove.additional_info?.gmaps?.place_id ||
        r.additional_info?.yelp?.yelp_id !== restaurantToRemove.additional_info?.yelp?.yelp_id
      )
    );
  };

  // Helper functions for rendering restaurant details
  const getRestaurantName = (restaurant) => {
    return restaurant.name?.gmaps || restaurant.name?.yelp || "Unnamed Restaurant";
  };

  const getAddress = (restaurant) => {
    if (restaurant.location?.gmaps?.address) {
      return restaurant.location.gmaps.address;
    }
    if (restaurant.location?.yelp?.address) {
      const addr = restaurant.location.yelp.address;
      return `${addr.address1}${addr.address2 ? `, ${addr.address2}` : ''}, ${addr.city}, ${addr.state} ${addr.zip_code}`;
    }
    return "Address unavailable";
  };

  const getRestaurantRating = (restaurant) => {
    const gmapsRating = restaurant.ratings?.gmaps?.rating;
    const yelpRating = restaurant.ratings?.yelp?.rating;
    return gmapsRating || yelpRating || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!listName.trim()) {
      setError('List name is required');
      return;
    }

    if (selectedRestaurants.length === 0) {
      setError('Please add at least one restaurant');
      return;
    }

    try {
      // Get place IDs for selected restaurants
      const restaurantPlaceIds = selectedRestaurants.map(restaurant => 
        restaurant.additional_info?.gmaps?.place_id || 
        restaurant.additional_info?.yelp?.yelp_id || 
        'unknown'
      );

      // Prepare list data
      const listData = {
        name: listName,
        description: listDescription,
        restaurants: restaurantPlaceIds,
        author: userData.username,  // Add author
        username: userData.username  // Add username
      };

      // Submit update
      const response = await fetch(
        `http://localhost:8000/users/${userData.username}/lists/${listId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(listData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update list: ${errorText}`);
      }

      // Redirect to view list page
      navigate(`/lists/${listId}`);
    } catch (err) {
      console.error("Error updating list:", err);
      setError(err.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading list details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(`/lists/${listId}`)}
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to List</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Playlist</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-2">
              List Name
            </label>
            <input
              type="text"
              id="listName"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter list name"
              required
            />
          </div>

          <div>
            <label htmlFor="listDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="listDescription"
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Describe your list"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurants
            </label>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-4 relative">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Search for restaurants"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 transition-colors flex items-center"
                >
                  {searching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((restaurant) => (
                    <div 
                      key={restaurant.additional_info?.gmaps?.place_id || restaurant.additional_info?.yelp?.yelp_id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => addRestaurant(restaurant)}
                    >
                      <div>
                        <div className="font-medium">{getRestaurantName(restaurant)}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {getAddress(restaurant)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{getRestaurantRating(restaurant).toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Selected Restaurants */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selectedRestaurants.map((restaurant) => (
                <div 
                  key={restaurant.additional_info?.gmaps?.place_id || restaurant.additional_info?.yelp?.yelp_id}
                  className="bg-white rounded-lg shadow-md relative"
                >
                  <button
                    onClick={() => removeRestaurant(restaurant)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {getRestaurantName(restaurant)}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {getAddress(restaurant)}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{getRestaurantRating(restaurant).toFixed(1)}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span>
                          {"$$$$".slice(0, restaurant.price_level?.composite?.average || 
                            restaurant.price_level?.gmaps?.normalized || 
                            restaurant.price_level?.yelp?.normalized || 
                            0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/lists/${listId}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlaylist;