import React from 'react';

const IndivRestaurantCard = ({ restaurantData }) => {
  if (!restaurantData) return null;

  const {
    name,
    cuisines,
    location,
    images,
    popularDishes,
    description,
    rating
  } = restaurantData;

  return (
    <div className="restaurant-card">
      {/* Main Restaurant Image */}
      <div className="restaurant-header-image">
        <img src={images[0]} alt={`Image of ${name}`} />
      </div>

      {/* Restaurant Information */}
      <div className="restaurant-info">
        <h2>{name}</h2>
        <p><strong>Cuisine:</strong> {cuisines}</p>
        <p><strong>Location:</strong> {location?.address}, {location?.city}, {location?.state} {location?.postalCode}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Rating:</strong> {"⭐".repeat(rating)} ({rating}/5)</p>
      </div>

      {/* Popular Dishes */}
      <div className="popular-dishes">
        <p><strong>Popular Dishes</strong></p>
        {popularDishes.map((dish, index) => (
          <div key={index} className="dish">
            <img src={dish.image} alt={dish.name} />
            <span>{dish.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndivRestaurantCard;
