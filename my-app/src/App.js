import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import sampleRestaurantData from "./sampleRestaurantData";
import IndivRestaurantCard from "./IndivRestaurantCard";
import Login from "./login";
import Register from "./register";
import MapComponent from "./map.js";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Navigation bar component with conditional rendering
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRestaurantPage = location.pathname.includes("/restaurants");
  const isMapPage = location.pathname === "/map";

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* For restaurant pages, show back to map on the left */}
        {isRestaurantPage && (
          <button
            onClick={() => navigate("/map")}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Map</span>
          </button>
        )}
        {/* For map page, show restaurants on the right */}
        {isMapPage && (
          <div className="ml-auto">
            <button
              onClick={() => navigate("/restaurants")}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span>Restaurants</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
        {/* If we're not on either page, show empty div for spacing */}
        {!isRestaurantPage && !isMapPage && <div></div>}
      </div>
    </div>
  );
};
// Map view with navigation
const MapView = () => (
  <div className="min-h-screen bg-gray-50">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MapComponent />
    </div>
  </div>
);

// Restaurant Collection with navigation
const RestaurantCollectionWithNav = ({ data }) => (
  <div className="min-h-screen bg-gray-50">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((restaurant) => (
          <div
            key={restaurant.restaurantId}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={restaurant.images[0]}
              alt={`${restaurant.name}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">
                <Link
                  to={`/restaurant/${restaurant.restaurantId}`}
                  className="text-gray-900 hover:text-blue-600 transition-colors duration-200"
                >
                  {restaurant.name}
                </Link>
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Cuisine:</span>{" "}
                  {restaurant.cuisines}
                </p>
                <p>
                  <span className="font-medium">Price Range:</span>{" "}
                  {restaurant.priceRange}
                </p>
                <p>
                  <span className="font-medium">Popular Dishes:</span>{" "}
                  {restaurant.popularDishes.join(", ")}
                </p>
              </div>
              <a
                href="https://www.opentable.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Make a Reservation
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<MapView />} />
        <Route
          path="/restaurants"
          element={<RestaurantCollectionWithNav data={sampleRestaurantData} />}
        />
        <Route
          path="/restaurant/:restaurantId"
          element={
            <div className="min-h-screen bg-gray-50">
              <NavBar />
              <div className="max-w-7xl mx-auto px-4 py-8">
                <IndivRestaurantCard />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
