import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent">
              SiVA.ai
            </h3>
            <p className="text-gray-400">
              Redefining enterprise interaction through advanced AI technology.
            </p>
          </div>
          <div>
            <h4 className="text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-neon-purple transition-colors">Features</a></li>
              <li><a href="#demo" className="text-gray-400 hover:text-neon-purple transition-colors">Demo</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-neon-purple transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@siva.ai</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          © {currentYear} SiVA.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}