import React from 'react';
import { useParams } from 'react-router-dom';
import sampleRestaurantData from './sampleRestaurantData';

const IndivRestaurantCard = () => {
  const { restaurantId } = useParams();
  const restaurant = sampleRestaurantData.find((r) => r.restaurantId === restaurantId);

  if (!restaurant) {
    return <p className="text-center text-gray-600">Restaurant not found</p>;
  }

  const { name, cuisines, location, images, popularDishes, description, rating, priceRange } = restaurant;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
      {/* Restaurant Image */}
      <div className="w-full h-40 overflow-hidden">
        <img src={images[0]} alt={`Image of ${name}`} className="w-full h-full object-cover rounded-t-lg" />
      </div>

      {/* Restaurant Information */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-gray-600"><strong>Cuisine:</strong> {cuisines}</p>
        <p className="text-gray-600">
          <strong>Location:</strong> {location.address}, {location.city}, {location.state} {location.postalCode}
        </p>
        <p className="text-gray-600"><strong>Description:</strong> {description}</p>
        <p className="text-yellow-500 text-lg mt-2 mb-4">
          <strong>Rating:</strong> {"⭐".repeat(rating)} ({rating}/5)
        </p>
        <p className="text-gray-600"><strong>Popular Dishes:</strong> {popularDishes.join(', ')}</p>
        <p className="text-gray-600"><strong>Price Range:</strong> {priceRange}</p>

        {/* Reservation Link */}
        <a
          href="https://www.opentable.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline mt-4 inline-block"
        >
          Make a Reservation
        </a>
      </div>
    </div>
  );
};

export default IndivRestaurantCard;


