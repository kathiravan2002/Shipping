import React, { useState } from "react";
import axios from "axios";
import tracking from  "/assets/images/tracking.jpeg"

const Trackorder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.71:5000/api/order/track/${orderId}`
      );
      setOrder(response.data);
      setError("");
    } catch (err) {
      setOrder(null);
      setError("Tracking ID not found");
    }
  };

  const SectionHeader = ({ title }) => (
    <div className="bg-purple-700 text-white px-6 py-3 font-semibold text-lg">
      {title}
    </div>
  );

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get status color
  const getStatusColor = (status) => {
    const statusColors = {
      'Order Placed': 'bg-blue-500',
      'Order Dispatched': 'bg-yellow-500',
      'Out for Delivery': 'bg-orange-600',
      'Delivered': 'bg-green-500',
      'default': 'bg-purple-500'
    };
    return statusColors[status] || statusColors.default;
  };

  return (
    <div className="min-h-screen bg-cover bg-fixed bg-no-repeat"    >
    <div className="max-w-4xl mx-auto p-4 mt-24">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
        <div className="flex gap-4 justify-center">
          <input
            type="text"
            placeholder="Enter Your Tracking ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="px-4 py-2 border-2 border-purple-500 rounded-md w-64"
          />
          <button
            type="submit"
            onClick={fetchOrderStatus}
            className="px-6 py-2 bg-purple-700 text-white rounded-md hover:bg-[#9443f1f8]"
          >
            Track
          </button>
        </div>
        {error && (
          <p className="text-red-500 mt-2 font-medium text-center">{error}</p>
        )}
      </div>

      {order && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="Booking Details" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
              <div>
                <div className="text-gray-600 text-sm">Booking Date</div>
                <div className="font-medium">{order.Bookingdate}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">From</div>
                <div className="font-medium text-blue-600">{order.From}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">To</div>
                <div className="font-medium text-blue-600">{order.To}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Packages</div>
                <div className="font-medium">{order.Packages}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Delivery Type</div>
                <div className="font-medium">Office</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="Current Status" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              <div>
                <div className="text-gray-600 text-sm">Consignment Status</div>
                <div className="mt-1">
                  <span className={`px-3 py-1 ${getStatusColor(order.currentStatus)} text-white rounded-md`}>
                    {order.currentStatus}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Last Updated</div>
                <div className="font-medium">
                  {order.statusHistory && order.statusHistory.length > 0
                    ? formatDate(order.statusHistory[order.statusHistory.length - 1].timestamp)
                    : order.Bookingdate}
                </div>
              </div>
            </div>
          </div>

          {/* New Status History Timeline Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="Status Timeline" />
            <div className="p-6">
              <div className="space-y-6">
                {order.statusHistory && order.statusHistory.map((status, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline line */}
                    {index !== order.statusHistory.length - 1 && (
                      <div className="absolute top-6 left-3 h-full w-0.5 bg-gray-200"></div>
                    )}
                    
                    {/* Status dot */}
                    <div className={`${getStatusColor(status.status)} rounded-full w-6 h-6 flex items-center justify-center shrink-0 z-10`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Status content */}
                    <div className="ml-4 pb-6">
                      <div className="font-semibold text-lg">{status.status}</div>
                      <div className="text-sm text-gray-600">{formatDate(status.timestamp)}</div>
                      {status.location && (
                        <div className="text-sm text-gray-700 mt-1">Location: {status.location}</div>
                      )}
                      {status.notes && (
                        <div className="text-sm text-gray-600 mt-1">{status.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="Delivery Details" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              <div>
                <div className="text-gray-600 text-sm">Consignment At</div>
                <div className="font-medium">{order.Consignment}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Reached Date</div>
                <div className="font-medium">
                  {order.statusHistory && order.statusHistory.length > 0
                    ? formatDate(order.statusHistory[order.statusHistory.length - 1].timestamp)
                    : order.Bookingdate}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Delivery Status</div>
                <div className="font-medium">{order.currentStatus}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Delivery Date</div>
                <div className="font-medium">
                  {order.statusHistory && 
                   order.statusHistory.find(s => s.status === 'Delivered')?.timestamp
                    ? formatDate(order.statusHistory.find(s => s.status === 'Delivered').timestamp)
                    : 'Pending'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Trackorder;



// import React, { useState } from "react";
// import axios from "axios";

// const Trackorder = () => {
//   const [orderId, setOrderId] = useState("");
//   const [order, setOrder] = useState(null);
//   const [error, setError] = useState("");

//   const fetchOrderStatus = async () => {
//     try {
//       const response = await axios.get(
//         `http://192.168.29.71:5000/api/order/track/${orderId}`
//       );
//       setOrder(response.data);
//       setError("");
//     } catch (err) {
//       setOrder(null);
//       setError("Tracking ID not found");
//     }
//   };

//   const SectionHeader = ({ title }) => (
//     <div className="bg-purple-700 text-white px-6 py-3 font-semibold text-lg">
//       {title}
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-4 mt-24">
//       <div className="mb-8 text-center">
//         <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
//         <div className="flex gap-4 justify-center">
//           <input
//             type="text"
//             placeholder="Enter Tracking ID"
//             value={orderId}
//             onChange={(e) => setOrderId(e.target.value)}
//             className="px-4 py-2 border rounded-md w-64"
//           />
//           <button
//             onClick={fetchOrderStatus}
//             className="px-6 py-2 bg-purple-700 text-white rounded-md hover:bg-[#a13ad1]"
//           >
//             Track
//           </button>
//         </div>
//         {error && (
//           <p className="text-red-500 mt-2 font-medium">{error}</p>
//         )}
//       </div>

//       {order && (
//         <div className="space-y-4">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <SectionHeader title="Booking Details" />
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
//               <div>
//                 <div className="text-gray-600 text-sm">Booking Date</div>
//                 <div className="font-medium">{order.Bookingdate}</div>
//               </div>
//               <div>
//                 <div className="text-gray-600 text-sm">From</div>
//                 <div className="font-medium text-blue-600">{order.From}</div>
//               </div>
//               <div>
//                 <div className="text-gray-600 text-sm">To</div>
//                 <div className="font-medium text-blue-600">{order.To}</div>
//               </div>
//               <div>
//                 <div className="text-gray-600 text-sm">Packages</div>
//                 <div className="font-medium">{order.Packages}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-gray-600 text-sm">Delivery Type</div>
//                 <div className="font-medium">Office</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <SectionHeader title="Current Status" />
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
//               <div>
//                 <div className="text-gray-600 text-sm">Consignment Status</div>
//                 <div className="mt-1">
//                   <span className="px-3 py-1 bg-green-500 text-white rounded-md">
//                     {order.status}
//                   </span>
//                 </div>
//               </div>
//               <div>
//                 <div className="text-gray-600 text-sm">Date</div>
//                 <div className="font-medium">
//                   {order.Bookingdate}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <SectionHeader title="Delivery Details" />
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
//               <div>
//                 <div className="text-gray-600 text-sm">Consignment At</div>
//                 <div className="font-medium">{order.Consignment}</div>
//               </div>
//               <div>
//                 <div className="text-gray-600 text-sm">Reached Date</div>
//                 <div className="font-medium">
//                   {order.Bookingdate}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-gray-600 text-sm">Delivery Status</div>
//                 <div className="font-medium">{order.status}</div>
//               </div>
//               <div>
//                 <div className="text-gray-600 text-sm">Delivery Date</div>
//                 <div className="font-medium">
//                   {order.Bookingdate}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Trackorder;