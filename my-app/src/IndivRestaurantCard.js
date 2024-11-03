import React from 'react';

const RestaurantCard = ({ restaurantData }) => {
  const {
    name,
    cuisines,
    location,
    images,
    popularDishes,
    features,
  } = restaurantData;

  return (
    <div className="restaurant-card">
      {/* Restaurant Image */}
      <div className="restaurant-image">
        <img src={images[0]} alt={`Image of ${name}`} />
      </div>

      {/* Restaurant Information */}
      <div className="restaurant-info">
        <h2>{name}</h2>
        <p><strong>Cuisine:</strong> {cuisines}</p>
        <p><strong>Location:</strong> {location.address}, {location.city}, {location.state} {location.postalCode}</p>
        <p><strong>Description:</strong> Classic American Diner with popular comfort foods.</p>
        <p><strong>Rating:</strong> ⭐⭐⭐⭐☆ (4/5)</p> {/* Mock rating */}
      </div>

      {/* Popular Dishes */}
      <div className="popular-dishes">
        <p><strong>Popular Dishes:</strong></p>
        {popularDishes.map((dish, index) => (
          <div key={index} className="dish">
            <img src={`https://example.com/${dish.toLowerCase().replace(/\s+/g, '')}.jpg`} alt={dish} />
            <span>{dish}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantCard;
