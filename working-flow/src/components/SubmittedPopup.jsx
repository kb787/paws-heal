import React, { useState } from 'react';

function SubmittedPopup() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-bold">Submitted Successfully!</p>
            <button
              onClick={handleClosePopup}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmittedPopup;