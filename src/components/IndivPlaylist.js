import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCollectionWithNav = ({ data, NavBar }) => (
  <div className="min-h-screen bg-white">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Horizontal Orange Line Behind Discs */}
      <div className="relative flex items-center justify-center mb-12">
        <div className="absolute w-full h-1 bg-orange-400 top-1/2 transform -translate-y-1/2"></div>
        <div className="flex space-x-4 z-10">
          {data.map((restaurant) => (
            <div key={restaurant.restaurantId} className="w-16 h-16 relative group">
              {/* Disc Image with Rotation and Scale Effect */}
              <img
                src={restaurant.images[0]}
                alt={`${restaurant.name}`}
                className="w-full h-full rounded-full object-cover border-2 border-blue-500 shadow-md transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Explore Our Top Picks
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((restaurant) => (
          <div
            key={restaurant.restaurantId}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <img
              src={restaurant.images[0]}
              alt={`${restaurant.name}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">
                <Link
                  to={`/restaurant/${restaurant.restaurantId}`}
                  className="text-gray-900 hover:text-blue-600 transition-colors duration-200"
                >
                  {restaurant.name}
                </Link>
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Cuisine:</span> {restaurant.cuisines}
                </p>
                <p>
                  <span className="font-medium">Price Range:</span> {restaurant.priceRange}
                </p>
                <p>
                  <span className="font-medium">Popular Dishes:</span>{" "}
                  {restaurant.popularDishes.join(", ")}
                </p>
              </div>
              <a
                href="https://www.opentable.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Make a Reservation
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export { RestaurantCollectionWithNav };

