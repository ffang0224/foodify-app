import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { Loader, Trophy, ArrowLeft } from "lucide-react";
import { formatString } from "../utils/stringUtils";

const AchievementsPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuthUser();

  const [achievements, setAchievements] = useState([]);
  const [unclaimedAchievements, setUnclaimedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!userData) return;

      try {
        // Fetch user achievements
        const userResponse = await fetch(
          `https://foodify-backend-927138020046.us-central1.run.app/users/${userData.username}/achievements`
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user achievements.");
        }

        const userAchievements = await userResponse.json();

        // Fetch all available achievements
        const allResponse = await fetch(
          `https://foodify-backend-927138020046.us-central1.run.app/achievements`
        );

        if (!allResponse.ok) {
          throw new Error("Failed to fetch all achievements.");
        }

        const allAchievements = await allResponse.json();

        // Separate claimed and unclaimed achievements
        const claimedIds = new Set(userAchievements.map((a) => a.id));
        const unclaimed = allAchievements.filter((a) => !claimedIds.has(a.id));

        // Sort achievements by points in descending order
        const sortedClaimed = userAchievements.sort(
          (a, b) => b.points - a.points
        );
        const sortedUnclaimed = unclaimed.sort((a, b) => a.points - b.points);

        setAchievements(sortedClaimed);
        setUnclaimedAchievements(sortedUnclaimed);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading achievements...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Your Achievements
        </h1>
        {achievements.length === 0 && unclaimedAchievements.length === 0 ? (
          <p className="text-gray-600">
            No achievements available at the moment.
          </p>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center p-6 bg-orange-50">
                    <Trophy className="w-12 h-12 text-orange-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 text-center">
                      {formatString(achievement.id)}
                    </h3>
                    <p className="text-gray-600 mt-2 text-center">
                      <strong>{achievement.points}</strong> Points
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {unclaimedAchievements.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
                  Unclaimed Achievements
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {unclaimedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-gray-200 rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-center p-6 bg-gray-300">
                        <Trophy className="w-12 h-12 text-black" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 text-center">
                          {formatString(achievement.id)}
                        </h3>
                        <p className="text-gray-600 mt-2 text-center">
                          <strong>{achievement.points}</strong> Points
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
