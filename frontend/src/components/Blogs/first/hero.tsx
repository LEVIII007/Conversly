import React from "react";

const BlogHero = () => {
  return (
    <section id="blogHero" className="bg-neutral-900 text-white min-h-[70vh] pt-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate__animated animate__fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            How to Create an Optimized and High-Performing Chatbot for Your Website Using Conversly.ai
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-8 animate__animated animate__fadeIn animate__delay-1s">
              Chatbots have become an essential tool for modern websites, enhancing customer engagement, automating responses, and improving overall user experience. However, simply integrating a chatbot isn't enough; optimization is key to ensuring it works effectively. In this blog, we'll explore how to create an optimized and better-working chatbot using Conversly.ai.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8 animate__animated animate__fadeIn animate__delay-2s">
            <div className="flex items-center text-sm text-neutral-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              10 min read
            </div>
            <div className="flex items-center text-sm text-neutral-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Published: Oct 2023
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-800 to-transparent"></div>
    </section>
  );
};

export default BlogHero;
