import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import sampleRestaurantData from "./sampleRestaurantData";
import IndivRestaurantCard from "./IndivRestaurantCard";
import Login from "./login";
import Register from "./register";
import MapComponent from "./map.js";
import ListsPage from './ListsPage';
import sampleListsData from "./sampleListsData";
import { RestaurantCollectionWithNav } from "./IndivPlaylist.js";
import { ArrowLeft, ArrowRight } from "lucide-react";


// Navigation bar component with conditional rendering
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRestaurantPage = location.pathname.includes("/restaurants");
  const isMapPage = location.pathname === "/map";
  const isListsPage = location.pathname === "/lists";

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* For restaurant pages, show back to lists on the left */}
        {isRestaurantPage && (
          <button
            onClick={() => navigate("/lists")}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Lists</span>
          </button>
        )}
        {/* For Lisrs page, show restaurants on the right and map on the left*/}
        {isListsPage && (
          <div className="flex justify-between w-full">
          {/* Back to Map on the left */}
          <button
            onClick={() => navigate("/map")}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Map</span>
          </button>
        </div>
        )}
        {/* For map page, show restaurants on the right */}
        {isMapPage && (
          <div className="ml-auto">
            <button
              onClick={() => navigate("/lists")}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span>Lists</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
        {/* If we're not on either page, show empty div for spacing */}
        {!isRestaurantPage && !isMapPage && !isListsPage &&<div></div>}
      </div>
    </div>
  );
};
// Map view with navigation
const MapView = () => (
  <div className="min-h-screen bg-gray-50">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MapComponent />
    </div>
  </div>
);

// Lists Page with navigation
const ListsPageWithNav = () => {
  // const [currentPage] = useState('lists'); // You can expand this for actual routing
  return(
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-grow">
        <ListsPage />
      </div>
    </div>
  )
};

// Restaurant Collection with navigation



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/lists" element={<ListsPageWithNav />} />
        <Route
          path="/restaurants"
          element={<RestaurantCollectionWithNav data={sampleRestaurantData} NavBar={NavBar}/>}
        />
        <Route
          path="/restaurant/:restaurantId"
          element={
            <div className="min-h-screen bg-gray-50">
              <NavBar />
              <div className="max-w-7xl mx-auto px-4 py-8">
                <IndivRestaurantCard />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
