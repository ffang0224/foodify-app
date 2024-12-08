import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Map,
  List,
  UtensilsCrossed,
  Bell,
  Search,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Plus,
  User,
  Home,
  Trophy,
} from "lucide-react";
import { useAuthUser } from "./hooks/useAuthUser";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

// Regular imports remain the same
import DisplayUser from "./components/DisplayUser.js";
import sampleRestaurantData from "./sample-data/sampleRestaurantData.js";
import IndivRestaurantCard from "./components/IndivRestaurantCard.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import MapComponent from "./components/map.js";
import ListsPage from "./components/ListsPage.js";
import { RestaurantCollectionWithNav } from "./components/IndivPlaylist.js";
import CreatePlaylist from "./components/CreatePlaylist";
import ViewPlaylist from "./components/ViewPlaylist";
import ProfilePage from "./components/ProfilePage";
import IconDropdown from "./components/IconDropdown";
import SettingsPage from "./components/settings.js";
import RefreshCacheButton from "./components/refreshRestaurantCache.js";
import EditPlaylist from "./components/EditPlaylist";
import HelpPage from "./components/HelpPage";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuthUser();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isRestaurantPage = location.pathname.includes("/restaurant");
  const isListsPage = location.pathname === "/lists";
  const isMapPage = location.pathname === "/map";

  const mainMenuItems = [
    { icon: Home, label: "Home", path: "/map" },
    { icon: List, label: "My Lists", path: "/lists" },
    { icon: Search, label: "Search Foodies", path: "/DisplayUser" },
  ];

  const renderCreatePlaylist = () => {
    if (isListsPage) {
      return (
        <button
          onClick={() => navigate("/create-playlist")}
          className="w-full flex items-center px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200"
        >
          <Plus className="w-5 h-5 text-orange-500 dark:text-orange-400" />
          {isExpanded && (
            <span className="ml-4 font-medium">Create Playlist</span>
          )}
        </button>
      );
    }
    return null;
  };

  const renderBackNavigation = () => {
    if (isRestaurantPage) {
      return (
        <button
          onClick={() => navigate("/lists")}
          className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          {isExpanded && (
            <span className="ml-4 text-sm text-gray-600 dark:text-gray-300">
              Back to Lists
            </span>
          )}
        </button>
      );
    }
    return null;
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
      <div
        className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
        shadow-lg transition-all duration-300 ease-in-out relative ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center">
          <UtensilsCrossed
            className={`w-8 h-8 text-orange-500 transition-transform duration-300 ${
              isExpanded ? "" : "rotate-180"
            }`}
            onClick={() => navigate("/map")}
          />
          {isExpanded && (
            <h1
              className="text-2xl font-bold ml-3 text-gray-800 dark:text-white tracking-tight cursor-pointer"
              onClick={() => navigate("/map")}
            >
              Foodify
            </h1>
          )}
        </div>

        {/* Toggle Button - Updated positioning */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-8 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <ChevronLeft
            className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
              isExpanded ? "" : "rotate-180"
            }`}
          />
        </button>

        {renderBackNavigation()}

        {/* Main Navigation */}
        <div className="flex-1 px-4 py-4">
          <div className="space-y-2">
            {mainMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActivePath(item.path)
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 ${
                    isActivePath(item.path)
                      ? "text-orange-500 dark:text-orange-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                {isExpanded && (
                  <span className="ml-4 font-medium">{item.label}</span>
                )}
              </button>
            ))}
            {renderCreatePlaylist()}
          </div>
        </div>

        {/* Notification and Theme Section */}
        <div className="px-4 space-y-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
            </div>
            {isExpanded && (
              <span className="ml-4 font-medium text-gray-600 dark:text-gray-300">
                Notifications
              </span>
            )}
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => navigate("/achievements")}
            className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <Trophy className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            {isExpanded && (
              <span className="ml-4 font-medium text-gray-600 dark:text-gray-300">
                Achievements
              </span>
            )}
          </button>

          <ThemeToggle />
        </div>

        {/* User Profile Section - Updated dropdown positioning */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 mt-auto">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-gray-900 bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400 font-semibold text-lg">
                  {userData?.firstName?.[0]}
                  {userData?.lastName?.[0]}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900" />
              </div>
              {isExpanded && (
                <div className="ml-4 text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {userData?.firstName} {userData?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{userData?.username}
                  </p>
                </div>
              )}
            </button>

            {/* Updated User Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className={`absolute bottom-full mb-2 ${
                  isExpanded
                    ? "left-0 w-full px-4"
                    : "left-full ml-2 w-48 -translate-y-12"
                }`}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 w-full">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate("/help");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePageWithNav = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProfilePage />
    </div>
  </div>
);

const MapView = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MapComponent />
    </div>
  </div>
);

const ListsPageWithNav = ({ userPlaylists }) => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <NavBar />
    <div className="flex-grow">
      <ListsPage />
    </div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {" "}
        {/* Add root dark mode class */}
        <Router>
          <Routes>
            <Route path="/help" element={<HelpPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/profile" element={<ProfilePageWithNav />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/DisplayUser" element={<DisplayUser />} />
            <Route path="/lists/:listId/edit" element={<EditPlaylist />} />
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
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  <NavBar />
                  <div className="max-w-7xl mx-auto px-4 py-8">
                    <IndivRestaurantCard />
                  </div>
                </div>
              }
            />
            <Route path="/create-playlist" element={<CreatePlaylist />} />
            <Route path="/lists/:listId" element={<ViewPlaylist />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
