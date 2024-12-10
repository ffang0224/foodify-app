import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { X, Heart, UtensilsCrossed, Star, MapPin, DollarSign, Loader2 ,Globe, Navigation} from 'lucide-react';
import MessageWindow from './MessageWindow';
import RestaurantDetails from './RestaurantDetails';
import TutorialOverlay from './SwipeTutorial';

const RestaurantTinder = () => {
    const navigate = useNavigate();
    const { userData } = useAuthUser();
    const [restaurants, setRestaurants] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [messageModal, setMessageModal] = useState({
        show: false,
        title: "",
        message: "",
    });
    const [userLocation, setUserLocation] = useState(null);
    const [dragStart, setDragStart] = useState(null);
    const cardRef = useRef(null);
    const [showTutorial, setShowTutorial] = useState(() => {
        // Check if user has seen the tutorial before
        return !localStorage.getItem('hasSeenTutorial');
    });
    // Get user location when component mounts
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    // Calculate distance between two points
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in kilometers

        if (d < 1) {
            return `${Math.round(d * 1000)} m`; // Convert to meters if less than 1km
        }
        return `${d.toFixed(1)} km`;
    };

    // Fetch restaurants
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch(
                    "https://foodify-backend-927138020046.us-central1.run.app/restaurants"
                );
                if (!response.ok) throw new Error("Failed to fetch restaurants");
                const data = await response.json();

                // Shuffle the restaurants array
                const shuffled = [...data].sort(() => Math.random() - 0.5);

                // Get photos for initial restaurants (e.g., first 5 to minimize API calls)
                const initialRestaurants = shuffled.slice(0, 5);
                const restaurantsWithPhotos = await Promise.all(
                    initialRestaurants.map(async (restaurant) => {
                        try {
                            const photoResponse = await fetch(
                                `https://foodify-backend-927138020046.us-central1.run.app/restaurant-photo/${restaurant.additional_info.gmaps.place_id}`
                            );
                            if (!photoResponse.ok) throw new Error("Failed to fetch photo");
                            const photoData = await photoResponse.json();
                            return {
                                ...restaurant,
                                image: photoData.photo_url || "/api/placeholder/400/320"
                            };
                        } catch (err) {
                            console.error("Error fetching restaurant photo:", err);
                            return {
                                ...restaurant,
                                image: "/api/placeholder/400/320"
                            };
                        }
                    })
                );

                // Combine restaurants with photos with the rest
                const remainingRestaurants = shuffled.slice(5).map(restaurant => ({
                    ...restaurant,
                    image: "/api/placeholder/400/320"
                }));

                setRestaurants([...restaurantsWithPhotos, ...remainingRestaurants]);
            } catch (err) {
                console.error("Error fetching restaurants:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    useEffect(() => {
        const fetchNextRestaurantPhoto = async () => {
            if (!restaurants[currentIndex + 1]) return;

            if (!restaurants[currentIndex + 1].image || restaurants[currentIndex + 1].image === "/api/placeholder/400/320") {
                try {
                    const response = await fetch(
                        `https://foodify-backend-927138020046.us-central1.run.app/restaurant-photo/${restaurants[currentIndex + 1].additional_info.gmaps.place_id}`
                    );
                    if (!response.ok) throw new Error("Failed to fetch photo");
                    const data = await response.json();

                    setRestaurants(prev => prev.map((restaurant, index) =>
                        index === currentIndex + 1
                            ? { ...restaurant, image: data.photo_url || "/api/placeholder/400/320" }
                            : restaurant
                    ));
                } catch (err) {
                    console.error("Error fetching next restaurant photo:", err);
                }
            }
        };

        fetchNextRestaurantPhoto();
    }, [currentIndex, restaurants]);

    // Fetch user's playlists
    const fetchPlaylists = async () => {
        try {
            const response = await fetch(
                `https://foodify-backend-927138020046.us-central1.run.app/users/${userData.username}/lists`
            );
            if (!response.ok) throw new Error("Failed to fetch playlists");
            const data = await response.json();

            // Filter playlists to only include those where the current user is the author
            const filteredPlaylists = data.filter(playlist =>
                playlist.author === userData.username
            );

            setPlaylists(filteredPlaylists);

            // Show message if user has no playlists they can add to
            if (filteredPlaylists.length === 0) {
                setMessageModal({
                    show: true,
                    title: "No Lists Available",
                    message: "You don't have any lists yet. Create a list first to save restaurants!",
                });
                setShowPlaylists(false);
            }
        } catch (err) {
            console.error("Error fetching playlists:", err);
            setMessageModal({
                show: true,
                title: "Error",
                message: "Failed to fetch your playlists. Please try again.",
            });
        }
    };
    const handleAddToPlaylist = async (listId) => {
        if (!restaurants[currentIndex]) return;

        try {
            const response = await fetch(
                `https://foodify-backend-927138020046.us-central1.run.app/users/${userData.username}/lists/${listId}/restaurants/add`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        place_id: restaurants[currentIndex].additional_info.gmaps.place_id,
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Failed to add restaurant to playlist.");
            }

            setMessageModal({
                show: true,
                title: "Restaurant Added!",
                message: `"${restaurants[currentIndex].name.gmaps}" has been added to your playlist!`,
            });

            // Move to next restaurant after successful add
            setCurrentIndex(prev => prev + 1);
            setShowPlaylists(false);
        } catch (err) {
            console.error("Error adding to playlist:", err);
            setMessageModal({
                show: true,
                title: "Oops!",
                message: "Failed to add the restaurant. Maybe it's already in your list?",
            });
        }
    };

    const handleDragStart = (e) => {
        setDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setDragStart(clientX);
        setDragOffset(0);

        // Prevent default behavior only for mouse events to avoid text selection
        if (!e.touches) {
            e.preventDefault();
        }
    };

    const handleDragMove = (e) => {
        if (!dragging || dragStart === null) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const newOffset = clientX - dragStart;

        // Limit the drag offset to a reasonable range
        const limitedOffset = Math.max(Math.min(newOffset, 250), -250);
        setDragOffset(limitedOffset);

        // Prevent default behavior only for mouse events
        if (!e.touches) {
            e.preventDefault();
        }
    };

    const handleDragEnd = (e) => {
        if (!dragging) return;

        // Trigger actions based on drag distance
        if (dragOffset > 100) {
            // Swiped right - like
            fetchPlaylists();
            setShowPlaylists(true);
        } else if (dragOffset < -100) {
            // Swiped left - skip
            setCurrentIndex(prev => prev + 1);
        }

        // Reset drag state
        setDragging(false);
        setDragStart(null);
        setDragOffset(0);
    };

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleTouchMove = (e) => {
            if (dragging) {
                // Prevent screen scrolling while dragging
                e.preventDefault();
            }
        };

        card.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            card.removeEventListener('touchmove', handleTouchMove);
        };
    }, [dragging]);


    const renderDistance = () => {
        if (!userLocation || !currentRestaurant?.location?.gmaps) return null;

        const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            currentRestaurant.location.gmaps.lat,
            currentRestaurant.location.gmaps.lng
        );

        return (
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <Navigation className="w-4 h-4 mr-2" />
                <span>{distance} away</span>
            </div>
        );
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">Loading restaurants...</p>
            </div>
        );
    }

    if (currentIndex >= restaurants.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <UtensilsCrossed className="w-16 h-16 text-orange-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No More Restaurants</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">You've seen all the restaurants in your area!</p>
                <button
                    onClick={() => setCurrentIndex(0)}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Start Over
                </button>
            </div>
        );
    }

    const currentRestaurant = restaurants[currentIndex];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md mx-auto mt-8">
                <div
                    ref={cardRef}
                    className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden touch-none select-none"
                    style={{
                        transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.03}deg)`,
                        transition: dragging ? 'none' : 'transform 0.3s ease-out'
                    }}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    <div
                        className="h-64 bg-gray-200 bg-cover bg-center relative"
                        style={{
                            backgroundImage: `url(${currentRestaurant?.image || "/api/placeholder/400/320"})`
                        }}
                    >
                        {/* Optional loading overlay while image is loading */}
                        {!currentRestaurant?.image && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {currentRestaurant.name.gmaps}
                        </h2>

                        <div className="flex items-center mb-4">
                            <Star className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="font-medium text-gray-800 dark:text-white">
                                {currentRestaurant.ratings?.gmaps?.rating || "N/A"}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-1">
                                ({currentRestaurant.ratings?.gmaps?.total_ratings || 0} reviews)
                            </span>
                            <div className="ml-4 flex items-center">
                                <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {"$".repeat(currentRestaurant.price_level?.gmaps?.normalized || 1)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start mb-4">
                            <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                            <p className="ml-2 text-gray-600 dark:text-gray-300">
                                {currentRestaurant.location?.gmaps?.address || "Address not available"}
                            </p>
                        </div>
                        {renderDistance()}

                        <div className="mb-4">
                            {/* Google Maps Tags */}
                            {currentRestaurant.types?.gmaps && (
                                <div className="mb-2">
                                    <div className="flex flex-wrap gap-2">
                                        {currentRestaurant.types.gmaps
                                            .filter(type => !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type))
                                            .map((type, index) => (
                                                <span
                                                    key={`gmaps-${index}`}
                                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm flex items-center"
                                                >
                                                    <Globe className="w-3 h-3 mr-1" />
                                                    {type.replace(/_/g, " ")}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Yelp Tags */}
                            {currentRestaurant.types?.yelp && currentRestaurant.types.yelp.length > 0 && (
                                <div>
                                    <div className="flex flex-wrap gap-2">
                                        {currentRestaurant.types.yelp.map((type, index) => (
                                            <span
                                                key={`yelp-${index}`}
                                                className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm flex items-center"
                                            >
                                                <Star className="w-3 h-3 mr-1" />
                                                {type.replace(/_/g, " ")}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            {/* View Details Button */}
                            <button
                                onClick={() => setShowDetails(true)}
                                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                            >
                                View Details
                            </button>

                            {/* Add to Playlist Button */}
                            <button
                                onClick={() => {
                                    fetchPlaylists();
                                    setShowPlaylists(true);
                                }}
                                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                            >
                                Add to My Playlist
                            </button>
                        </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none">
                        <div
                            className={`p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg transform transition-opacity ${dragOffset < -50 ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <X className="w-8 h-8 text-red-500" />
                        </div>
                        <div
                            className={`p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg transform transition-opacity ${dragOffset > 50 ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <Heart className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-8 h-8 text-red-500" />
                    </button>
                    <button
                        onClick={() => {
                            fetchPlaylists();
                            setShowPlaylists(true);
                        }}
                        className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Heart className="w-8 h-8 text-green-500" />
                    </button>
                </div>
            </div>

            {/* Playlists Modal */}
            {showPlaylists && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Add to Your Lists
                        </h3>
                        {playlists.length > 0 ? (
                            <div className="space-y-2">
                                {playlists.map((playlist) => (
                                    <button
                                        key={playlist.id}
                                        onClick={() => handleAddToPlaylist(playlist.id)}
                                        className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <span className="font-medium text-gray-800 dark:text-white">
                                            {playlist.name}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Created by you
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="mb-4">
                                    <UtensilsCrossed className="w-12 h-12 text-gray-400 mx-auto" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 mb-2">
                                    You don't have any lists yet.
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Create a new list to start saving restaurants!
                                </p>
                            </div>
                        )}
                        <button
                            onClick={() => setShowPlaylists(false)}
                            className="w-full mt-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            {/* Restaurant Details Modal */}
            {showDetails && (
                <RestaurantDetails
                    restaurant={currentRestaurant}
                    onClose={() => setShowDetails(false)}
                />
            )}

            <MessageWindow
                show={messageModal.show}
                title={messageModal.title}
                message={messageModal.message}
                onClose={() => setMessageModal({ show: false, title: "", message: "" })}
            />
            {showTutorial && <TutorialOverlay onComplete={() => {
                setShowTutorial(false);
                localStorage.setItem('hasSeenTutorial', 'true');
            }} />}
        </div>
    );
};

export default RestaurantTinder;