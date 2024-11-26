import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { useAuthUser } from "../hooks/useAuthUser";
import MessageWindow from "./MessageWindow"; // Adjust the path as per your project structure

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
        setRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []); // Dependencies are empty, runs only once on mount

  const getPriceLevel = (level) => {
    return level ? "$$$$".slice(0, level) : "N/A";
  };

  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 64px)",
    borderRadius: "12px",
    overflow: "hidden",
  };

  // Map options remain the same
  const options = {
    // ... your existing options ...
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
          body: JSON.stringify({ place_id: selectedRestaurant.place_id }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.detail || "Failed to add restaurant to playlist."
        );
      }

      const data = await response.json();

      // Show success message
      setMessageModal({
        show: true,
        message: `"${selectedRestaurant.name}" has been added to the playlist!`,
      });

      setShowModal(false);
    } catch (err) {
      console.error("Error adding to playlist:", err.message);

      // Show error message
      setMessageModal({
        show: true,
        message: "Failed to add the restaurant. Please try again.",
      });
    }
  };

  // Function to generate Base64 marker icon using MapPin
  const createMarkerIcon = (IconComponent, color, size) => {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      <IconComponent color={color} width={size} height={size} />
    );
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  // New custom marker icon using MapPin
  const restaurantMarkerIcon = isLoaded
    ? {
        url: createMarkerIcon(MapPin, "#f97316", 40), // Custom MapPin icon
        scaledSize: new window.google.maps.Size(25, 25), // Adjust size
        origin: new window.google.maps.Point(0, 0), // Top-left corner
        anchor: new window.google.maps.Point(12.5, 40), // Pin tip
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
        const { lat, lng } = restaurant.location;
        return bounds.contains(new window.google.maps.LatLng(lat, lng));
      })
      .sort(
        (a, b) =>
          b.rating - a.rating || b.user_ratings_total - a.user_ratings_total
      )
      .slice(0, 80);

    setFilteredRestaurants(topRestaurants);
  };

  <PlaylistModal
    show={showModal}
    onClose={() => setShowModal(false)}
    playlists={playlists}
    onAdd={(listId) => handleAddToPlaylist(listId)}
  />;

  // Wrap your marker click handler
  const handleMarkerClick = (restaurant) => {
    setSkipUpdate(true); // Disable map updates temporarily
    setSelectedRestaurant(restaurant);
    setTimeout(() => setSkipUpdate(false), 1000); // Re-enable updates after 1 second
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <MapIcon className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 font-semibold">Error loading maps</p>
        <p className="text-gray-600 mt-2">
          Please check your internet connection
        </p>
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
      {/* Search bar overlay */}
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
      {/* Main map component */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter} // Ensure this doesn't change unexpectedly
        zoom={16}
        options={options}
        onLoad={(map) => setMapRef(map)}
        onIdle={() => handleBoundsChanged(mapRef)}
        onClick={() => setSelectedRestaurant(null)}
      >
        {/* NYU Marker */}
        <MarkerF
          position={NYU_LOCATION}
          icon={{
            url: createMarkerIcon(MapPin, "#6B7280", 40), // Custom gray icon
            scaledSize: new window.google.maps.Size(25, 25),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(12.5, 40), // Align pin tip
          }}
        />

        {/* Restaurant Markers */}
        {filteredRestaurants.map((restaurant) => (
          <MarkerF
            key={restaurant.place_id}
            position={{
              lat: restaurant.location.lat,
              lng: restaurant.location.lng,
            }}
            icon={restaurantMarkerIcon}
            onClick={() => handleMarkerClick(restaurant)}
          />
        ))}

        {/* Enhanced InfoWindow for Selected Restaurant */}
        {selectedRestaurant &&
          (console.log("Rendering InfoWindow for:", selectedRestaurant),
          (
            <InfoWindowF
              position={{
                lat: selectedRestaurant.location.lat,
                lng: selectedRestaurant.location.lng,
              }}
              options={{
                pixelOffset: new window.google.maps.Size(0, -27), // Move upward
              }}
              onCloseClick={() => setSelectedRestaurant(null)}
            >
              <div
                style={{
                  maxWidth: "300px",
                  padding: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  backgroundColor: "#ffffff",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
              >
                {/* Header Section */}
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  {selectedRestaurant.name}
                </h3>

                {/* Image Section */}
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    marginBottom: "10px",
                    backgroundColor: "#f2f2f2",
                    borderRadius: "8px",
                    backgroundImage: `url(${
                      selectedRestaurant.image || "placeholder.jpg"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                {/* Address Section */}
                <p
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MapPin style={{ marginRight: "5px" }} size={14} />
                  {selectedRestaurant.address}
                </p>

                {/* Rating and Price Level */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Star
                      style={{ marginRight: "5px" }}
                      size={14}
                      color="#f59e0b"
                    />
                    <span>{selectedRestaurant.rating}</span>
                    <span style={{ marginLeft: "5px", color: "#888" }}>
                      ({selectedRestaurant.user_ratings_total})
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <DollarSign style={{ marginRight: "5px" }} size={14} />
                    <span>{getPriceLevel(selectedRestaurant.price_level)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                    marginBottom: "10px",
                  }}
                >
                  {selectedRestaurant.types.slice(0, 3).map((type, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "12px",
                        padding: "5px 8px",
                        borderRadius: "20px",
                        backgroundColor: "#f3f3f3",
                        color: "#666",
                      }}
                    >
                      {type.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    fetchPlaylists();
                    setShowModal(true);
                  }}
                  className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md"
                >
                  Add to Playlist
                </button>
              </div>
            </InfoWindowF>
          ))}
      </GoogleMap>
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
      ;{/* Legend */}
      <div
        className="absolute bottom-10 right-20 bg-white rounded-lg shadow-lg p-3" // Adjust `right` and `bottom` values
      >
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <span className="text-sm text-gray-600">NYU Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm text-gray-600">Restaurants</span>
          </div>
        </div>
      </div>
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
