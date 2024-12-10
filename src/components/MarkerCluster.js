import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { MarkerF, MarkerClusterer } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const OptimizedMarkers = ({ restaurants, onMarkerClick, createMarkerIcon }) => {
    const [mapLoaded, setMapLoaded] = useState(false);

    const markers = useMemo(() =>
        restaurants
            .filter(r => r.location?.gmaps?.lat && r.location?.gmaps?.lng)
            .map(restaurant => ({
                position: {
                    lat: restaurant.location.gmaps.lat,
                    lng: restaurant.location.gmaps.lng
                },
                data: restaurant
            }))
        , [restaurants]);

    useEffect(() => {
        const timer = setTimeout(() => setMapLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const options = {
        minimumClusterSize: 4,
        gridSize: 60,
    };

    const renderMarker = useCallback(({ position, data }) => (
        <MarkerF
            position={position}
            icon={{
                url: createMarkerIcon(MapPin, '#f97316', 40),
                scaledSize: new window.google.maps.Size(25, 25),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(12.5, 40)
            }}
            label={{
                text: data.name.gmaps.substring(0, 20),
                className: 'bg-white mt-16 px-2 py-1 rounded-md shadow-sm text-gray-800 font-medium',
                fontSize: '15px',
                anchor: new window.google.maps.Point(20, -10),
            }}
            onClick={() => onMarkerClick(data)}
            visible={mapLoaded}
        />
    ), [onMarkerClick, createMarkerIcon, mapLoaded]);

    if (!markers.length) return null;

    return (
        <MarkerClusterer options={options}>
            {(clusterer) =>
                markers.map((markerData) => (
                    <div key={markerData.data.additional_info.gmaps.place_id}>
                        {React.cloneElement(renderMarker(markerData), { clusterer })}
                    </div>
                ))
            }
        </MarkerClusterer>
    );
};

export default OptimizedMarkers;