import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Library, Star, List, ArrowLeft, UtensilsCrossed, ChevronRight } from "lucide-react";
import RestaurantListCard from "./ListCard";

const DisplayUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserLists, setSelectedUserLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersResponse = await fetch("https://foodify-backend-927138020046.us-central1.run.app/users");
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const userData = await usersResponse.json();

        const sortedUsers = userData.sort((a, b) => {
          const pointsA = a.points?.generalPoints || 0;
          const pointsB = b.points?.generalPoints || 0;
          return pointsB - pointsA;
        });

        setUsers(sortedUsers);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserDetails = async (username) => {
    try {
      const userResponse = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/users/${username}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();

      const listsResponse = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/users/${username}/lists`
      );
      if (!listsResponse.ok) throw new Error("Failed to fetch user lists");
      const userLists = await listsResponse.json();

      setSelectedUser(userData);
      setSelectedUserLists(userLists);
      setShowUserDetail(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container for the split view */}
      <div className="md:flex md:h-screen md:overflow-hidden">
        {/* Users List Panel */}
        <div className={`md:w-1/3 lg:w-2/5 ${showUserDetail ? 'hidden md:block' : 'block'} md:border-r md:border-gray-200 md:overflow-y-auto`}>
          {/* Header */}
          <div className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-4 py-4 flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="md:hidden flex items-center text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold flex items-center">
                <UtensilsCrossed className="w-5 h-5 text-orange-500 mr-2" />
                User Profiles
              </h1>
              <div className="w-5 md:hidden" />
            </div>

            {/* Search Bar */}
            <div className="px-4 pb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div
                key={user.username}
                onClick={() => fetchUserDetails(user.username)}
                className={`bg-white p-4 flex items-center justify-between hover:bg-orange-50 cursor-pointer ${selectedUser?.username === user.username ? 'bg-orange-50' : ''
                  }`}
              >
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg">
                    {user.firstName?.[0] || ""}{user.lastName?.[0] || ""}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-800">@{user.username}</h3>
                    <p className="text-sm text-gray-500">{user.points?.generalPoints || 0} points</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Detail Panel */}
        <div className={`md:w-2/3 lg:w-3/5 ${showUserDetail ? 'block' : 'hidden md:block'} md:overflow-y-auto h-full bg-gray-50`}>
          {selectedUser ? (
            <>
              {/* Mobile Header */}
              <div className="md:hidden bg-white shadow-sm sticky top-0 z-10">
                <div className="px-4 py-4 flex items-center">
                  <button
                    onClick={() => setShowUserDetail(false)}
                    className="flex items-center text-gray-600"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Users
                  </button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-4">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-300 to-orange-500 p-6">
                    <div className="flex items-center">
                      <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                        {selectedUser.firstName?.[0] || ""}{selectedUser.lastName?.[0] || ""}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-bold text-white">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h2>
                        <p className="text-white/80">@{selectedUser.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Points</p>
                      <p className="text-xl font-bold text-orange-600">
                        {selectedUser?.points?.generalPoints || 0}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Lists</p>
                      <p className="text-xl font-bold text-orange-600">
                        {selectedUserLists.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User's Lists */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Restaurant Lists</h3>
                  <div className="space-y-4">
                    {selectedUserLists.length > 0 ? (
                      selectedUserLists.map((list) => (
                        <RestaurantListCard key={list.id} list={list} />
                      ))
                    ) : (
                      <div className="bg-white p-6 rounded-lg text-center">
                        <Library className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No lists created yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex h-full items-center justify-center">
              <div className="text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Select a user to view their profile</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayUser;