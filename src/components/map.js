import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { useAuthUser } from "../hooks/useAuthUser";
import MessageWindow from "./MessageWindow";

import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import {
  MapPin,
  Search,
  Loader2,
  MapIcon,
  Star,
  DollarSign,
  SlidersHorizontal,
  X,
} from "lucide-react";
import RestaurantDetailsModal from "./restaurantModal";

const MapComponent = () => {
  const { userData } = useAuthUser();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // NYU Washington Square Park location
  const NYU_LOCATION = { lat: 40.7295, lng: -73.9965 };

  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 64px)",
    borderRadius: "12px",
    overflow: "hidden",
  };

  // States
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [mapCenter, setMapCenter] = useState(NYU_LOCATION);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [skipUpdate, setSkipUpdate] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [messageModal, setMessageModal] = useState({
    show: false,
    message: "",
  });
  const [showDetailedModal, setShowDetailedModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    minRating: 0,
    priceLevel: [],
    cuisine: [],
    radius: 1000, // meters
  });

  // Custom map styles to hide default POIs
  const mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
  ];

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Fetch restaurants from database
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:8000/restaurants");
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        const data = await response.json();
        setRestaurants(data);

        // Extract unique cuisines for filter options
        const cuisines = new Set();
        data.forEach(restaurant => {
          if (restaurant.types?.gmaps) {
            restaurant.types.gmaps.forEach(type => cuisines.add(type));
          }
        });
        setCuisineOptions(Array.from(cuisines));
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Apply filters
  useEffect(() => {
    if (!restaurants.length) return;

    let filtered = restaurants;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.name.gmaps.toLowerCase().includes(query)
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(restaurant =>
        restaurant.ratings?.gmaps?.rating >= filters.minRating
      );
    }

    // Apply price filter
    if (filters.priceLevel.length) {
      filtered = filtered.filter(restaurant =>
        filters.priceLevel.includes(restaurant.price_level?.gmaps?.normalized || 0)
      );
    }

    // Apply cuisine filter
    if (filters.cuisine.length) {
      filtered = filtered.filter(restaurant =>
        restaurant.types?.gmaps?.some(type => filters.cuisine.includes(type))
      );
    }

    // Apply radius filter from map center
    if (filters.radius) {
      filtered = filtered.filter(restaurant => {
        const distance = getDistance(
          mapCenter.lat,
          mapCenter.lng,
          restaurant.location.gmaps.lat,
          restaurant.location.gmaps.lng
        );
        return distance <= filters.radius;
      });
    }

    setFilteredRestaurants(filtered);
  }, [restaurants, filters, searchQuery, mapCenter]);

  const handleBoundsChanged = (map) => {
    if (!map || skipUpdate) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const newCenter = map.getCenter();
    const newCenterObj = { lat: newCenter.lat(), lng: newCenter.lng() };

    if (
      newCenterObj.lat !== mapCenter.lat ||
      newCenterObj.lng !== mapCenter.lng
    ) {
      setMapCenter(newCenterObj);
    }
  };

  // Utility functions
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const createMarkerIcon = (IconComponent, color, size) => {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      <IconComponent color={color} width={size} height={size} />
    );
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  const getPriceLevel = (priceObj) => {
    if (!priceObj || !priceObj.gmaps || !priceObj.gmaps.normalized) return "N/A";
    const level = priceObj.gmaps.normalized;
    return "$".repeat(level);
  };

  const getRestaurantAddress = (restaurant) => {
    if (!restaurant || !restaurant.location) return "Address not available";

    if (restaurant.location.address) {
      return restaurant.location.address;
    }
    if (restaurant.location.gmaps) {
      if (typeof restaurant.location.gmaps.address === 'string') {
        return restaurant.location.gmaps.address;
      }
      return `${restaurant.location.gmaps.lat}, ${restaurant.location.gmaps.lng}`;
    }
    if (restaurant.location.yelp && restaurant.location.yelp.address) {
      const yelpAddr = restaurant.location.yelp.address;
      return [
        yelpAddr.address1,
        yelpAddr.address2,
        `${yelpAddr.city}, ${yelpAddr.state} ${yelpAddr.zip_code}`
      ].filter(Boolean).join(", ");
    }
    return "Address not available";
  };

  const handleMarkerClick = async (restaurant) => {
    setSkipUpdate(true);
    const location = {
      lat: restaurant.location.gmaps.lat,
      lng: restaurant.location.gmaps.lng,
      address: restaurant.location.gmaps.address
    };

    setSelectedRestaurant({
      ...restaurant,
      location
    });

    try {
      const response = await fetch(
        `http://localhost:8000/restaurant-photo/${restaurant.additional_info.gmaps.place_id}`
      );
      if (!response.ok) throw new Error("Failed to fetch photo");
      const data = await response.json();

      setSelectedRestaurant((prev) => ({
        ...prev,
        image: data.photo_url || "/api/placeholder/400/320"
      }));
    } catch (err) {
      console.error("Error fetching restaurant photo:", err.message);
      setSelectedRestaurant((prev) => ({
        ...prev,
        image: "/api/placeholder/400/320"
      }));
    }

    setTimeout(() => setSkipUpdate(false), 1000);
  };

  const fetchPlaylists = async () => {
    if (!userData) {
      console.error("User is not logged in.");
      return;
    }

    setLoadingPlaylists(true);
    try {
      const response = await fetch(
        `http://localhost:8000/users/${userData.username}/lists`
      );
      if (!response.ok) throw new Error("Failed to fetch playlists");
      const data = await response.json();
      setPlaylists(data);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    } finally {
      setLoadingPlaylists(false);
    }
  };
  const truncateText = (text, maxLength = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleAddToPlaylist = async (listId) => {
    if (!selectedRestaurant) return;

    try {
      const response = await fetch(
        `http://localhost:8000/users/${userData.username}/lists/${listId}/restaurants/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            place_id: selectedRestaurant.additional_info.gmaps.place_id
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to add restaurant to playlist.");
      }

      const data = await response.json();
      setMessageModal({
        show: true,
        message: `"${selectedRestaurant.name.gmaps}" has been added to the playlist!`,
      });

      setShowModal(false);
    } catch (err) {
      console.error("Error adding to playlist:", err);
      setMessageModal({
        show: true,
        message: "Failed to add the restaurant. Please try again.",
      });
    }
  };

  const PlaylistModal = ({ show, onClose, playlists, onAdd }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add to Playlist
          </h2>
          {playlists.length > 0 ? (
            <ul className="space-y-2">
              {playlists.map((playlist) => (
                <li
                  key={playlist.id}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-700">{playlist.name}</span>
                  <button
                    onClick={() => onAdd(playlist.id)}
                    className="px-3 py-1 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You don't have any playlists yet.</p>
          )}
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <MapIcon className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 font-semibold">Error loading maps</p>
        <p className="text-gray-600 mt-2">Please check your internet connection</p>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative p-4 bg-gray-50">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md">
        <div className="mx-4 bg-white rounded-full shadow-lg flex">
          <div className="flex-1 flex items-center px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants..."
              className="w-full px-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          cuisineOptions={cuisineOptions}
          onClose={() => setShowFilters(false)}
        />
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={16}
        onLoad={(map) => setMapRef(map)}
        onIdle={() => handleBoundsChanged(mapRef)}
        onClick={() => setSelectedRestaurant(null)}
        options={{
          styles: mapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {/* NYU Location Marker */}
        <MarkerF
          position={NYU_LOCATION}
          icon={{
            url: createMarkerIcon(MapPin, "#6B7280", 40),
            scaledSize: new window.google.maps.Size(25, 25),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(12.5, 40),
          }}
          label={{
            text: "NYU",
            className: "bg-white mt-16 px-2 py-1 rounded-md shadow-sm text-gray-600 font-bold",
            fontSize: "12px",
            anchor: new window.google.maps.Point(20, -10),
          }}
        />

        {/* User Location Marker */}
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={{
              url: createMarkerIcon(MapPin, "#3B82F6", 40),
              scaledSize: new window.google.maps.Size(25, 25),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(12.5, 40),
            }}
            label={{
              text: "You",
              className: "bg-white mt-16 px-2 py-1 rounded-md shadow-sm text-blue-500 font-bold",
              fontSize: "12px",
              anchor: new window.google.maps.Point(20, -10),
            }}
          />
        )}

        {/* Restaurant Markers */}
        {filteredRestaurants.map((restaurant) => {
          const lat = restaurant.location.gmaps.lat;
          const lng = restaurant.location.gmaps.lng;

          if (!lat || !lng) return null;

          return (
            <MarkerF
              key={restaurant.additional_info.gmaps.place_id}
              position={{ lat, lng }}
              icon={{
                url: createMarkerIcon(MapPin, "#f97316", 40),
                scaledSize: new window.google.maps.Size(25, 25),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(12.5, 40),
              }}
              label={{
                text: truncateText(restaurant.name.gmaps),
                className: "bg-white mt-16 px-2 py-1 rounded-md shadow-sm text-gray-800 font-medium",
                fontSize: "15px",
                anchor: new window.google.maps.Point(20, -10),
              }}
              onClick={() => handleMarkerClick(restaurant)}
            />
          );
        })}

        {/* Info Window for Selected Restaurant */}
        {selectedRestaurant && (
          <InfoWindowF
            position={{
              lat: selectedRestaurant.location.lat,
              lng: selectedRestaurant.location.lng,
            }}
            options={{
              pixelOffset: new window.google.maps.Size(0, -27),
            }}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <div className="w-68 p-4 bg-white rounded-lg">
              <h3 className="text-xl font-bold mb-2 text-center">
                {selectedRestaurant.name.gmaps}
              </h3>

              <div
                className="h-32 mb-4 bg-gray-200 rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(${selectedRestaurant.image || '/api/placeholder/400/320'})`
                }}
              />

              <p className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                {getRestaurantAddress(selectedRestaurant)}
              </p>

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-medium">
                    {selectedRestaurant.ratings?.gmaps?.rating || 'N/A'}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({selectedRestaurant.ratings?.gmaps?.total_ratings || 0})
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                  <span>{getPriceLevel(selectedRestaurant.price_level)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {(selectedRestaurant.types?.gmaps || []).slice(0, 3).map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                  >
                    {type.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  fetchPlaylists();
                  setShowModal(true);
                }}
                className="w-full bg-orange-500 mt-4 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
              >
                Add to My Playlist
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailedModal(true);
                }}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors mt-2"
              >
                View Details
              </button>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Stats Panel */}
      <div className="absolute bottom-20 left-10 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Statistics</h3>
        <p>Showing: {filteredRestaurants.length} of {restaurants.length} restaurants</p>
        <p>Average Rating: {
          (filteredRestaurants.reduce((acc, r) => acc + (r.ratings?.gmaps?.rating || 0), 0) /
            filteredRestaurants.length || 0).toFixed(1)
        } ⭐</p>
      </div>

      {/* Legend */}
      <div className="absolute top-10 left-10 bg-white p-3 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <span className="text-sm text-gray-600">NYU Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-600">Restaurants</span>
          </div>
          {userLocation && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Your Location</span>
            </div>
          )}
        </div>
      </div>

      <PlaylistModal
        show={showModal}
        onClose={() => setShowModal(false)}
        playlists={playlists}
        onAdd={handleAddToPlaylist}
      />

      <MessageWindow
        show={messageModal.show}
        message={messageModal.message}
        onClose={() => setMessageModal({ show: false, message: "" })}
      />
      <RestaurantDetailsModal
        show={showDetailedModal}
        onClose={() => setShowDetailedModal(false)}
        restaurant={selectedRestaurant}
      />
    </div>
  );
};

