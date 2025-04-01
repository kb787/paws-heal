import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Mentorship from './pages/Mentorship';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/"
              element={
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 to-gray-800">
                  <div className="text-center px-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text sm:text-6xl md:text-7xl">
                      Welcome to Siva.AI
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                      Empowering organizations with intelligent, scalable solutions for IT, HR, and operational excellence.
                    </p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;