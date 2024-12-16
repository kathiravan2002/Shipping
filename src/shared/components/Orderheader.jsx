import React from "react";
import { Search, Plus, RefreshCw } from "lucide-react"; // Replace with your icons
import image3 from "/images/image3.jpeg";
import { useNavigate } from "react-router-dom";

const Orderheader = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg sm:text-xl font-semibold">Orders</h1>
          <select className="px-3 py-2 border rounded-md bg-white text-sm">
            <option>All</option>
            <option>Domestic</option>
            <option>International</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for AWB, Order ID, Buyer Mobile Number, Email, SKU, Pickup ID"
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/Addorder")}
            className="flex items-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 rounded-md text-sm"
          >
            <Plus className="h-5 w-5" />
            Add Order
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-sm">
            <RefreshCw className="h-5 w-5" />
            Sync Orders
          </button>
        </div>
      </header>

      {/* Tabs Section */}
      <div className="border-b">
        <ul className="flex flex-wrap gap-4 md:gap-8 px-4 overflow-x-auto">
          {["New", "Ready To Ship", "Pickups & Manifests", "In Transit", "Delivered", "RTO", "All"].map((tab) => (
            <li key={tab}>
              <a
                href="#"
                className="block py-2 text-gray-900 font-medium hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600"
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4">
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 border rounded-md bg-white text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="px-3 py-2 border text-purple-600 border-purple-600 rounded-md text-sm">
            More Filters
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center px-4 py-2 border rounded-md text-sm">
            <span>Bulk Action</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full">
          <thead className="uppercase bg-gray-200 text-sm">
            <tr>
              {["Order ID", "Order Date", "Customer Name", "Contact", "Product Name", "Quantity", "Amount Paid", "Status"].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-medium text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order?.length > 0 ? (
              order.map((user, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="px-4 py-2">{user.orderId}</td>
                  <td className="px-4 py-2">{user.orderDate}</td>
                  <td className="px-4 py-2">{user.customerName}</td>
                  <td className="px-4 py-2">{user.contact}</td>
                  <td className="px-4 py-2">{user.productName}</td>
                  <td className="px-4 py-2">{user.quantity}</td>
                  <td className="px-4 py-2">{user.amountPaid}</td>
                  <td className="px-4 py-2">{user.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-10">
                  <div className="flex flex-col items-center">
                    <img
                      src={image3}
                      alt="Illustration"
                      className="w-32 h-32 object-contain"
                    />
                    <p className="text-gray-600 mt-4">
                      Add your first order to get started
                    </p>
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => navigate("/Addorder")}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm"
                      >
                        Add Order
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm">
                        Sync Website Orders
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orderheader;
