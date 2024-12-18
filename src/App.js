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

// Component imports
import RestaurantTinder from "./components/RestaurantTinder";
import DisplayUser from "./components/DisplayUser";
import sampleRestaurantData from "./sample-data/sampleRestaurantData";
import IndivRestaurantCard from "./components/IndivRestaurantCard";
import Login from "./components/login";
import Register from "./components/register";
import MapComponent from "./components/map";
import ListsPage from "./components/ListsPage";
import { RestaurantCollectionWithNav } from "./components/IndivPlaylist";
import CreatePlaylist from "./components/CreatePlaylist";
import ViewPlaylist from "./components/ViewPlaylist";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/settings";
import EditPlaylist from "./components/EditPlaylist";
import HelpPage from "./components/HelpPage";
import AchievementsPage from "./components/achievements";
import ResponsiveLayout from "./components/ResponsiveLayout";


const PrivateRoute = ({ children }) => {
  const { userData, loading } = useAuthUser();
  const navigate = useNavigate();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  // If no user data, redirect to login
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected route
  return children;
};
// Export NavBar so it can be used by ResponsiveLayout
export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuthUser();
  // Always expanded for desktop
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isRestaurantPage = location.pathname.includes("/restaurant");
  const isListsPage = location.pathname === "/lists";

  const mainMenuItems = [
    { icon: Home, label: "Home", path: "/map" },
    { icon: List, label: "My Lists", path: "/lists" },
    { icon: UtensilsCrossed, label: "Discover", path: "/discover" },
    { icon: Search, label: "Search Foodies", path: "/DisplayUser" },
  ];

  const renderCreatePlaylist = () => {
    if (!isListsPage) return null;

    return (
      <button
        onClick={() => navigate("/create-playlist")}
        className="w-full flex items-center px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200"
      >
        <Plus className="w-5 h-5 text-orange-500 dark:text-orange-400" />
        <span className="ml-4 font-medium">Create Playlist</span>
      </button>
    );
  };

  const renderBackNavigation = () => {
    if (!isRestaurantPage) return null;

    return (
      <button
        onClick={() => navigate("/lists")}
        className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="ml-4 text-sm text-gray-600 dark:text-gray-300">
          Back to Lists
        </span>
      </button>
    );
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
        shadow-lg transition-all duration-300 ease-in-out relative w-64">
        {/* Logo Section */}
        <div className="p-6 flex items-center">
          <UtensilsCrossed
            className="w-8 h-8 text-orange-500 cursor-pointer"
            onClick={() => navigate("/map")}
          />
          <h1
            className="text-2xl font-bold ml-3 text-gray-800 dark:text-white tracking-tight cursor-pointer"
            onClick={() => navigate("/map")}
          >
            Foodify
          </h1>
        </div>

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
                <span className="ml-4 font-medium">{item.label}</span>
              </button>
            ))}
            {renderCreatePlaylist()}
          </div>
        </div>

        {/* Notification and Theme Section */}
        <div className="px-4 space-y-2">
        

          {/* Achievements Button */}
          <button
            onClick={() => navigate("/achievements")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              isActivePath("/achievements")
                ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            <Trophy
              className={`w-6 h-6 ${
                isActivePath("/achievements")
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span className="ml-4 font-medium text-gray-600 dark:text-gray-300">
              Achievements
            </span>
          </button>

          <ThemeToggle />
        </div>

        {/* User Profile Section */}
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
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{userData?.username}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-full px-4">
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

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route path="/map" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <MapComponent />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <ProfilePage />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <SettingsPage />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/DisplayUser" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <DisplayUser />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/lists/:listId/edit" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <EditPlaylist />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/lists" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <ListsPage />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/restaurants" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <RestaurantCollectionWithNav data={sampleRestaurantData} />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/restaurant/:restaurantId" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <IndivRestaurantCard />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/achievements" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <AchievementsPage />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/create-playlist" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <CreatePlaylist />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/lists/:listId" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <ViewPlaylist />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/discover" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <RestaurantTinder />
                </ResponsiveLayout>
              </PrivateRoute>
            } />
            <Route path="/help" element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <HelpPage />
                </ResponsiveLayout>
              </PrivateRoute>
            } />

            {/* Catch-all route for 404s */}
            <Route path="*" element={
              <Navigate to="/login" replace />
            } />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;