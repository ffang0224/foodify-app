import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DisplayUser = () => {
  const [users, setUsers] = useState([]); // Stores the list of users
  const [searchQuery, setSearchQuery] = useState(""); // Stores the current search query
  const [filteredUsers, setFilteredUsers] = useState([]); // Stores the filtered list of users
  const navigate = useNavigate();

  // Fetch the list of users from the API (replace the URL with your actual API endpoint)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://your-api-endpoint.com/users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Initially show all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
  }, [searchQuery, users]);

  // Navigate to the user's profile (you can replace this with your actual profile page navigation)
  const goToUserProfile = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h2 className="text-4xl font-extrabold text-center text-orange-600 mb-8">
        Search for Foodies
      </h2>

      {/* Search Bar */}
      <div className="w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="Search for a foodie..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-4 rounded-lg shadow-lg text-lg placeholder-gray-400 border-2 border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>

      {/* Display Users */}
      <div className="w-full max-w-md space-y-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.username}
              className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md hover:bg-orange-50 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => goToUserProfile(user.username)}
            >
              <span className="text-2xl font-semibold text-gray-800">{user.username}</span>
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
