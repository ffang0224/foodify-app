import React, { useState } from "react";
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
import CreatePlaylist from "./components/CreatePlaylist";
import ViewPlaylist from "./components/ViewPlaylist"; // Import ViewPlaylist
import ProfilePage from "./components/ProfilePage"; 
import IconDropdown from "./components/IconDropdown";

// Navigation bar component with conditional rendering
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
              <button
                onClick={() => navigate("/lists")}
                className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
              >
                <span>Lists</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}

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
              <IconDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
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
      <ListsPage userPlaylists={userPlaylists} />
    </div>
  </div>
);

const App = () => {
  const [userPlaylists, setUserPlaylists] = useState([]);

  // Function to add a new playlist
  const addNewPlaylist = (playlist) => {
    setUserPlaylists((prevPlaylists) => [...prevPlaylists, playlist]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/profile" element={<ProfilePageWithNav />} />
        <Route
          path="/lists"
          element={<ListsPageWithNav userPlaylists={userPlaylists} />}
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
        {/* New route for CreatePlaylist */}
        <Route
          path="/create-playlist"
          element={<CreatePlaylist onSave={addNewPlaylist} />}
        />
        {/* Route to view individual playlist */}
        <Route
          path="/playlist/:playlistId"
          element={<ViewPlaylist userPlaylists={userPlaylists} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
