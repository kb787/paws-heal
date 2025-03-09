import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import KnowledgeBase from './pages/KnowledgeBase';
import DataManagement from './pages/DataManagement';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<KnowledgeBase />} />
            <Route path="/data-management" element={<DataManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

