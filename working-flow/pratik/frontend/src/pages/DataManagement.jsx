import React from 'react';
import DataTable from '../components/DataTable';

const DataManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Management</h2>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Search and Filter</h3>
        <p className="text-sm text-gray-500">Use the search bar to find specific content or filter by resource type.</p>
      </div>
      <DataTable />
    </div>
  );
};

export default DataManagement;

