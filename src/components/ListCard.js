// Disclaimer: This component has been partially generated using Claude.
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

export default RestaurantListCard;