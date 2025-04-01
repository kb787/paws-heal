import React from "react";
import DataTable from "./DataTable";

const DataManagement = () => {
  return (
    <div className="space-y-6 ml-80 mt-24 ">
      <h2 className="text-2xl font-bold text-white">Data Management</h2>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Search and Filter</h3>
        <p className="text-sm text-white">
          Use the search bar to find specific content or filter by resource
          type.
        </p>
      </div>
      <DataTable />
    </div>
  );
};

export default DataManagement;
