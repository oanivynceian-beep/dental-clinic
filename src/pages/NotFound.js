import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          This site is not available as of the moment.
        </p>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 max-w-md mx-auto">
          <p className="text-sm mt-2">
          </p>
        </div>
      </div>
    </div>
  );
}
