import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;





// TO RUN ELYAZIA'S PART UNCOMMENT BELOW AND DELETE THE ABOVE (to be continued)




// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import sampleRestaurantData from './sampleRestaurantData';
// import IndivRestaurantCard from './IndivRestaurantCard';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Default route to show the restaurant collection (playlist page) */}
//           <Route
//             path="/"
//             element={<RestaurantCollection data={sampleRestaurantData} />}
//           />
          
//           {/* Route for individual restaurant pages */}
//           <Route
//             path="/restaurant/:restaurantId"
//             element={<IndivRestaurantCard data={sampleRestaurantData} />}
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// // Component for displaying the restaurant collection (playlist page)
// const RestaurantCollection = ({ data }) => {
//   return (
//     <div className="restaurant-collection">
//       <h2>Restaurant Collection: You might like these!</h2>
//       {data.map((restaurant) => (
//         <div key={restaurant.restaurantId} className="restaurant-card">
//           <img
//             src={restaurant.images[0]}
//             alt={`${restaurant.name}`}
//             className="restaurant-image"
//           />
//           <h3>
//             <Link to={`/restaurant/${restaurant.restaurantId}`} className="restaurant-name">
//               {restaurant.name}
//             </Link>
//           </h3>
//           <p><strong>Cuisine:</strong> {restaurant.cuisines}</p>
//           <p><strong>Price Range:</strong> {restaurant.priceRange}</p>
//           <p><strong>Popular Dishes:</strong> {restaurant.popularDishes.join(', ')}</p>
//           <a href="https://www.opentable.com/" target="_blank" rel="noopener noreferrer" className="reservation-link">
//             Make a Reservation
//           </a>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default App;
