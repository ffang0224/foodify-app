import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import ListCard from "./ListCard";
import RestaurantCard from "./IndivRestaurantCard";
import { Edit, MapPin, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { userData, loading } = useAuthUser();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    navigate("/login");
    return null;
  }

  const totalPoints = Object.values(userData.points).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
              {userData.firstName[0]}
              {userData.lastName[0]}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <User className="w-4 h-4 mr-2" />@{userData.username}
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {userData.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {totalPoints}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Lists Created</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {userData.playlists.length}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {userData.points.reviewPoints}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Lists</h2>
            <button
              onClick={() => navigate("/create-playlist")}
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Create New List
            </button>
          </div>
          {userData.playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userData.playlists.map((list, index) => (
                <ListCard
                  key={list.id || index}
                  listId={list.id}
                  header={list.name}
                  description={`${list.restaurants.length} restaurants`}
                  image={list.image || "/api/placeholder/200/150"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                You haven't created any lists yet
              </p>
              <button
                onClick={() => navigate("/create-playlist")}
                className="text-orange-500 hover:text-orange-600 font-semibold"
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
