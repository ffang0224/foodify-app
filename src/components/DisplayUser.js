import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Library, Star, List, ArrowLeft, UtensilsCrossed } from "lucide-react";
import RestaurantListCard from "./ListCard";

const DisplayUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserLists, setSelectedUserLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch users and initial user details
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await fetch("https://foodify-backend-927138020046.us-central1.run.app/users");
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const userData = await usersResponse.json();
        
        // Sort users by points in descending order
        const sortedUsers = userData.sort((a, b) => {
          const pointsA = a.points?.generalPoints || 0;
          const pointsB = b.points?.generalPoints || 0;
          return pointsB - pointsA; // Descending order
        });
        
        setUsers(sortedUsers);

        // Select first user by default
        if (sortedUsers.length > 0) {
          await fetchUserDetails(sortedUsers[0].username);
        }
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch detailed user information and lists
  const fetchUserDetails = async (username) => {
    try {
      // Fetch user data
      const userResponse = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/users/${username}`
      );
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();

      // Fetch user's lists
      const listsResponse = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/users/${username}/lists`
      );
      if (!listsResponse.ok) {
        throw new Error("Failed to fetch user lists");
      }
      const userLists = await listsResponse.json();

      setSelectedUser(userData);
      setSelectedUserLists(userLists);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Handle search query change
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
<div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
{/* Navigation Bar */}
  <div className="bg-white dark:bg-gray-800 shadow-sm w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="flex items-center">
        <UtensilsCrossed className="w-6 h-6 text-orange-500" />
        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
          User Profiles
        </span>
      </div>
    </div>
  </div>

  {/* Main Content - Updated for mobile responsiveness */}
  <div className="flex flex-col md:flex-row flex-1">
    {/* Users Sidebar - Made collapsible on mobile */}
    <div className="w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b dark:border-gray-700">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      
      {/* User list with improved mobile styling */}
      <div className="overflow-y-auto max-h-[50vh] md:max-h-screen">
        {filteredUsers.map((user, index) => (
          <div
            key={user.username}
            onClick={() => fetchUserDetails(user.username)}
            className={`p-4 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 border-b transition-colors 
              ${selectedUser?.username === user.username 
                ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800' 
                : 'bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20'
              }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white mr-4">
                {user.firstName?.[0] || ""}{user.lastName?.[0] || ""}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800 dark:text-white">@{user.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.points?.generalPoints || 0} points
                </p>
              </div>
              <div className="text-sm font-bold text-gray-400 dark:text-gray-500">
                #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* User Profile Section - Made responsive */}
    <div className="flex-1 overflow-y-auto">
      {selectedUser ? (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
          {/* Profile Header - Improved mobile layout */}
          <div className="bg-gradient-to-r from-orange-300 to-orange-500 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                {selectedUser.firstName?.[0] || ""}{selectedUser.lastName?.[0] || ""}
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h1>
                <div className="space-y-2 text-gray-200">
                  <p className="flex items-center justify-center sm:justify-start">
                    <User className="w-4 h-4 mr-2" />@{selectedUser.username}
                  </p>
                  <p className="flex items-center justify-center sm:justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section - Made responsive */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedUser?.points?.generalPoints || 0}
                  </p>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Lists Created</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedUserLists.length}
                  </p>
                  <Library className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Lists Section - Updated grid for better mobile display */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {selectedUser.firstName}'s Lists
            </h2>

            {selectedUserLists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {selectedUserLists.map((list) => (
                  <RestaurantListCard key={list.id} list={list} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Library className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {selectedUser.firstName} hasn't created any lists yet
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          Select a user to view their profile
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default DisplayUser;