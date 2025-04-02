import React from 'react';
import KnowledgeBaseForm from '../components/KnowledgeBaseForm';

const KnowledgeBase = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Knowledge Base</h2>
      <KnowledgeBaseForm />
    </div>
  );
};

export default KnowledgeBase;

