import React from "react";

const MessageModal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
        <p className="text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
