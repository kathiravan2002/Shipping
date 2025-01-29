import React, { useState, useEffect } from "react";
import { Search, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import image3 from "/images/image3.jpeg";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Trash2, Pencil, ChevronsLeft, ChevronsRight, FileText } from "lucide-react";
import Exportdata from "./Exportdata";


const Orderheader = ({ order, deleteOrder, setOrder, downloadinvoice }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State to track the search query
  const editOrder = ({ _id }) => {
    navigate(`/Addorder/${_id}`); // Redirect to Add Order page with the order ID
  };
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = order.slice(indexOfFirstRow, indexOfLastRow);
  const totalRows = order.length; // Total number of rows in the dataset
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Helper function to generate the page numbers dynamically
  const getPageNumbers = () => {
    const maxPageNumbers = 3; // Maximum number of page numbers to display at once
    const pages = [];

    const startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1); // Start page for the displayed range
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages); // End page for the displayed range

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i); // Add pages to the array
    }

    return pages;
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10)); // Update the rows per page
    setCurrentPage(1); // Reset to the first page
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
            <option>Today</option>
            <option>Yesterday</option>
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
          <Exportdata data={order} fileName="orders.csv" />
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
      <div
        className="overflow-x-auto shadow-md rounded-lg"
        style={{
          marginRight: "16px", // Margin on the right
          maxHeight: "650px", // Optional: Set max height if needed for vertical scroll
        }}
      >
        <table className="w-full border-collapse ">
          <thead className="bg-gray-200 uppercase text-sm sticky top-0">
            <tr>
              <th>Action</th>
              <th>Invoice</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 sticky  top-0 bg-gray-200 ">
                InvoiceNo
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-600 sticky  top-0 bg-gray-200 ">
              Orderstatus
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 sticky  top-0 bg-gray-200 ">
                Orderid
              </th>
             

              {[
                "ConsignerName",
                "consignermobileNumber",
                "consignerAddress",
                "consignercity",
                "consignermail",
                "consignerdistrict",
                "consignerstate",
                "consignerpincode",
                "Consigneename",
                "consigneemobileno",
                "consigneealterno",
                "consigneedistrict",
                "consigneeaddress",
                "consigneecity",
                "consigneestate",
                "consigneepin",
                "packagename",
                "No.of.Package",
                "packageWeight",
                "packagetype",
                "price",
                "Dispatchregion"
                
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left font-semibold text-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order?.length > 0 ? (
              currentRows.map((user, index) => (
                <tr key={index} className="border-t text-sm  hover:bg-gray-100 rounded-lg">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => editOrder({ _id: user._id })}
                      className="text-purple-500 hover:underline ml-4"
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={() => deleteOrder({ _id: user._id })}
                      className="text-red-500 hover:underline ml-4"
                    >
                      {" "}
                      {console.log(user._id)}
                      <Trash2 />
                    </button></td>
                  <td>  <button
                    onClick={() => downloadinvoice(user._id)}
                    className="text-red-500 hover:underline ml-4"
                  >
                    {" "}
                    {console.log(user._id)}
                    <FileText />
                  </button>
                  </td>
                  <td className="px-6 py-4  font-medium">{user.invoiceNo}</td>

                  <td className="px-6 py-4">{user.Orderstatus}</td>
                  <td className="px-6 py-4 font-medium">
                    {user.orderId}
                  </td>

                   
                  <td className="px-6 py-4">{user.ConsignerName}</td>
                  <td className="px-6 py-4">{user.consignermobileNumber}</td>
                  <td className="px-6 py-4">{user.consignerAddress}</td>
                  <td className="px-6 py-4">{user.consignercity}</td>
                  <td className="px-6 py-4">{user.consignermail}</td>
                  <td className="px-6 py-4">{user.consignerdistrict}</td>
                  <td className="px-6 py-4">{user.consignerstate}</td>
                  <td className="px-6 py-4">{user.consignerpincode}</td>
                  <td className="px-6 py-4">{user.Consigneename}</td>
                  <td className="px-6 py-4">{user.consigneemobileno}</td>
                  <td className="px-6 py-4">{user.consigneealterno}</td>
                  <td className="px-6 py-4">{user.consigneedistrict}</td>
                  <td className="px-6 py-4">{user.consigneeaddress}</td>
                  <td className="px-6 py-4">{user.consigneecity}</td>
                  <td className="px-6 py-4">{user.consigneestate}</td>
                  <td className="px-6 py-4">{user.consigneepin}</td>
                  <td className="px-6 py-4">{user.productname}</td>
                  <td className="px-6 py-4">{user.noofpackage}</td>
                 
                  <td className="px-6 py-4">{user.packageWeight}</td>
                  <td className="px-6 py-4">{user.packagetype}</td>
                  <td className="px-6 py-4">{user.price}</td>
                  <td className="px-6 py-4">{user.dispatchpincode}</td>

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
      <div className="flex justify-between items-center mt-4">
        {/* Left Side: Showing rows info */}
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, totalRows)} of {totalRows}
        </div>

        <div className="flex-1 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1} // Disable if on the first page
            className={`px-3 py-1 rounded-ss-3xl border  ${currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Styling for disabled button
                : "bg-white text-gray-700 hover:bg-purple-700 hover:text-white" // Styling for enabled button
              }`}
          >
            <ChevronsLeft />
          </button>
          {/* Ellipses and Start Page */}
          {currentPage > 3 && totalPages > 5 && (
            <>
              <button
                onClick={() => handlePageChange(1)} // Navigate to the first page
                className="px-3 py-1 rounded-full border bg-white text-gray-700 hover:bg-gray-100"
              >
                1
              </button>
              {currentPage > 4 && <span className="px-2">...</span>} {/* Ellipses for skipped pages */}
            </>
          )}

          {/* Dynamic Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)} // Navigate to the selected page
              className={`px-3 py-1 rounded-full border ${currentPage === page
                  ? "bg-purple-600 text-white" // Styling for active page
                  : "bg-white text-gray-700 hover:bg-gray-100" // Styling for inactive pages
                }`}
            >
              {page}
            </button>
          ))}

          {/* Ellipses and Last Page */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {currentPage < totalPages - 3 && <span className="px-2">...</span>} {/* Ellipses for skipped pages */}
              <button
                onClick={() => handlePageChange(totalPages)} // Navigate to the last page
                className="px-3 py-1 rounded-full border bg-white text-gray-700 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)} // Move to the next page
            disabled={currentPage === totalPages} // Disable if on the last page
            className={`px-3 py-1 rounded-se-3xl border ${currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Styling for disabled button
                : "bg-white text-gray-700 hover:bg-purple-700 hover:text-white " // Styling for enabled button
              }`}
          >
            <ChevronsRight />
          </button>
        </div>
        <div className="flex items-center gap-2 mr-4"><span className="text-sm text-gray-600">Total Records:{totalRows} </span></div>
        <div className="flex items-center gap-2 mr-4"> <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange} // Update rows per page and reset to page 1
            className="px-2 py-1 border border-gray-300 rounded-full bg-white text-gray-700 "
          >
            {[10, 20, 50, 100].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>

      </div>

    </div>
  );
};

export default Orderheader;
