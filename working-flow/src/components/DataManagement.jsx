import React from "react";
import DataTable from "./DataTable";

const DataManagement = () => {
  return (
    <div className="flex flex-col w-[98%] p-[2%] mt-[5%]">
  <h2 className="text-2xl font-bold text-white text-center">Data Management</h2>
  <div className="mt-[2%] w-full py-[1%] px-[3%]">
    <h3 className="text-lg font-semibold text-white text-left">Search and Filter</h3>
    <p className="text-sm text-white text-left">
      Use the search bar to find specific content or filter by resource type.
    </p>
  </div>
  <div className="w-[98%] px-[2%] flex justify-center items-center">
    <DataTable />
  </div>
</div>
  );
};

export default DataManagement;
