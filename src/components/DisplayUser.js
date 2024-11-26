import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DisplayUser = () => {
  // Hardcoded user data
  const users = [
    { username: "aruzhan_bolatova", restaurants: ["Cafe Baku", "Chaihana"], reviews: 34 },
    { username: "chris", restaurants: ["Pasta Paradise", "Pizza Express"], reviews: 12 },
    { username: "elyazia-eats", restaurants: ["Sushi World", "Taco Villa"], reviews: 56 },
    { username: "faustofangg", restaurants: ["Burger King", "Wok Street"], reviews: 8 },
    { username: "minseok_test", restaurants: ["Ramen House", "Sushi Spot"], reviews: 21 },
  ];

  const [searchQuery, setSearchQuery] = useState(""); // Stores the current search query
  const [filteredUsers, setFilteredUsers] = useState(users); // Stores the filtered list of users
  const navigate = useNavigate();

  // Handle search query change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchQuery]);

  // Navigate to the user's profile (you can replace this with your actual profile page navigation)
  const goToUserProfile = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h2 className="text-4xl font-extrabold text-center text-orange-600 mb-8">
        Search for Foodies
      </h2>

      {/* Search Bar */}
      <div className="w-full max-w-lg mb-8">
        <input
          type="text"
          placeholder="Search for a foodie..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-4 rounded-lg shadow-lg text-lg placeholder-gray-400 border-2 border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>

      {/* Display Users */}
      <div className="w-full max-w-lg space-y-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.username}
              className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md hover:bg-orange-50 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => goToUserProfile(user.username)}
            >
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-gray-800">{user.username}</span>
                <span className="text-sm text-gray-500">{user.restaurants.length} restaurants</span>
                <span className="text-sm text-gray-500">{user.reviews} reviews</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onClick when clicking the button
                  goToUserProfile(user.username);
                }}
                className="px-6 py-2 text-sm text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all duration-300"
              >
                View Profile
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default DisplayUser;
