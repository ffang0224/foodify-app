import React, { useState } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { MapPin, Search, Loader2, MapIcon } from "lucide-react";

// Disclaimer: This component has been partially generated using Claude.
const MapComponent = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  // NYU Washington Square Park location
  const NYU_LOCATION = { lat: 40.7295, lng: -73.9965 };

  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 64px)",
    borderRadius: "12px",
    overflow: "hidden",
  };

  // Enhanced map options with more detailed styling
  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a1c4fd" }, { lightness: 40 }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }, { weight: 2 }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#f0f0f0" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#dadada" }],
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4a4a4a" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#c5e8c5" }],
      },
    ],
  };

  // Custom marker icon
  const markerIcon = isLoaded
    ? {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#f97316", // Orange color to match Foodify theme
        fillOpacity: 1,
        strokeColor: "#ea580c",
        strokeWeight: 2,
        scale: 8,
      }
    : null;

  // Handle loading error with styled error message
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

  // Enhanced loading state with animation
  if (!isLoaded) {
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

      {/* Location info card - shows when a location is selected */}
      {selectedLocation && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-sm">
          <div className="mx-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">NYU Campus</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Washington Square Park, New York
                </p>
              </div>
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* Main map component */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={NYU_LOCATION}
        zoom={15}
        options={options}
        onClick={() => setSelectedLocation(null)}
      >
        <MarkerF
          position={NYU_LOCATION}
          icon={markerIcon}
          onClick={() => setSelectedLocation(NYU_LOCATION)}
        />
      </GoogleMap>

      {/* Legend or additional controls could go here */}
      <div className="absolute bottom-8 right-8 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-sm text-gray-600">Current Location</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
