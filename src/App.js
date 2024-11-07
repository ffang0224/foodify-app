import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import sampleRestaurantData from "./sample-data/sampleRestaurantData.js";
import IndivRestaurantCard from "./components/IndivRestaurantCard.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import MapComponent from "./components/map.js";
import ListsPage from "./components/ListsPage.js";
import { RestaurantCollectionWithNav } from "./components/IndivPlaylist.js";
import { ArrowLeft, ArrowRight, UtensilsCrossed } from "lucide-react";

// Navigation bar component with conditional rendering
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRestaurantPage = location.pathname.includes("/restaurant");
  const isMapPage = location.pathname === "/map";
  const isListsPage = location.pathname === "/lists";

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-bold ml-2 text-orange-500 tracking-tight">
              Foodify
            </h1>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            {/* For restaurant pages, show back to lists */}
            {isRestaurantPage && (
              <button
                onClick={() => navigate("/lists")}
                className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Lists</span>
              </button>
            )}

            {/* For Lists page */}
            {isListsPage && (
              <button
                onClick={() => navigate("/map")}
                className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Map</span>
              </button>
            )}

            {/* For map page */}
            {isMapPage && (
              <button
                onClick={() => navigate("/lists")}
                className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
              >
                <span>Lists</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
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

// Lists Page with navigation
const ListsPageWithNav = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-grow">
        <ListsPage />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/lists" element={<ListsPageWithNav />} />
        <Route
          path="/restaurants"
          element={
            <RestaurantCollectionWithNav
              data={sampleRestaurantData}
              NavBar={NavBar}
            />
          }
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
