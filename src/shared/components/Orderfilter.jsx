import React from 'react';
import { Filter, Download } from 'lucide-react';

const OrderFilter = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <select className="px-3 py-1.5 border rounded-md bg-white">
          <option>Last 30 days</option>
          <option>Last 60 days</option>
          <option>Last 90 days</option>
        </select>
        <button className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Download className="h-5 w-5 text-gray-600" />
        </button>
        <button className="px-4 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-md">
          Select Bulk Action
        </button>
      </div>
    </div>
  );
};

export default OrderFilter;