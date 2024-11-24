import React from "react";

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-orange-500 mb-6">FAQ & Help</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">How do I create a playlist?</h3>
            <p>
              To create a playlist, go to the "Lists" page and click the "Create Playlist" button. You can add your favorite restaurants to the playlist by selecting them from the map or the restaurant list.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">How do I navigate the app?</h3>
            <p>
              Use the navigation bar at the top to access different sections of the app, including the map, playlists, and your profile page. You can easily switch between them using the buttons provided.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Why can't I find my restaurant?</h3>
            <p>
            The app currently works within the scope of restaurants located within the 10003 postal code area, which includes neighborhoods like Union Square, Gramercy, and East Village. Make sure your restaurant is located within this area and that the correct location is enabled. If you're still having trouble, try refreshing the restaurant cache or checking the map.
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
