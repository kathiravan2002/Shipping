import React from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';

const Orderheader = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Orders</h1>
        <select className="px-3 py-1.5 border rounded-md bg-white">
          <option>Domestic</option>
          <option>International</option>
        </select>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search for AWB, Order ID, Buyer Mobile Number, Email, SKU, Pickup ID"
            className="pl-10 pr-4 py-2 border rounded-md w-[500px]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-md">
          <Plus className="h-4 w-4" />
          Add Order
        </button>
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-md">
          <RefreshCw className="h-4 w-4" />
          Sync Orders
        </button>
      </div>
    </header>
  );
};

export default Orderheader;