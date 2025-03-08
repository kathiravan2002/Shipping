import React, { useState, useEffect } from "react";
import { Pencil, CheckCircle } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { Tabs, Tab } from "@heroui/react";
import Exportdata from "./Exportdata";
import { InputText } from "primereact/inputtext";

function Outfordelivery({
  out,
  visible,
  setVisible,
  formData,
  setFormData,
  handleInputChange,
  handleImageUpload,
  updateOrder,
  CONSIGNEE_STATUS,
  getNextAllowedStatuses,
  navigate,
  orders,
}) {
  const [activeTab, setActiveTab] = useState("outfordelivery");
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filteredOutOrders, setFilteredOutOrders] = useState(out);
  const [filteredDeliveredOrders, setFilteredDeliveredOrders] = useState(orders);

  const [outFirst, setOutFirst] = useState(0);
  const [outRows, setOutRows] = useState(8);
  const [deliveredFirst, setDeliveredFirst] = useState(0);
  const [deliveredRows, setDeliveredRows] = useState(8);

  useEffect(() => {
    const filterData = (data) => {
      if (!searchQuery) return data;
      const lowerQuery = searchQuery.toLowerCase();
      return data.filter((order) =>
        Object.values(order).some((value) =>
          String(value).toLowerCase().includes(lowerQuery)
        )
      );
    };

    setFilteredOutOrders(filterData(out));
    setFilteredDeliveredOrders(filterData(orders));
  }, [searchQuery, out, orders]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const getoutfordeliverydate = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(
      (entry) => entry.status === CONSIGNEE_STATUS.OUT_FOR_DELIVERY
    );
    return dispatchedEntry
      ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(0, 8)
      : "N/A";
  };

  const getoutfordeliveryTime = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(
      (entry) => entry.status === CONSIGNEE_STATUS.OUT_FOR_DELIVERY
    );
    return dispatchedEntry
      ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(9)
      : "N/A";
  };

  const getdelivereddate = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(
      (entry) => entry.status === CONSIGNEE_STATUS.DELIVERED
    );
    return dispatchedEntry
      ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(0, 8)
      : "N/A";
  };

  const getdeliveredTime = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(
      (entry) => entry.status === CONSIGNEE_STATUS.DELIVERED
    );
    return dispatchedEntry
      ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(9)
      : "N/A";
  };

  const onOutPageChange = (event) => {
    setOutFirst(event.first);
    setOutRows(event.rows);
  };

  const onDeliveredPageChange = (event) => {
    setDeliveredFirst(event.first);
    setDeliveredRows(event.rows);
  };

  const paginatedOutOrders = Array.isArray(filteredOutOrders)
    ? filteredOutOrders.slice(outFirst, outFirst + outRows)
    : [];

  const paginatedDeliveredOrders = Array.isArray(filteredDeliveredOrders)
    ? filteredDeliveredOrders.slice(deliveredFirst, deliveredFirst + deliveredRows)
    : [];


    const resetAllFilters = () => {
      const resetFilters = {
       
      };
    
      setSearchQuery(""); 
      
    };

  return (
    <div>
      <div className="lg:flex justify-between items-center mb-4">
        <h1 className="flex justify-center lg:text-2xl font-semibold text-xl mb-4 lg:ml-0 ml-5">
          Delivery Management
        </h1>
        <div className="flex justify-end gap-4">
        <InputText
          type="text"
          placeholder="Search by any field..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-24rem px-2 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <Button
           onClick={resetAllFilters}
           className="flex items-center px-1 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
           icon="pi pi-filter-slash"
       />
       </div>
        <Tabs
          aria-label="Tabs colors"
          color="secondary"
          radius="full"
          selectedKey={activeTab}
          onSelectionChange={handleTabChange}
          className="lg:ml-0 ml-4 flex justify-center"
        >
          <Tab key="outfordelivery" title="Out For Delivery" />
          <Tab key="delivered" title="Delivered" />
        </Tabs>
      </div>

      <Dialog
        header="Edit Consignee Status"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "25vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <h2 className="text-lg font-semibold mb-2">Update Consignee Status</h2>
        <select
          name="cstatus"
          value={formData.cstatus || ""}
          onChange={handleInputChange}
          className="p-4 border-2 bg-purple-50 rounded mb-4 focus:outline-none focus:ring-purple-400 focus:ring-2 w-full"
          required
        >
          {getNextAllowedStatuses(
            formData.cstatus || CONSIGNEE_STATUS.OUT_FOR_DELIVERY
          ).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {formData.cstatus === CONSIGNEE_STATUS.DELIVERED && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="p-4 border-2 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
            capture="environment"
          />
        )}

        <div className="flex justify-end">
          <Button
            label="Update Status"
            onClick={updateOrder}
            className="p-button-primary"
          />
        </div>
      </Dialog>

      {activeTab === "outfordelivery" && (
        <div>
          <div className="lg:flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Out For Delivery Orders</h1>
            <div className="lg:flex justify-between gap-4">
              <h1 className="flex items-center px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium mb-4">
                Total out for delivery : <span className="text-xl">{filteredOutOrders.length}</span>
              </h1>
              <button className="mb-4">
                <Exportdata data={filteredOutOrders} fileName="outfordelivery" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedOutOrders.length > 0 ? (
              paginatedOutOrders.map((order) => (
                <div
                  key={order._id}
                  className="border shadow-md hover:shadow-xl transition-shadow rounded-lg p-4 bg-white"
                >
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold">
                      Consignee ID: <span className="text-indigo-600">{order.cid}</span>
                    </h2>
                    <Button
                      icon={<Pencil />}
                      onClick={() => {
                        setFormData({ ...order, cid: order.cid });
                        setVisible(true);
                      }}
                      className="p-button-text"
                    />
                  </div>
                  <hr />
                  <p>Consignee Name: <span className="text-indigo-600">{order.Consigneename}</span></p>
                  <p>Mobile no: <span className="text-indigo-600">{order.consigneemobileno}</span></p>
                  <p>Out for delivery Date: <span className="text-indigo-600">{getoutfordeliverydate(order.statusHistory)}</span></p>
                  <p>Out for delivery Time: <span className="text-indigo-600">{getoutfordeliveryTime(order.statusHistory)}</span></p>
                  <p>Consignee Address: <span className="text-indigo-600">{order.consigneeaddress}</span></p>
                  <p>Consignee District: <span className="text-indigo-600">{order.consigneeedistrict}</span></p>
                  <p>Consignee Pincode: <span className="text-indigo-600">{order.consigneepin}</span></p>
                  <p>
                    Status: <span className="text-lg text-green-500">{order.cstatus}</span>
                  </p>
                </div>
              ))
            ) : (
              <div>
                <p>No Out for Delivery orders found.</p>
              </div>
            )}
          </div>
          {Array.isArray(filteredOutOrders) && filteredOutOrders.length > 0 && (
            <Paginator
              first={outFirst}
              rows={outRows}
              totalRecords={filteredOutOrders.length}
              rowsPerPageOptions={[4, 8, 12, 16]}
              onPageChange={onOutPageChange}
              className="mt-4"
            />
          )}
        </div>
      )}

      {activeTab === "delivered" && (
        <div>
          <div className="lg:flex justify-between">
            <h1 className="text-2xl font-bold mb-4 sm:mt-0 mt-4">Delivered Orders</h1>
            <div className="lg:flex justify-between gap-4">
              <h1 className="flex items-center px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium mb-4">
                Total delivered : <span className="text-xl">{filteredDeliveredOrders.length}</span>
              </h1>
              <button className="mb-4">
                <Exportdata data={filteredDeliveredOrders} fileName="delivered" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedDeliveredOrders.length > 0 ? (
              paginatedDeliveredOrders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg shadow-md hover:shadow-2xl transition-shadow p-4 bg-white"
                >
                  <div className="flex">
                    <CheckCircle className="text-green-600 mr-3" size={22} />
                    <h2 className="text-lg font-semibold">
                      Consignee ID: <span className="text-indigo-600">{order.cid}</span>
                    </h2>
                  </div>
                  <hr />
                  <p>Consignee Name: <span className="text-indigo-600">{order.Consigneename}</span></p>
                  <p>Consignee Mobile no: <span className="text-indigo-600">{order.consigneemobileno}</span></p>
                  <p>Delivered date: <span className="text-indigo-600">{getdelivereddate(order.statusHistory)}</span></p>
                  <p>Delivered Time: <span className="text-indigo-600">{getdeliveredTime(order.statusHistory)}</span></p>
                  <p>Consignee Address: <span className="text-indigo-600">{order.consigneeaddress}</span></p>
                  <p>Consignee Pincode: <span className="text-indigo-600">{order.consigneepin}</span></p>
                  <p>
                    Status: <span className="text-green-500 text-lg">{order.cstatus}</span>
                  </p>
                  <img
                    src={`http://192.168.29.71:5000${order.productImage}`}
                    className="w-auto h-32"
                    alt="Delivered Product"
                  />
                </div>
              ))
            ) : (
              <p>No delivered orders found.</p>
            )}
          </div>
          {Array.isArray(filteredDeliveredOrders) && filteredDeliveredOrders.length > 0 && (
            <Paginator
              first={deliveredFirst}
              rows={deliveredRows}
              totalRecords={filteredDeliveredOrders.length}
              rowsPerPageOptions={[4, 8, 12, 16]}
              onPageChange={onDeliveredPageChange}
              className="mt-4"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Outfordelivery;




// import React, { useState } from "react";
// import { Pencil,CheckCircle } from "lucide-react";
// import { Dialog } from "primereact/dialog";
// import { Button } from "primereact/button";
// import { Tabs, Tab } from "@heroui/react";
// import Exportdata from "./Exportdata";

// function Outfordelivery({
//   out,
//   visible,
//   setVisible,
//   formData,
//   setFormData,
//   handleInputChange,
//   handleImageUpload,
//   updateOrder,
//   CONSIGNEE_STATUS,
//   getNextAllowedStatuses,navigate,orders,
// })

//  {
//   const [activeTab, setActiveTab] = useState("outfordelivery");

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };

//   const getoutfordeliverydate = (statusHistory) => {
//     const dispatchedEntry = statusHistory.find(entry => entry.status === CONSIGNEE_STATUS.OUT_FOR_DELIVERY);
//     return dispatchedEntry ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(0,8) : "N/A";
//   };


//  const getoutfordeliveryTime= (statusHistory) => {
//     const dispatchedEntry = statusHistory.find(entry => entry.status === CONSIGNEE_STATUS.OUT_FOR_DELIVERY);
//     return dispatchedEntry ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(9) : "N/A";
//   };

  
//   const getdelivereddate = (statusHistory) => {
//     const dispatchedEntry = statusHistory.find(entry => entry.status === CONSIGNEE_STATUS.DELIVERED);
//     return dispatchedEntry ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(0,8) : "N/A";
//   };


//   const getdeliveredTime = (statusHistory) => {
//     const dispatchedEntry = statusHistory.find(entry => entry.status === CONSIGNEE_STATUS.DELIVERED);
//     return dispatchedEntry ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(9) : "N/A";
//   };



//   return (
//     <div>
//       <div className="lg:flex justify-between items-center mb-4">  
//         <h1 className="flex justify-center lg:text-2xl font-semibold text-xl mb-4 lg:ml-0 ml-5 ">Delivery Management</h1>
//         <Tabs
//           aria-label="Tabs colors"
//           color="secondary"
//           radius="full"
//           selectedKey={activeTab}
//           onSelectionChange={handleTabChange}
//           className="lg:ml-0 ml-4 flex justify-center"
//         >
//           <Tab key="outfordelivery" title="Out For Delivery" />
//           <Tab key="delivered" title="Delivered" />
//         </Tabs>
//         </div>
      
//       <Dialog
//         header="Edit Consignee Status"
//         visible={visible}
//         onHide={() => setVisible(false)}
//         style={{ width: "25vw" }}
//         breakpoints={{ "960px": "75vw", "641px": "100vw" }}
//       >
//         <h2 className="text-lg font-semibold mb-2">Update Consignee Status</h2>

//         <select
//           name="cstatus" // Changed to cstatus to match backend
//           value={formData.cstatus || ""}
//           onChange={handleInputChange}
//           className="p-4 border-2 bg-purple-50 rounded mb-4 focus:outline-none focus:ring-purple-400 focus:ring-2 w-full"
//           required
//         >
//           {getNextAllowedStatuses(
//             formData.cstatus || CONSIGNEE_STATUS.OUT_FOR_DELIVERY
//           ).map((status) => (
//             <option key={status} value={status}>
//               {status}
//             </option>
//           ))}
//         </select>

//         {formData.cstatus === CONSIGNEE_STATUS.DELIVERED && (
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="p-4 border-2 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
//             capture="environment"
//           />
//         )}

//         <div className="flex justify-end">
//           <Button
//             label="Update Status"
//             onClick={updateOrder}
//             className="p-button-primary"
//           />
//         </div>
//       </Dialog>

//       {activeTab === "outfordelivery" && (
//         <div>
//           <div className="lg:flex justify-between ">
//           <h1 className="text-2xl font-bold mb-4">Out For Delivery Orders</h1>
//           <div className="lg:flex justify-between gap-4 ">
//           <h1 className="flex items-center  px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium mb-4">Total out for delivery :<span className="text-xl">{out.length}</span> </h1>
//         <button className="mb-4"><Exportdata data={out} fileName="outfordelivery"/></button>
//         </div>
//         </div>
//       <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {Array.isArray(out) && out.length > 0 ? (
//           out.map((order, index) => (
//             <div
//               key={order._id} // Use _id from Ordermaster
//               className="border shadow-md hover:shadow-xl transition-shadow rounded-lg  p-4 bg-white"
//             >
//               <div className="flex justify-between">
//                 <h2 className="text-lg font-semibold">
//                   Consignee ID: <span className="text-indigo-600">{order.cid}</span>
//                 </h2>
//                 <Button
//                   icon={<Pencil />}
//                   onClick={() => {
//                     setFormData({ ...order, cid: order.cid }); // Ensure cid is included
//                     setVisible(true);
//                   }}
//                   className="p-button-text"
//                 />
//               </div>
//               <hr />
//               <p>Consignee Name: <span className="text-indigo-600">{order.Consigneename}</span></p>
//               <p>Mobile no: <span className="text-indigo-600">{order.consigneemobileno}</span></p>
//               {/* <p>Alternate Mobile no: <span className="text-indigo-600">{order.consigneealterno}</span></p> */}
//               <p>Out for delivery Date:<span className="text-indigo-600">{getoutfordeliverydate(order.statusHistory)}</span></p>
//               <p>Out for delivery Time:<span className="text-indigo-600"> {getoutfordeliveryTime(order.statusHistory)}</span></p>
//               <p>Consignee Address: <span className="text-indigo-600">{order.consigneeaddress}</span></p>
//               <p>Consignee District: <span className="text-indigo-600">{order.consigneeedistrict}</span></p>
//               <p>Consignee Pincode: <span className="text-indigo-600">{order.consigneepin}</span></p>
//               <p>
//                 Status: <span className="text-lg text-green-500">{order.cstatus}</span>
//               </p>
//             </div>
//           ))
//         ) : (
//           <div>
//           <p >No Out for Delivery orders found.</p></div>
//         )}
//       </div>
//       </div>
//       )}

//     {activeTab === "delivered" && (
//       <div>
//         <div className="lg:flex justify-between ">
//         <h1 className="text-2xl font-bold mb-4 sm:mt-0 mt-4 ">Delivered Orders</h1>
//         <div className="lg:flex justify-between gap-4 ">
//           <h1 className="flex items-center  px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium mb-4">Total out for delivery : <span className="text-xl"> { orders.length}</span> </h1>
//         <button className="mb-4"><Exportdata data={orders} fileName="outfordelivery"/></button>
//         </div>       </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.isArray(orders) && orders.length > 0 ? (
//             orders.map((order, index) => (
//               <div key={index} className="border rounded-lg shadow-md hover:shadow-2xl transition-shadow p-4 bg-white">
//                 <div className='flex '>
//                   <CheckCircle className="text-green-600 mr-3" size={22} />
//                   <h2 className="text-lg font-semibold">Consignee ID : <span className="text-indigo-600">{order.cid}</span> </h2>
//                 </div>
//                 <hr />
//                 <p>Consignee Name :  <span className="text-indigo-600">{order.Consigneename}</span></p>
//                 <p>Consignee Mobile no :  <span className="text-indigo-600">{order.consigneemobileno}</span></p>
//                 {/* <p>Consignee Alternate Mobile no : {order.consigneealterno}</p> */}
//                 <p>Delivered date: <span className="text-indigo-600">{getdelivereddate(order.statusHistory)}</span></p>
//                 <p>Delivered Time: <span className="text-indigo-600">{getdeliveredTime(order.statusHistory)}</span></p>
//                 <p>Consignee Address :  <span className="text-indigo-600">{order.consigneeaddress}</span></p>
//                 <p>Consignee Pincode : <span className="text-indigo-600"> {order.consigneepin}</span></p>
//                 <p>Status :<span className="text-green-500 text-lg">{order.cstatus} </span></p>
//                 <img src={`http://192.168.29.71:5000${order.productImage}`} className="w-auto h-32" />
//               </div>
//             ))
//           ) : (
//             <p>No delivered orders found.</p>
//           )}
//         </div>
//       </div>
     
//     )}
//     </div>
//   );
// }

// export default Outfordelivery;