import React from "react";
import { RefreshCw } from "lucide-react";

const RefreshCacheButton = () => {
  const refreshCache = async () => {
    try {
      await fetch("https://foodify-backend-927138020046.us-central1.run.app/admin/refresh-restaurant-cache", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to refresh cache:", error);
    }
  };

  return (
    <button
      onClick={refreshCache}
      className="p-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
      title="Refresh restaurant cache"
    >
      <RefreshCw className="w-5 h-5" />
    </button>
  );
};

export default RefreshCacheButton;
