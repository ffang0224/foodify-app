import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import RestaurantListCard from "./ListCard";
import { Edit, Mail, User, Star, Library, Plus } from "lucide-react";

const ProfilePage = () => {
  const { userData, loading: userLoading } = useAuthUser();
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incentiveMessage, setIncentiveMessage] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      if (!userData) return;

      try {
        const response = await fetch(
          `https://foodify-backend-927138020046.us-central1.run.app/users/${userData.username}/lists`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lists");
        }

        const userLists = await response.json();
        setLists(userLists);
        
        // Calculate incentive message
        const numLists = userLists.length;
        const nextMilestone = Math.ceil((numLists + 1) / 10) * 10;
        const firstName = userData.firstName;
        
        setIncentiveMessage(
          `Keep going, ${firstName}! Create ${nextMilestone - numLists} more list${
            nextMilestone - numLists > 1 ? "s" : ""
          } to reach ${nextMilestone} lists and earn 10 points.`
        );
      } catch (err) {
        console.error("Error fetching lists:", err);
        setError(err.message);
      } finally {
        setListsLoading(false);
      }
    };

    fetchLists();
  }, [userData]);

  useEffect(() => {
    if (!userData && !userLoading) {
      navigate("/login");
    }
  }, [userData, userLoading, navigate]);

  if (userLoading || listsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Profile Section - Made responsive */}
        <div className="bg-gradient-to-r from-orange-300 to-orange-500 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Profile Image - Centered on mobile */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold transition-transform hover:scale-110 duration-300">
              {userData.firstName?.[0] || ""}{userData.lastName?.[0] || ""}
            </div>

            <div className="flex-grow text-center sm:text-left">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <div className="space-y-2 text-gray-200">
                    <p className="flex items-center justify-center sm:justify-start">
                      <User className="w-4 h-4 mr-2" />@{userData.username}
                    </p>
                    <p className="flex items-center justify-center sm:justify-start break-all">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      {userData.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center px-4 py-2 border border-white rounded-md hover:bg-gray-50 text-white hover:text-orange-500 transition duration-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Stats Section */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-orange-600">
                      {userData?.points?.generalPoints || 0}
                    </p>
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lists Created</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-orange-600">{lists.length}</p>
                    <Library className="w-6 h-6 text-orange-500" />
                  </div>
                  {incentiveMessage && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{incentiveMessage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white hover:text-orange-500 transition-all duration-300">
                Your Lists
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Create and manage your restaurant collections
              </p>
            </div>
            <button
              onClick={() => navigate("/create-playlist")}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all shadow-xl transform"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New List
            </button>
          </div>

          {error && (
            <div className="mb-6 sm:mb-8 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg shadow-lg">
              {error}
            </div>
          )}

          {lists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {lists.map((list) => (
                <RestaurantListCard key={list.id} list={list} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <Library className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                You haven't created any lists yet
              </p>
              <button
                onClick={() => navigate("/create-playlist")}
                className="text-xl text-orange-500 hover:text-orange-600 font-semibold transition-all duration-200"
              >
                Create Your First List
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;