import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Star,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    X,
    Loader2,
    Globe,
    Maximize2
} from 'lucide-react';

const ImageModal = ({ image, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        onClick={onClose}
    >
        <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
            <X className="w-6 h-6 text-white" />
        </button>
        <img
            src={image}
            alt="Restaurant"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={e => e.stopPropagation()}
        />
    </div>
);

const RestaurantDetails = ({ restaurant, onClose }) => {
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFullImage, setShowFullImage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch photos
                const photosResponse = await fetch(
                    `https://foodify-backend-927138020046.us-central1.run.app/restaurant-photos/${restaurant.additional_info.gmaps.place_id}`
                );
                const photosData = await photosResponse.json();
                setPhotos(photosData.photo_urls || []);

                // Fetch reviews
                const reviewsResponse = await fetch(
                    `https://foodify-backend-927138020046.us-central1.run.app/restaurants/${restaurant.additional_info.gmaps.place_id}/reviews`
                );
                const reviewsData = await reviewsResponse.json();
                setReviews(reviewsData.reviews || []);
            } catch (err) {
                console.error("Error fetching restaurant details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (restaurant) {
            fetchData();
        }
    }, [restaurant]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-3xl mx-4">
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Photo Carousel - Now Larger */}
                <div className="relative h-96"> {/* Increased height */}
                    {photos.length > 0 ? (
                        <>
                            <div className="relative h-full">
                                <img
                                    src={photos[currentPhotoIndex]}
                                    alt={`Restaurant ${currentPhotoIndex + 1}`}
                                    className="w-full h-full object-cover rounded-t-xl"
                                />
                                <button
                                    onClick={() => setShowFullImage(true)}
                                    className="absolute top-4 left-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                >
                                    <Maximize2 className="w-5 h-5 text-white" />
                                </button>
                            </div>
                            {photos.length > 1 && (
                                <>
                                    <button
                                        onClick={prevPhoto}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-white" />
                                    </button>
                                    <button
                                        onClick={nextPhoto}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6 text-white" />
                                    </button>

                                    {/* Thumbnail Strip */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 rounded-full">
                                        {photos.map((photo, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPhotoIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-colors ${index === currentPhotoIndex
                                                        ? "bg-white"
                                                        : "bg-white/50 hover:bg-white/75"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-t-xl flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">No photos available</p>
                        </div>
                    )}
                </div>

                {/* Restaurant Info */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        {restaurant.name.gmaps}
                    </h2>

                    <div className="space-y-4">
                        {/* Rating and Price */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                                <span className="font-medium text-gray-800 dark:text-white">
                                    {restaurant.ratings?.gmaps?.rating || "N/A"}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">
                                    ({restaurant.ratings?.gmaps?.total_ratings || 0} reviews)
                                </span>
                            </div>
                            <div className="flex items-center">
                                <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {"$".repeat(restaurant.price_level?.gmaps?.normalized || 1)}
                                </span>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start">
                            <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                            <p className="ml-2 text-gray-600 dark:text-gray-300">
                                {restaurant.location?.gmaps?.address || "Address not available"}
                            </p>
                        </div>

                        {/* Cuisine Types */}
                        <div className="flex flex-wrap gap-2">
                            {restaurant.types?.gmaps?.map((type, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-sm"
                                >
                                    {type.replace(/_/g, " ")}
                                </span>
                            ))}
                        </div>

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                    Recent Reviews
                                </h3>
                                <div className="space-y-4">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="border-b dark:border-gray-700 pb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        {review.author?.[0] || "?"}
                                                    </div>
                                                    <div className="ml-2">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            {review.author}
                                                        </span>
                                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                            <Globe className="w-3 h-3 mr-1" />
                                                            {review.platform}
                                                            <span className="mx-1">•</span>
                                                            {formatDate(review.time)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {review.rating}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                {review.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Fullscreen Image Modal */}
                {showFullImage && photos.length > 0 && (
                    <ImageModal
                        image={photos[currentPhotoIndex]}
                        onClose={() => setShowFullImage(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default RestaurantDetails;