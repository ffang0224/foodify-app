import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import DisplayUser from "./components/DisplayUser.js"; // Make sure the correct path to your DisplayUser component is used
import sampleRestaurantData from "./sample-data/sampleRestaurantData.js";
import IndivRestaurantCard from "./components/IndivRestaurantCard.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import MapComponent from "./components/map.js";
import ListsPage from "./components/ListsPage.js";
import { RestaurantCollectionWithNav } from "./components/IndivPlaylist.js";
import { ArrowLeft, ArrowRight, UtensilsCrossed } from "lucide-react";
import CreatePlaylist from "./components/CreatePlaylist";
import ViewPlaylist from "./components/ViewPlaylist"; // Import ViewPlaylist
import ProfilePage from "./components/ProfilePage"; 
import IconDropdown from "./components/IconDropdown";
import SettingsPage from "./components/settings.js";
import RefreshCacheButton from "./components/refreshRestaurantCache.js";
// Ensure to import the HelpPage
import HelpPage from "./components/HelpPage"; 
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isRestaurantPage = location.pathname.includes("/restaurant");
  const isMapPage = location.pathname === "/map";
  const isListsPage = location.pathname === "/lists";

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center hover:cursor-pointer" onClick={() => navigate("/map")}>
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-bold ml-2 text-orange-500 tracking-tight">
              Foodify
            </h1>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            {isRestaurantPage && (
              <button
                onClick={() => navigate("/lists")}
                className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Lists</span>
              </button>
            )}
            {isListsPage && (
              <>
                <button
                  onClick={() => navigate("/map")}
                  className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span>Back to Map</span>
                </button>
                <button
                  onClick={() => navigate("/create-playlist")}
                  className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
                >
                  <span>Create Playlist</span>
                </button>
              </>
            )}
            {isMapPage && (
              <div>
                <button
                  onClick={() => navigate("/lists")}
                  className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
                >
                  <span>Lists</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}

            {/* Add Search Other Foodies Section */}
            <button
              onClick={() => navigate("/DisplayUser")}
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              <span>Search Other Foodies</span>
            </button>

            {/* User Icon and Dropdown */}
            <div className="relative ml-4">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none"
              >
                <img 
                  src="https://static.vecteezy.com/system/resources/thumbnails/019/896/012/small_2x/female-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png" 
                  alt="User" 
                  className="w-10 h-10 rounded-full"
                />
              </button>
              <div 
                className={`absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48 ${isDropdownOpen ? 'block' : 'hidden'}`}
                style={{ marginTop: '8px', zIndex: 50 }}  // Adjust margin-top and ensure dropdown is above other elements
              >
                <ul className="py-2 text-gray-700">

                  <li>
                    <button 
                      onClick={() => navigate("/profile")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 transition-colors duration-200"
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate("/settings")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 transition-colors duration-200"
                    >
                      Account Settings
                    </button>
                  </li>
                  {/* Move Help to the dropdown */}
                  <li>
                    <button 
                      onClick={() => navigate("/help")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 transition-colors duration-200"
                    >
                      Help
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => alert("Logging out...")} // You can handle actual logout here
                      className="block px-4 py-2 text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



// Profile Page with navigation
const ProfilePageWithNav = () => (
  <div className="min-h-screen bg-gray-50">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProfilePage />
    </div>
  </div>
);

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
const ListsPageWithNav = ({ userPlaylists }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <NavBar />
    <div className="flex-grow">
      <ListsPage />
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Add HelpPage Route */}
        <Route path="/help" element={<HelpPage />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Pages with NavBar included */}
        <Route path="/map" element={<MapView />} />
        <Route path="/profile" element={<ProfilePageWithNav />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/DisplayUser" element={<DisplayUser />} />

        <Route
          path="/lists"
          element={<ListsPageWithNav />}
        />
        
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

        {/* Playlist routes */}
        <Route
          path="/create-playlist"
          element={<CreatePlaylist />}
        />
        <Route
          path="/lists/:listId"
          element={<ViewPlaylist />}
        />
      </Routes>
    </Router>
  );
};

export default App;
