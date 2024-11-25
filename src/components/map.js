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
        console.log("Fetched restaurants:", data); // Debugging output
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
        url: createMarkerIcon(MapPin, "#f97316", 40), // MapPin from lucide-react
        scaledSize: new window.google.maps.Size(25, 25),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 40), // Align pin tip
      }
    : null;

  const handleBoundsChanged = (map) => {
    if (!map) return; // Ensure the map object is valid
    const bounds = map.getBounds();
    if (!bounds) return; // Ensure bounds are available

    // Update map center
    const center = map.getCenter();
    setMapCenter({ lat: center.lat(), lng: center.lng() });

    console.log("Current bounds:", bounds); // Debugging output

    // Filter and sort restaurants
    const topRestaurants = restaurants
      .filter((restaurant) => {
        const { lat, lng } = restaurant.location; // Ensure correct access to lat/lng
        const isInBounds = bounds.contains(
          new window.google.maps.LatLng(lat, lng)
        ); // Ensure compatibility with Google Maps LatLng
        console.log(`${restaurant.name} in bounds:`, isInBounds); // Debugging output
        return isInBounds;
      })
      .sort(
        (a, b) =>
          b.rating - a.rating || b.user_ratings_total - a.user_ratings_total
      )
      .slice(0, 80); // how many restaurants to display

    console.log("Filtered Restaurants:", topRestaurants); // Debugging filtered results
    setFilteredRestaurants(topRestaurants);
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

      {/* Restaurant info card */}
      {selectedRestaurant && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-sm">
          <div className="mx-4 bg-white rounded-lg shadow-lg p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">
                  {selectedRestaurant.name}
                </h3>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedRestaurant.address}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>
                    {selectedRestaurant.rating} (
                    {selectedRestaurant.user_ratings_total})
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{getPriceLevel(selectedRestaurant.price_level)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedRestaurant.types.slice(0, 3).map((type, index) => (
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
        </div>
      )}

      {/* Main map component */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter} // Use dynamic center
        zoom={16}
        options={options}
        onLoad={(map) => setMapRef(map)} // Store the map instance
        onIdle={() => handleBoundsChanged(mapRef)} // Filter on viewport change
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
            onClick={() => setSelectedRestaurant(restaurant)}
          />
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
