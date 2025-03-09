import React from 'react';
import TypedHeading from './TypedHeading';
import ChatBox from './ChatBox';

function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-customColor  "></div>
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12 ">
        <div className="flex-1">
          <TypedHeading />
          <p className="text-xl text-gray-300 mb-8">
            Redefining how employees interact with enterprise resources through advanced AI technology.
          </p>
        </div>
        <div className="flex-1">
          <ChatBox />
        </div>
      </div>
    </section>
  );
}

export default Hero;