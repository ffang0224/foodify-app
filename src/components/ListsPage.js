import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { Plus, Library, Loader } from "lucide-react";

const RestaurantListCard = ({ list }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
      style={{
        borderLeft: `4px solid ${list.color}`,
      }}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {list.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {list.description || `Created by ${list.author}`}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {list.restaurants.length} restaurants
          </span>
          <button
            onClick={() => navigate(`/lists/${list.id}`)}
            className="text-orange-500 hover:text-orange-600 text-sm font-semibold"
          >
            View List →
          </button>
        </div>
      </div>
    </div>
  );
};

const ListsPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuthUser();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [incentiveMessage, setIncentiveMessage] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      if (!userData) return;

      try {
        const response = await fetch(
          `http://localhost:8000/users/${userData.username}/lists`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lists");
        }

        const userLists = await response.json();
        setLists(userLists);

        // Calculate incentive message
        const numLists = userLists.length;
        const nextMilestone = Math.ceil((numLists + 1) / 10) * 10;
        const points = (nextMilestone / 10) * 10;
        const firstName = userData.firstName;

        if (numLists > 0 && numLists % 10 === 0) {
          // Update points on the server
          await fetch(
            `http://localhost:8000/users/${userData.username}/updatePoints`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ points }),
            }
          );
        }

        setIncentiveMessage(
          `Keep going, ${firstName}! Create ${
            nextMilestone - numLists
          } more list${nextMilestone - numLists > 1 ? "s" : ""} to reach ${
            nextMilestone
          } lists and earn ${points} points.`
        );
      } catch (err) {
        console.error("Error fetching lists:", err);
        setError(err.message || "Failed to load lists");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [userData]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading lists...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {error && (
        <div className="mb-8 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {incentiveMessage && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
          <h3 className="text-yellow-600 font-semibold text-lg">
            Keep Going!
          </h3>
          <p className="text-gray-700">{incentiveMessage}</p>
        </div>
      )}

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Your Lists</h2>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage your restaurant collections
            </p>
          </div>
          <button
            onClick={() => navigate("/create-playlist")}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New List
          </button>
        </div>

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <RestaurantListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Library className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
      </section>
    </div>
  );
};

export default ListsPage;
