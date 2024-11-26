import React, { useState, useEffect } from 'react';
import { X, Star, DollarSign, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleLogo from './images/GoogleLogo.png';
import YelpLogo from './images/YelpLogo.png';

const RestaurantDetailsModal = ({ restaurant, show, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!show || !restaurant) return;

            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/restaurants/${restaurant.additional_info.gmaps.place_id}/reviews`
                );
                if (!response.ok) throw new Error('Failed to fetch reviews');
                const data = await response.json();
                setReviews(data.reviews || []);
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError('Failed to load reviews. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [show, restaurant]);

    if (!show || !restaurant) return null;

    const getPriceLevel = (priceObj) => {
        if (!priceObj?.gmaps?.normalized) return 'N/A';
        return '$'.repeat(priceObj.gmaps.normalized);
    };

    const getAddress = (location) => {
        if (!location) return 'Address not available';
        return location.address || 'Address not available';
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const googleReviews = reviews.filter(review => review.platform === 'google');
    const yelpReviews = reviews.filter(review => review.platform === 'yelp');

    const ReviewPlatformSection = ({ platform, reviews, platformUrl }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={platform === 'Google' ? GoogleLogo : YelpLogo}
                        alt={`${platform} logo`}
                        className={platform === 'Google' ? 'w-6 h-6' : 'w-16 h-8'}
                    />
                    <div>
                        <h3 className="text-lg font-semibold">Reviews</h3>
                        <div className="flex items-center mt-1">
                            <div className="flex">
                                {renderStars(
                                    platform === 'Google'
                                        ? restaurant.ratings?.gmaps?.rating
                                        : restaurant.ratings?.yelp?.rating
                                )}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">
                                ({platform === 'Google'
                                    ? restaurant.ratings?.gmaps?.total_ratings
                                    : restaurant.ratings?.yelp?.total_ratings || 0} reviews)
                            </span>
                        </div>
                    </div>
                </div>
                <a
                    href={platformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                    View on {platform}
                    <ExternalLink className="w-4 h-4 ml-1" />
                </a>
            </div>

            {reviews.slice(0, 2).map((review, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 space-y-2"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium">{review.author}</p>
                            <div className="flex items-center space-x-2">
                                <div className="flex">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(review.time)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600 line-clamp-3">{review.text}</p>
                </motion.div>
            ))}
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="bg-white rounded-xl max-w-6xl w-full max-h-[110vh] overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header with restaurant image */}
                    <div className="relative h-72">
                        <img
                            src={restaurant.image || '/api/placeholder/800/600'}
                            alt={restaurant.name.gmaps}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {restaurant.name.gmaps}
                            </h2>
                            <div className="flex items-center space-x-4 text-white">
                                <div className="flex items-center">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                                    <span className="font-medium">
                                        {restaurant.ratings?.gmaps?.rating || 'N/A'}
                                    </span>
                                    <span className="text-white/80 ml-1">
                                        ({restaurant.ratings?.gmaps?.total_ratings || 0} reviews)
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="w-5 h-5 mr-1" />
                                    <span>{getPriceLevel(restaurant.price_level)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b">
                        <div className="flex px-6">
                            {['overview', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`px-6 py-4 font-medium capitalize transition-colors ${selectedTab === tab
                                            ? 'border-b-2 border-orange-500 text-orange-500'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(110vh-28rem)]">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        {selectedTab === 'overview' && (
                            <div className="space-y-8">
                                {/* External Links */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href={`https://www.google.com/maps/place/?q=place_id:${restaurant.additional_info.gmaps.place_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <img
                                            src={GoogleLogo}
                                            alt="Google Maps"
                                            className="w-6 h-6"
                                        />
                                        <span className="ml-2 font-medium">View on Google Maps</span>
                                    </a>
                                    {restaurant.additional_info?.yelp?.url && (
                                        <a
                                            href={restaurant.additional_info.yelp.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <img
                                                src="/images/yelp-logo.png"
                                                alt="Yelp"
                                                className="w-16 h-8"
                                            />
                                            <span className="ml-2 font-medium">View on Yelp</span>
                                        </a>
                                    )}
                                </div>


                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                        <p className="text-gray-600 font-bold">{getAddress(restaurant.location)}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Cuisine Types</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(restaurant.types?.gmaps || []).map((type, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                                                >
                                                    {type.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rating Summary */}
                                    <div className="bg-orange-50 rounded-lg p-6">
                                        <h3 className="font-semibold mb-4 flex items-center">
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            Rating Summary
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">Google Rating</p>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl font-bold">
                                                        {restaurant.ratings?.gmaps?.rating || 'N/A'}
                                                    </span>
                                                    <div className="flex">
                                                        {renderStars(restaurant.ratings?.gmaps?.rating || 0)}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {restaurant.ratings?.gmaps?.total_ratings || 0} reviews
                                                </p>
                                            </div>
                                            {restaurant.ratings?.yelp && (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-600">Yelp Rating</p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-2xl font-bold">
                                                            {restaurant.ratings?.yelp?.rating || 'N/A'}
                                                        </span>
                                                        <div className="flex">
                                                            {renderStars(restaurant.ratings?.yelp?.rating || 0)}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {restaurant.ratings?.yelp?.total_ratings || 0} reviews
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Recent Reviews Section */}
                                    <div className="space-y-6">
                                        {/* Google Reviews */}
                                        {googleReviews.length > 0 && (
                                            <ReviewPlatformSection
                                                platform="Google"
                                                reviews={googleReviews}
                                                platformUrl={`https://www.google.com/maps/place/?q=place_id:${restaurant.additional_info.gmaps.place_id}`}
                                            />
                                        )}

                                        {/* Yelp Reviews */}
                                        {yelpReviews.length > 0 && (
                                            <ReviewPlatformSection
                                                platform="Yelp"
                                                reviews={yelpReviews}
                                                platformUrl={restaurant.additional_info.yelp.url}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedTab === 'reviews' && (
                            <div className="space-y-6">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 gap-4">
                                            {reviews.map((review, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-gray-50 rounded-lg p-4 space-y-2"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <p className="font-medium">{review.author}</p>
                                                                <img
                                                                    src={review.platform === 'google' ? GoogleLogo : YelpLogo}
                                                                    alt={`${review.platform} logo`}
                                                                    className={review.platform === 'google' ? 'w-6 h-6' : 'w-16 h-8'}
                                                                />
                                                            </div>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <div className="flex">
                                                                    {renderStars(review.rating)}
                                                                </div>
                                                                <span className="text-sm text-gray-500">
                                                                    {formatDate(review.time)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 mt-2">{review.text}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
        </motion.div>
    </AnimatePresence >
  );
};

export default RestaurantDetailsModal;