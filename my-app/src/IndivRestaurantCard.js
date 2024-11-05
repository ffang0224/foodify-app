import React from "react";
import { useParams } from "react-router-dom";
import sampleRestaurantData from "./sampleRestaurantData";

const IndivRestaurantCard = () => {
  const { restaurantId } = useParams(); 
  const restaurant = sampleRestaurantData.find(
    (r) => r.restaurantId === restaurantId
  );

  if (!restaurant) {
    return (
      <p className="text-gray-600 text-center p-4">Restaurant not found</p>
    );
  }

  const {
    name,
    cuisines,
    location,
    images,
    popularDishes,
    description,
    rating,
    priceRange,
  } = restaurant;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full">
          <img
            src={images[0]}
            alt={`Image of ${name}`}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Cuisine:</span> {cuisines}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Location:</span>{" "}
              {location.address}, {location.city}, {location.state}{" "}
              {location.postalCode}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Description:</span> {description}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Rating:</span>{" "}
              {"⭐".repeat(rating)} ({rating}/5)
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Popular Dishes:</span>{" "}
              {popularDishes.join(", ")}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Price Range:</span> {priceRange}
            </p>
          </div>
          <a
            href="https://www.opentable.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Make a Reservation
          </a>
        </div>
      </div>
    </div>
  );
};

export default IndivRestaurantCard;
