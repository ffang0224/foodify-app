import React from 'react';
import { Star, BookOpen, MessageSquare } from 'lucide-react';

const PointsDisplay = ({ points = { generalPoints: 0, postPoints: 0, reviewPoints: 0 } }) => {
  const totalPoints = Object.values(points).reduce((a, b) => a + b, 0);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600">Total Points</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-orange-600">{totalPoints}</p>
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600">List Points</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-orange-600">{points.generalPoints}</p>
          <BookOpen className="w-6 h-6 text-orange-500" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Earned from creating lists</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600">Post Points</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-orange-600">{points.postPoints}</p>
          <Star className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Earned from posts</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600">Review Points</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-orange-600">{points.reviewPoints}</p>
          <MessageSquare className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Earned from reviews</p>
      </div>
    </div>
  );
};

export default PointsDisplay;