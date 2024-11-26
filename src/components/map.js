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
} from "lucide-react";

const MapComponent = () => {
  const { userData } = useAuthUser();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // NYU Washington Square Park location
  const NYU_LOCATION = { lat: 40.7295, lng: -73.9965 };

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [mapCenter, setMapCenter] = useState(NYU_LOCATION);

  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [messageModal, setMessageModal] = useState({
    show: false,
    message: "",
  });

  // Fetch restaurants from your database
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:8000/restaurants");
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        const data = await response.json();
        console.log(data)
        setRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const getPriceLevel = (priceObj) => {
    if (!priceObj || !priceObj.gmaps || !priceObj.gmaps.normalized) return "N/A";
    const level = priceObj.gmaps.normalized;
    return "$$$$".slice(0, level);
  };

  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 64px)",
    borderRadius: "12px",
    overflow: "hidden",
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
      console.error("Error adding to playlist:", err.message);
      setMessageModal({
        show: true,
        message: "Failed to add the restaurant. Please try again.",
      });
    }
  };

  const createMarkerIcon = (IconComponent, color, size) => {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      <IconComponent color={color} width={size} height={size} />
    );
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  const restaurantMarkerIcon = isLoaded
    ? {
      url: createMarkerIcon(MapPin, "#f97316", 40),
      scaledSize: new window.google.maps.Size(25, 25),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(12.5, 40),
    }
    : null;

  const [skipUpdate, setSkipUpdate] = useState(false);

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

    const topRestaurants = restaurants
      .filter((restaurant) => {
        const { lat, lng } = restaurant.location.gmaps;
        return bounds.contains(new window.google.maps.LatLng(lat, lng));
      })
      .sort(
        (a, b) =>
          b.ratings.gmaps.rating - a.ratings.gmaps.rating ||
          b.ratings.gmaps.total_ratings - a.ratings.gmaps.total_ratings
      )
      .slice(0, 80);

    setFilteredRestaurants(topRestaurants);
  };

  // Add this helper function at the component level
  const getRestaurantAddress = (restaurant) => {
    console.log(restaurant);
    if (!restaurant || !restaurant.location) return "Address not available";

    if(restaurant.location.address){
      return restaurant.location.address;
    }
    // For gmaps data
    if (restaurant.location.gmaps) {
      if (typeof restaurant.location.gmaps.address === 'string') {
        return restaurant.location.gmaps.address;
      }

      // If address is not a string, try to extract from coordinates
      return `${restaurant.location.gmaps.lat}, ${restaurant.location.gmaps.lng}`;
    }

    // Fallback to yelp address if available
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

    // Extract location from gmaps data
    const location = {
      lat: restaurant.location.gmaps.lat,
      lng: restaurant.location.gmaps.lng,
      address: restaurant.location.gmaps.address
    };

    setSelectedRestaurant({
      ...restaurant,
      location // Set the location properly
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
      // Set a placeholder image on error
      setSelectedRestaurant((prev) => ({
        ...prev,
        image: "/api/placeholder/400/320"
      }));
    }

    setTimeout(() => setSkipUpdate(false), 1000);
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
        <div className="mx-4 bg-white rounded-full shadow-lg">
          <div className="flex items-center px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for restaurants..."
              className="w-full px-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={16}
        onLoad={(map) => setMapRef(map)}
        onIdle={() => handleBoundsChanged(mapRef)}
        onClick={() => setSelectedRestaurant(null)}
      >
        <MarkerF
          position={NYU_LOCATION}
          icon={{
            url: createMarkerIcon(MapPin, "#6B7280", 40),
            scaledSize: new window.google.maps.Size(25, 25),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(12.5, 40),
          }}
        />

        {restaurants.map((restaurant, index) => {
          const lat = restaurant.location.gmaps.lat;
          const lng = restaurant.location.gmaps.lng;

          if (!lat || !lng) return null;

          return (
            <MarkerF
              key={restaurant.additional_info.gmaps.place_id || index}
              position={{ lat, lng }}
              icon={restaurantMarkerIcon}
              onClick={() => handleMarkerClick(restaurant)}
            />
          );
        })}

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
            <div className="max-w-sm p-4 bg-white rounded-lg shadow-lg">
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
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
              >
                Add to My Playlist
              </button>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      <div className="absolute bottom-10 right-10 bg-white p-3 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <span className="text-sm text-gray-600">NYU Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-600">Restaurants</span>
          </div>
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
    </div>
  );
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

export default MapComponent;