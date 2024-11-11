import React from "react";
import { useNavigate } from "react-router-dom";
import ListCard from "./ListCard";
import sampleListsData from "../sample-data/sampleListsData";

const ListsPage = ({ userPlaylists }) => {
  const navigate = useNavigate();
  const popularLists = Object.values(sampleListsData);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <section className="mb-12">
        <h2 className="text-xl text-gray-700 mb-4">Popular Lists</h2>
        <div className="flex flex-wrap justify-start gap-4">
          {popularLists.map((list) => (
            <ListCard
              key={list.name}
              image={list.image}
              header={list.name}
              description={list.description}
              listId={list.name}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl text-gray-700 mb-4">Your Lists</h2>
        <div className="flex flex-wrap justify-start gap-4">
          {userPlaylists.map((playlist, index) => (
            <div
              key={index}
              onClick={() => navigate(`/playlist/${index}`)}
              className="cursor-pointer w-64 h-80 border-2 border-gray-300 rounded-lg p-4 m-2 flex flex-col items-center"
              style={{
                backgroundColor: playlist.color, // Use the color as the background
              }}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {playlist.name}
              </h3>
              <p className="text-sm text-gray-600">
                {playlist.restaurants.length} restaurants
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/create-playlist")}
          className="text-lg font-bold text-blue-600 hover:text-blue-800"
        >
          Create A New List
        </button>
      </div>
    </div>
  );
};

export default ListsPage;
