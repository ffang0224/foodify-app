import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import sampleRestaurantData from "../sample-data/sampleRestaurantData";

const IndivRestaurantCard = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Navigation Bar with Back Button */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Restaurants</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full h-96">
            <img
              src={images[0]}
              alt={`Image of ${name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
              <div className="flex items-center space-x-4">
                <span className="text-yellow-400 text-lg">
                  {"⭐".repeat(rating)}
                </span>
                <span className="text-white">({rating}/5)</span>
                <span className="text-white">•</span>
                <span className="text-white">{priceRange}</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    About
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Popular Dishes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularDishes.map((dish, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Details
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">
                        Cuisine:
                      </span>{" "}
                      {cuisines}
                    </p>
                    <div className="text-gray-600">
                      <span className="font-medium text-gray-800">
                        Location:
                      </span>
                      <br />
                      {location.address},<br />
                      {location.city}, {location.state} {location.postalCode}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Button */}
            <div className="mt-8 flex justify-center">
              <a
                href="https://www.opentable.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Make a Reservation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndivRestaurantCard;