const FilterPanel = ({
  filters,
  setFilters,
  cuisineOptions,
  onClose
}) => (
  <div className="absolute top-20 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs w-full z-20">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold">Filters</h3>
      <button onClick={onClose}>
        <X className="w-4 h-4" />
      </button>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Minimum Rating</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
          className="w-full"
        />
        <span className="text-sm">{filters.minRating} stars</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price Level</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(price => (
            <button
              key={price}
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  priceLevel: prev.priceLevel.includes(price)
                    ? prev.priceLevel.filter(p => p !== price)
                    : [...prev.priceLevel, price]
                }));
              }}
              className={`px-3 py-1 rounded ${filters.priceLevel.includes(price)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200'
                }`}
            >
              {'$'.repeat(price)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Search Radius</label>
        <select
          value={filters.radius}
          onChange={(e) => setFilters(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
          className="w-full p-2 border rounded"
        >
          <option value={500}>500m</option>
          <option value={1000}>1km</option>
          <option value={2000}>2km</option>
          <option value={5000}>5km</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cuisine Types</label>
        <div className="max-h-40 overflow-y-auto">
          {cuisineOptions.map(cuisine => (
            <label key={cuisine} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.cuisine.includes(cuisine)}
                onChange={() => {
                  setFilters(prev => ({
                    ...prev,
                    cuisine: prev.cuisine.includes(cuisine)
                      ? prev.cuisine.filter(c => c !== cuisine)
                      : [...prev.cuisine, cuisine]
                  }));
                }}
              />
              <span className="text-sm">{cuisine.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => setFilters({
          minRating: 0,
          priceLevel: [],
          cuisine: [],
          radius: 1000,
        })}
        className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
      >
        Reset Filters
      </button>
    </div>
  </div>
);

export default MapComponent;