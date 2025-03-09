import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`
        bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700
        ${hover ? 'hover:border-gray-600 transition-colors duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
