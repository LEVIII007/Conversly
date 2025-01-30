"use client";

import React from "react";

const ShareButtons = () => {
  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <section id="shareButtons" className="bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">Share this article</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Twitter Share */}
            <a href="#" className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-opacity-90 transition-all">
              <span>Twitter</span>
            </a>
            
            {/* LinkedIn Share */}
            <a href="#" className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-opacity-90 transition-all">
              <span>LinkedIn</span>
            </a>
            
            {/* Facebook Share */}
            <a href="#" className="flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-opacity-90 transition-all">
              <span>Facebook</span>
            </a>
            
            {/* Copy Link */}
            <button onClick={copyPageUrl} className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all">
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareButtons;
