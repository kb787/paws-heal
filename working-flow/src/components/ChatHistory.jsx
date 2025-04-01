import React from "react";

const ChatHistory = () => {
  const historyItems = [
    {
      category: "Network and Connectivity",
      question: "What should I do if the internet is slow?",
      timestamp: new Date(),
    },
    {
      category: "Password and Account",
      question: "How can I change my email password?",
      timestamp: new Date(),
    },
    {
      category: "Network and Connectivity",
      question: "Why can't I connect to Wi-Fi?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    },
    {
      category: "Printing and Scanning",
      question: "Why is my print job stuck in the queue?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    },
  ];

  const groupByDate = (items) => {
    const groups = {
      Today: [],
      Yesterday: [],
    };

    items.forEach((item) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (item.timestamp.toDateString() === today.toDateString()) {
        groups.Today.push(item);
      } else if (item.timestamp.toDateString() === yesterday.toDateString()) {
        groups.Yesterday.push(item);
      }
    });

    return groups;
  };

  const groupedHistory = groupByDate(historyItems);

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-32">
      {Object.entries(groupedHistory).map(([date, items]) =>
        items.length > 0 ? (
          <div key={date} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {date}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => console.log("Clicked:", item.question)}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-left"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {item.category}
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {item.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default ChatHistory;
