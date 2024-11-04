import React from 'react';
import { useParams } from 'react-router-dom';
import sampleRestaurantData from './sampleRestaurantData';

const IndivRestaurantCard = () => {
  const { restaurantId } = useParams();
  const restaurant = sampleRestaurantData.find((r) => r.restaurantId === restaurantId);

  if (!restaurant) {
    return <p>Restaurant not found</p>;
  }

  const { name, cuisines, location, images, popularDishes, description, rating, priceRange } = restaurant;

  return (
    <div className="indiv-restaurant-card">
      <div className="restaurant-header-image">
        <img src={images[0]} alt={`Image of ${name}`} />
      </div>
      <div className="restaurant-info">
        <h2>{name}</h2>
        <p><strong>Cuisine:</strong> {cuisines}</p>
        <p><strong>Location:</strong> {location.address}, {location.city}, {location.state} {location.postalCode}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Rating:</strong> {"⭐".repeat(rating)} ({rating}/5)</p>
        <p><strong>Popular Dishes:</strong> {popularDishes.join(', ')}</p>
        <p><strong>Price Range:</strong> {priceRange}</p>
      </div>
    </div>
  );
};

export default IndivRestaurantCard;
