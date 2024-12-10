import React from "react";

const MessageModal = ({ show, title, subtitle, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        {/* Modal Header */}
        <h3 className="text-2xl font-bold text-orange-600 mb-2">
          {title || "Notification"}
        </h3>

        {/* Modal Subtitle */}
        {subtitle && (
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            {subtitle}
          </h4>
        )}

        {/* Modal Message */}
        <p className="text-gray-700">{message || "Details go here."}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
