import React, { useState } from 'react';
import List from './ListCard';  // Assuming this is your existing List component
import RestaurantCard from './IndivRestaurantCard';  // Assuming this is your existing RestaurantCard component
// Profile page component
const ProfilePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lists] = useState([
    { name: 'List 1', description: 'Short Description 1', image: '/api/placeholder/200/150' },
    { name: 'List 2', description: 'Short Description 2', image: '/api/placeholder/200/150' },
    { name: 'List 3', description: 'Short Description 3', image: '/api/placeholder/200/150' }
  ]);
  
  const [restaurants] = useState([
    {
      name: 'Restaurant 1',
      cuisine: 'Italian',
      priceRange: '$$',
      popularDishes: ['Pizza', 'Pasta'],
      image: '/api/placeholder/200/150'
    },
    {
      name: 'Restaurant 2',
      cuisine: 'Japanese',
      priceRange: '$$$',
      popularDishes: ['Sushi', 'Ramen'],
      image: '/api/placeholder/200/150'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <p className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-2xl font-semibold"> Profile page</p>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-6">
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/019/896/012/small_2x/female-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png" 
              alt="Profile" 
              className="w-28 h-28 rounded-full"
            />
            <div className="flex-grow">
              <h1 className="text-2xl font-semibold mb-2">Alice Smith</h1>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Lists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lists.map((list, index) => (
              <List 
                key={index}
                name={list.name}
                description={list.description}
                image={list.image}
              />
            ))}
          </div>
        </div>

        {/* Favorites Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant, index) => (
              <RestaurantCard 
                key={index}
                {...restaurant}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;