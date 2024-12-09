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
<div className="min-h-screen flex flex-col bg-gray-50">
  {/* Navigation Bar */}
  <div className="bg-white shadow-sm w-full">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-orange-500"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {/* Page Title */}
      <div className="flex items-center">
        <UtensilsCrossed className="w-6 h-6 text-orange-500" />
        <span className="ml-2 font-semibold text-gray-900">
          User Profiles
        </span>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="flex flex-1">
    {/* Users Sidebar */}
    <div className="w-full max-w-md bg-white border-r shadow-lg overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      
      {filteredUsers.map((user, index) => (
        <div
          key={user.username}
          onClick={() => fetchUserDetails(user.username)}
          className={`p-4 cursor-pointer hover:bg-orange-50 border-b transition-colors 
            ${selectedUser?.username === user.username 
              ? 'bg-orange-100 border-orange-200' 
              : 'bg-white hover:bg-orange-50'
            }`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white mr-4">
              {user.firstName?.[0] || ""}{user.lastName?.[0] || ""}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-800">@{user.username}</h3>
              <p className="text-sm text-gray-500">
                {user.points?.generalPoints || 0} points
              </p>
            </div>
            <div className="text-sm font-bold text-gray-400">
              #{index + 1}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Rest of the component remains the same as in the previous implementation */}
    {/* User Profile Section */}
    <div className="flex-1 overflow-y-auto">
      {selectedUser ? (
        <div className="max-w-4xl mx-auto p-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-orange-300 to-orange-500 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                {selectedUser.firstName?.[0] || ""}{selectedUser.lastName?.[0] || ""}
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h1>
                <div className="space-y-2 text-gray-200">
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2" />@{selectedUser.username}
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600">Points Earned</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedUser?.points?.generalPoints || 0}
                  </p>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600">Lists Created</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedUserLists.length}
                  </p>
                  <Library className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Lists Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {selectedUser.firstName}'s Lists
            </h2>

            {selectedUserLists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedUserLists.map((list) => (
                  <RestaurantListCard key={list.id} list={list} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <Library className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">
                  {selectedUser.firstName} hasn't created any lists yet
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a user to view their profile
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default DisplayUser;