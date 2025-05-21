"use client"

import React from "react";

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-2">
      <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/60 to-pink-50/60 backdrop-blur-lg rounded-3xl px-8 py-10 flex flex-col items-center max-w-md w-full border border-transparent">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Excellence Arrives Soon
        </h2>
        <p className="text-base text-gray-600 mb-2 text-center">
          A new era of learning is on its way.
        </p>
      </div>
    </div>
  );
}