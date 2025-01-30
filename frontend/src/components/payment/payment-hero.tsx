import React from 'react';
// import 'animate.css';

const HeroSection = () => {
  return (
    <section id="hero" className="bg-neutral-900 text-white pt-24 pb-16 min-h-[70vh] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8 animate__animated animate__fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate__animated animate__fadeInUp">
            Transform Customer Interactions with AI – Choose Your Plan Today!
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate__animated animate__fadeInUp animate__delay-1s">
            Boost engagement, automate support, and scale effortlessly with Conversly.ai. Whether you're a startup, growing business, or enterprise, we have the perfect plan for you!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate__animated animate__fadeInUp animate__delay-2s">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transform transition hover:scale-105 animate__animated animate__pulse animate__infinite">
              Get Started in Minutes – No Credit Card Required
            </button>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-1/2 -left-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-16 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </section>
  );
};

export default HeroSection;
