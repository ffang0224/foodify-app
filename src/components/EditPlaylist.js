// // // The EditPlaylist component includes the following key features:

// // // 1. Fetches existing list details on mount
// // // 2. Pre-populates the form with existing list name and description
// // // 3. Loads existing restaurants into the selected restaurants list
// // // 4. Provides a search functionality to add new restaurants
// // // 5. Allows removing existing restaurants
// // // 6. Validates form before submission
// // // 7. Sends a PUT request to update the list
// // // 8. Handles loading and error states
// // // 9. Provides navigation back to the list view

// // // Key differences from a create playlist page:

// // // 1. Uses a PUT method instead of POST
// // // 2. Pre-populates existing data
// // // 3. Fetches existing restaurant details

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
  
  // Restaurants state
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  // UI and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false);

  // Fetch existing list details and all restaurants on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userData) return;

      try {
        // Fetch list details
        const listResponse = await fetch(
          `https://foodify-backend-927138020046.us-central1.run.app/users/${userData.username}/lists/${listId}`
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
          const res = await fetch(`https://foodify-backend-927138020046.us-central1.run.app/restaurants/${place_id}`);
          if (!res.ok) {
            console.error(`Failed to fetch restaurant ${place_id}:`, await res.text());
            throw new Error(`Failed to fetch restaurant ${place_id}`);
          }
          return res.json();
        });

        const restaurantData = await Promise.all(restaurantPromises);
        setSelectedRestaurants(restaurantData);

        // Fetch all restaurants
        const allRestaurantsResponse = await fetch(`https://foodify-backend-927138020046.us-central1.run.app/restaurants`);
        if (!allRestaurantsResponse.ok) {
          const errorText = await allRestaurantsResponse.text();
          throw new Error(`Failed to fetch restaurants: ${errorText}`);
        }

        const allRestaurantsData = await allRestaurantsResponse.json();
        setAllRestaurants(allRestaurantsData);
        setFilteredRestaurants(allRestaurantsData);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [listId, userData]);

  // Helper function to get restaurant name
  const getRestaurantName = (restaurant) => {
    return restaurant.name?.gmaps || restaurant.name?.yelp || "Unnamed Restaurant";
  };

  // Helper function to get address
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

  // Handle search query changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowRestaurantDropdown(true);

    // Filter restaurants based on query
    const filtered = allRestaurants.filter(restaurant => 
      getRestaurantName(restaurant).toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  // Add restaurant to selected list
  const addRestaurant = (restaurant) => {
    // Prevent duplicates
    if (!selectedRestaurants.some(r => 
      r.additional_info?.gmaps?.place_id === restaurant.additional_info?.gmaps?.place_id &&
      r.additional_info?.yelp?.yelp_id === restaurant.additional_info?.yelp?.yelp_id
    )) {
      setSelectedRestaurants([...selectedRestaurants, restaurant]);
    }
    // Clear search query and hide dropdown
    setSearchQuery('');
    setShowRestaurantDropdown(false);
  };

  // Remove restaurant from selected list
  const removeRestaurant = (restaurantToRemove) => {
    setSelectedRestaurants(
      selectedRestaurants.filter(r => 
        r.additional_info?.gmaps?.place_id !== restaurantToRemove.additional_info?.gmaps?.place_id ||
        r.additional_info?.yelp?.yelp_id !== restaurantToRemove.additional_info?.yelp?.yelp_id
      )
    );
  };

  // Handle form submission (unchanged from previous version)
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
        author: userData.username,  
        username: userData.username  
      };

      // Submit update
      const response = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/users/${userData.username}/lists/${listId}`,
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

  // Render the rest of the component (mostly unchanged)
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
          {/* List Name and Description inputs (unchanged) */}
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

            {/* Selected Restaurants */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selectedRestaurants.map((restaurant) => (
                <div 
                  key={restaurant.additional_info?.gmaps?.place_id || restaurant.additional_info?.yelp?.yelp_id}
                  className="bg-white rounded-lg shadow-md relative"
                >
                  <button
                    type="button"
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
                  </div>
                </div>
              ))}
            </div>
          </div>

            {/* Search bar with dropdown */}
            <div className="relative mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowRestaurantDropdown(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Search for restaurants"
                />
              </div>

              {/* Dropdown for restaurant list */}
              {showRestaurantDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant) => (
                      <div 
                        key={restaurant.additional_info?.gmaps?.place_id || restaurant.additional_info?.yelp?.yelp_id}
                        onClick={() => addRestaurant(restaurant)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium">{getRestaurantName(restaurant)}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {getAddress(restaurant)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No restaurants found</div>
                  )}
                </div>
              )}
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