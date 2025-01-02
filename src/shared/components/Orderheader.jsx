import React, { useState } from "react";
import { Search, Plus, RefreshCw ,Trash2, Pencil} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import image3 from '/images/image3.jpeg';
import { toast } from "react-toastify";  // Import toast
import "react-toastify/dist/ReactToastify.css";  // Import toast CSS

const Orderheader = ({ order, setOrder, deleteOrder }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State to track the search query
  
  const editOrder = ({ _id }) => {
    navigate(`/Addorder/${_id}`); // Redirect to Add Order page with the order ID
  };
  
  // Function to handle search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.71:5000/api/order?search=${encodeURIComponent(searchQuery)}`
      );
      if (response.data.length === 0) {
        // Show toast message if no results are found
        toast.error("No orders found for the given search.");
      }
      setOrder(response.data); // Update the table data with search results
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Error fetching search results. Please try again.");
    }
  };
  

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
              placeholder="Search for Order ID ,Consigneer Name, Consigneer Mobile Number, Email, SKU, Pickup ID"
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Correctly update the query state
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key
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

      {/* Table Section */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 uppercase sticky top-0 text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Action</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Order ID</th>
              {[
                "ConsignerName",
                "consignermobileNumber",
                "consignerAddress",
                "consignermail",
                "consignerdistrict",
                "consignerstate",
                "consignerpincode",
                "Consigneename",
                "consigneemobileno",
                "consigneealterno",
                "consigneedistrict",
                "consigneeaddress",
                "consigneestate",
                "consigneepin",
                "productname",
                "packageWeight",
                "packagetype",
                "price",
              ].map((header) => (
                <th key={header} className="px-6 py-3 text-left font-semibold text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order?.length > 0 ? (
              order.map((user, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="px-6 py-4">
                    <button
                        onClick={() => editOrder({ _id: user._id })}
                      className="text-purple-500 hover:underline ml-4"
                    >
                      < Pencil />
                    </button>
                    <button
                      onClick={() => deleteOrder({ _id: user._id })}
                      className="text-red-500 hover:underline ml-4"
                    >
                       <Trash2 />
                    </button>
                  </td>
                  <td className="px-6 py-4">{user.orderId}</td>
                  <td className="px-6 py-4">{user.ConsignerName}</td>
                  <td className="px-6 py-4">{user.consignermobileNumber}</td>
                  <td className="px-6 py-4">{user.consignerAddress}</td>
                  <td className="px-6 py-4">{user.consignermail}</td>
                  <td className="px-6 py-4">{user.consignerdistrict}</td>
                  <td className="px-6 py-4">{user.consignerstate}</td>
                  <td className="px-6 py-4">{user.consignerpincode}</td>
                  <td className="px-6 py-4">{user.Consigneename}</td>
                  <td className="px-6 py-4">{user.consigneemobileno}</td>
                  <td className="px-6 py-4">{user.consigneealterno}</td>
                  <td className="px-6 py-4">{user.consigneedistrict}</td>
                  <td className="px-6 py-4">{user.consigneeaddress}</td>
                  <td className="px-6 py-4">{user.consigneestate}</td>
                  <td className="px-6 py-4">{user.consigneepin}</td>
                  <td className="px-6 py-4">{user.productname}</td>
                  <td className="px-6 py-4">{user.packageWeight}</td>
                  <td className="px-6 py-4">{user.packagetype}</td>
                  <td className="px-6 py-4">{user.price}</td>
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
                    <p className="text-gray-600 mt-4">Add your first order to get started</p>
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
