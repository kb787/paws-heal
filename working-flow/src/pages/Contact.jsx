// src/pages/Contact.jsx
import React from "react";

const Contact = () => {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div>
          <h1 className="text-4xl font-bold text-neon-purple mb-4 hover:text-purple-500 transition duration-300">
            Get in Touch
          </h1>
          <p className="text-gray-400 mb-6 hover:text-neon-purple transition duration-300">
            Let’s discuss how Siva.AI can transform your enterprise operations
          </p>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                required
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-neon-purple text-neon-purple placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Last Name *"
                required
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-neon-purple text-neon-purple placeholder-gray-500"
              />
            </div>
            <input
              type="email"
              placeholder="Work Email *"
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-neon-purple text-neon-purple placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Company *"
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-neon-purple text-neon-purple placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Job Title *"
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-neon-purple text-neon-purple placeholder-gray-500"
            />
            <textarea
              placeholder="Message *"
              required
              rows="4"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-neon-purple text-neon-purple placeholder-gray-500"
            />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" className="w-5 h-5" />
              <label
                htmlFor="terms"
                className="text-gray-400 text-sm hover:text-neon-purple transition duration-300"
              >
                I agree to the{" "}
                <a href="#terms" className="text-neon-purple underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#privacy" className="text-neon-purple underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-neon-purple hover:bg-purple-500 text-black font-bold py-2 rounded transition duration-300 shadow-lg hover:shadow-neon-purple-glow"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-6">
          <div className="p-4 bg-gray-800 rounded hover:bg-gray-700 transition duration-300">
            <h2 className="text-lg font-bold mb-2 text-neon-purple hover:text-purple-500 transition duration-300">
              Email Us
            </h2>
            <p className="text-gray-400">contact@siva.ai</p>
          </div>
          <div className="p-4 bg-gray-800 rounded hover:bg-gray-700 transition duration-300">
            <h2 className="text-lg font-bold mb-2 text-neon-purple hover:text-purple-500 transition duration-300">
              Live Chat
            </h2>
            <p className="text-gray-400">
              Available 24/7 for enterprise clients
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded hover:bg-gray-700 transition duration-300">
            <h2 className="text-lg font-bold mb-2 text-neon-purple hover:text-purple-500 transition duration-300">
              Response Time
            </h2>
            <p className="text-gray-400">Within 24 hours</p>
          </div>
          <div className="p-4 bg-gray-800 rounded hover:bg-gray-700 transition duration-300">
            <h2 className="text-lg font-bold mb-2 text-neon-purple hover:text-purple-500 transition duration-300">
              Enterprise Support
            </h2>
            <p className="text-gray-400">Dedicated account management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
