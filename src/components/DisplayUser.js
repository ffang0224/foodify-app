import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, Copy, Loader, Star, ArrowLeft} from "lucide-react";
import { useAuthUser } from "../hooks/useAuthUser"; // Import the auth hook

const DisplayUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLists, setCopiedLists] = useState({});
  const navigate = useNavigate();
  const { userData } = useAuthUser(); // Get current user data

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();

        const transformedUsers = await Promise.all(data.map(async (user) => {
          const listsResponse = await fetch(`http://localhost:8000/users/${user.username}/lists/details`);
          const lists = await listsResponse.json();
          return {
            username: user.username,
            lists: lists,
            points: user.points
          };
        }));

        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search query change
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const results = users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(results);
  };

  // Handle copying a list
  const handleCopyList = async (username, list) => {
    try {
      // Create a new list for the current user
      const newList = {
        name: `${list.name} (Copied from @${username})`,
        description: list.description,
        restaurants: list.restaurants,
        color: list.color,
        author: userData.username,
        username: userData.username
      };

      const response = await fetch(`http://localhost:8000/users/${userData.username}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newList)
      });

      if (!response.ok) {
        throw new Error('Failed to copy list');
      }

      // Show copied status temporarily
      setCopiedLists(prev => ({
        ...prev,
        [list.id]: true
      }));

      setTimeout(() => {
        setCopiedLists(prev => ({
          ...prev,
          [list.id]: false
        }));
      }, 2000);

    } catch (error) {
      console.error('Error copying list:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <div className="w-full max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
      </div>
      <h2 className="text-4xl font-extrabold text-center text-orange-600 mb-8">
        Discover Food Lists
      </h2>

      {/* Search Bar */}
      <div className="w-full max-w-3xl mb-8">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-4 rounded-lg shadow-xl text-lg placeholder-gray-400 border-2 border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>

      {/* Display Users and their lists */}
      <div className="w-full max-w-3xl space-y-8">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.username}
              className="bg-white rounded-xl shadow-lg p-6 space-y-4"
            >
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-gray-800">@{user.username}</span>
                    <span className="text-sm text-gray-500">
                      {user.lists.length} lists • {user.points?.reviewPoints || 0} review points
                    </span>
                  </div>
                </div>
              </div>

              {/* User's Lists */}
              <div className="space-y-4">
                {user.lists.map((list) => (
                  <div
                    key={list.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <List className="w-5 h-5 text-orange-500 mt-1" />
                        <div>
                          <h3 className="font-medium text-lg">{list.name}</h3>
                          <p className="text-sm text-gray-600">{list.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {list.restaurants.length} restaurants
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyList(user.username, list)}
                          className={`px-4 py-2 rounded-full text-sm flex items-center space-x-2 
                            ${copiedLists[list.id]
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            } transition-all duration-300`}
                        >
                          {copiedLists[list.id] ? (
                            <>
                              <Star className="w-4 h-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy List</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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