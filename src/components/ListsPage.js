import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { Plus, Library, Loader } from "lucide-react";

const ListsPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuthUser();
  const [playlists, setPlaylists] = useState([]);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!userData) return;

      try {
        // Fetch user's playlists
        const userPlaylistsResponse = await fetch(
          `http://localhost:8000/users/${userData.username}/playlists`
        );
        if (!userPlaylistsResponse.ok)
          throw new Error("Failed to fetch user playlists");
        const userPlaylists = await userPlaylistsResponse.ok;

        // Fetch popular playlists (you'll need to add this endpoint to your API)
        const popularPlaylistsResponse = await fetch(
          "http://localhost:8000/playlists/popular"
        );
        if (!popularPlaylistsResponse.ok)
          throw new Error("Failed to fetch popular playlists");
        const popularPlaylists = await popularPlaylistsResponse.json();

        setPlaylists(userPlaylists);
        setPopularPlaylists(popularPlaylists);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userData]);

  const PlaylistCard = ({ playlist }) => (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
      style={{
        borderLeft: `4px solid ${playlist.color || "#f97316"}`,
      }}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {playlist.description || `Created by ${playlist.author}`}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {playlist.restaurants.length} restaurants
          </span>
          <button
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className="text-orange-500 hover:text-orange-600 text-sm font-semibold"
          >
            View List →
          </button>
        </div>
      </div>
    </div>
  );

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

        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
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

      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Popular Lists</h2>
            <p className="text-sm text-gray-600 mt-1">
              Discover curated collections from the community
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ListsPage;
