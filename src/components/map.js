import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";

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

  // Custom marker icon for restaurants
  // const restaurantMarkerIcon = isLoaded
  //   ? {
  //       path: window.google.maps.SymbolPath.CIRCLE,
  //       fillColor: "#f97316",
  //       fillOpacity: 1,
  //       strokeColor: "#ea580c",
  //       strokeWeight: 2,
  //       scale: 8,
  //     }
  //   : null;

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
            ...restaurantMarkerIcon,
            fillColor: "#4b5563", // Different color for NYU marker
            strokeColor: "#374151",
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
                lat: selectedRestaurant.location.lat + 0.0005,
                lng: selectedRestaurant.location.lng,
              }}
              options={{
                pixelOffset: new window.google.maps.Size(0, -25), // Move upward
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
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#fff",
                    backgroundColor: "#f97316",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    alert(
                      `Added "${selectedRestaurant.name}" to your playlist!`
                    )
                  }
                >
                  Add to Playlist
                </button>
              </div>
            </InfoWindowF>
          ))}
      </GoogleMap>

      {/* Legend */}
      <div className="absolute bottom-8 right-8 bg-white rounded-lg shadow-lg p-3">
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

export default MapComponent;
