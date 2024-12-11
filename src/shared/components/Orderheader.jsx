import React from "react";
import { Search, Plus, RefreshCw } from "lucide-react"; // Replace with your icons
import image3 from "/images/image3.jpeg";
import { useNavigate } from "react-router-dom";

const Orderheader = ({order}) => {
  const navigate = useNavigate();

  console.log(order)
  return (
    <div className="p-4">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg sm:text-xl font-semibold">Orders</h1>
          <select className="px-3 py-1.5 border rounded-md bg-white text-sm sm:text-base">
            <option>All</option>
            <option>Domestic</option>
            <option>International</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for AWB, Order ID, Buyer Mobile Number, Email, SKU, Pickup ID"
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex gap-4">
          <button onClick={() => navigate("/Addorder")} className="flex items-center gap-2 px-4 py-2 text-purple-600 bg-purple-50 rounded-md">
            <Plus className="h-4 w-4" />
            Add Order
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-md">
            <RefreshCw className="h-4 w-4" />
            Sync Orders
          </button>
        </div>
      </header>

      {/* Tabs Section */}
      <div class="border-b">
        <ul class="flex gap-8 px-4">
          <li>
            <a
              href="#"
              class="block py-2 text-gray-900 font-medium hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600"
            >
              New
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block py-2 text-gray-900 font-medium hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600"
            >
              Ready To Ship
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block py-2 text-gray-900 font-medium hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600"
            >
              Pickups & Manifests
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block py-2 text-gray-900 font-medium hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600"
            >
              In Transit
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block py-2 text-gray-900 font-medium hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600"
            >
              Delivered
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block py-2 text-gray-900 font-medium hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600"
            >
              RTO
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block py-2 text-gray-900 font-medium hover:text-purple-600 border-b-2 border-transparent hover:border-purple-600"
            >
              All
            </a>
          </li>
        </ul>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <select className="px-3 py-1.5 border rounded-md bg-white text-sm sm:text-base">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="px-3 py-1.5 border text-purple-600 border-purple-600 rounded-md text-sm">
            More Filters
          </button>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 border rounded-md">
            <span>Bulk Action</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">orderId</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">orderDate</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">customerName</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">contact</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">productName</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">amountPaid</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">status</th>
            </tr>
          </thead>
          <tbody>
            {order?.length > 0 ? (
              order.map((user, index) => (
                <tr key={index}>
                  <td className="pl-6">{user.orderId}</td>
                  <td className="pl-4">{user.orderDate}</td>
                  <td className="pl-6">{user.customerName}</td>
                  <td className="pl-3">{user.contact}</td>
                  <td className="pl-6">{user.productName}</td>
                  <td className="pl-6">{user.amountPaid}</td>
                  <td className="pl-4">{user.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-10">
                  <div className="flex flex-col items-center">
                    <div className="mt-16">
                      <img src={image3} alt="Illustration" className="w-52 h-52 object-contain" />
                    </div>
                    <p className="text-gray-600 mt-4">Add your first order to get started</p>
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => navigate("/Addorder")}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md"
                      >
                        Add Order
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md">
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
