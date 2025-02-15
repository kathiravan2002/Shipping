import React from "react";
import { Pencil } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

function Outfordelivery(props) {
  
  const { updateOrder, out, visible, setVisible, setFormData, formData ,getNextAllowedStatuses,handleInputChange,handleImageUpload,ORDER_STATUS} = props;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Out For Delivery Orders</h1>

      {/* Dialog for Editing Order Status */}
      <Dialog
        header="Edit Status"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "25vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <h2 className="text-lg font-semibold mb-2">Update Order Status</h2>

        <select
          name="Orderstatus"
          value={formData.Orderstatus || ""}
          onChange={handleInputChange}
          className="p-4 border-2 bg-purple-50 rounded mb-4 focus:outline-none focus:ring-purple-400 focus:ring-2 w-full"
          required
        >
          
          {getNextAllowedStatuses(formData.Orderstatus || ORDER_STATUS.INITIAL).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Image Upload Field (Only when status is "Delivered") */}
        {formData.Orderstatus === "Delivered" && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="p-4 border-2 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
            capture="environment"
          />
        )}

        <div className="flex justify-end">
          <Button label="Update Order" onClick={updateOrder} className="p-button-primary" />
        </div>
      </Dialog>

      {/* Order List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {out.map((order, index) => (
          <div key={index} className="border border-violet-500 shadow-violet-700 rounded-lg shadow p-4 bg-white">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">Order ID: {order.orderId}</h2>

              <Button
                icon={<Pencil />}
                onClick={() => {
                setFormData({ ...order });
                setVisible(true);
                }}
                className="p-button-text"
              />
            </div>
            <hr />
            <p>Consignee Name: {order.Consigneename}</p>
            <p>Consignee Mobile no: {order.consigneemobileno}</p>
            <p>Consignee Alternate Mobile no: {order.consigneealterno}</p>
            <p>Consignee Address: {order.consigneeaddress}</p>
            <p>Consignee District: {order.consigneeedistrict}</p>
            <p>Consignee Pincode: {order.consigneepin}</p>
            <p>Status: <span className="text-green-500">{order.Orderstatus}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Outfordelivery;





// import React from "react";
// import { Pencil } from "lucide-react";
// import { Dialog } from "primereact/dialog";
// import { Button } from "primereact/button";

// function Outfordelivery({ updateOrder, out, visible, setVisible, setFormData, formData }) {
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const ORDER_STATUS = {
//     INITIAL: "",
//     PLACED: "Order Placed",
//     DISPATCHED: "Order Dispatched",
//     OUT_FOR_DELIVERY: "Out for Delivery",
//     DELIVERED: "Delivered",
//   };

//   const getNextAllowedStatuses = (currentStatus) => {
//     switch (currentStatus) {
//       case ORDER_STATUS.INITIAL:
//         return [ORDER_STATUS.PLACED];
//       case ORDER_STATUS.PLACED:
//         return [ORDER_STATUS.DISPATCHED];
//       case ORDER_STATUS.DISPATCHED:
//         return [ORDER_STATUS.OUT_FOR_DELIVERY];
//       case ORDER_STATUS.OUT_FOR_DELIVERY:
//         return [ORDER_STATUS.DELIVERED];
//       case ORDER_STATUS.DELIVERED:
//         return [ORDER_STATUS.DELIVERED];
//       default:
//         return [ORDER_STATUS.PLACED];
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Out For Delivery Orders</h1>

//       {/* Dialog for Editing Order Status */}
//       <Dialog 
//         header="Edit Status" 
//         visible={visible} 
//         onHide={() => setVisible(false)}
//         style={{ width: "50vw" }} 
//         breakpoints={{ "960px": "75vw", "641px": "100vw" }}
//       >
//         <h2 className="text-lg font-semibold mb-2">Update Order Status</h2>

//         <select
//           name="Orderstatus"
//           value={formData?.Orderstatus || ""}
//           onChange={handleInputChange}
//           className="p-4 border-2 bg-purple-50 rounded mb-4 focus:outline-none focus:ring-purple-400 focus:ring-2 w-full"
//           required
//         >
//           <option value="">Select Order Status</option>
//           {getNextAllowedStatuses(formData?.Orderstatus || ORDER_STATUS.INITIAL).map((status) => (
//             <option key={status} value={status}>
//               {status}
//             </option>
//           ))}
//         </select>

//         <div className="flex justify-end">
//           <Button label="Update Order" onClick={() => updateOrder()} className="p-button-primary" />
//         </div>
//       </Dialog>

//       {/* Order List */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {out.map((order) => (
//           <div key={order._id} className="border border-violet-500 shadow-violet-700 rounded-lg shadow p-4 bg-white">
//             <div className="flex justify-between">
//               <h2 className="text-lg font-semibold">Order ID: {order.orderId}</h2>

//               <Button
//                 icon={<Pencil />}
//                 onClick={() => {
//                   setFormData({ ...order });
//                   setVisible(true);
//                 }}
//                 className="p-button-text"
//               />
//             </div>
//             <hr />
//             <p>Consignee Name: {order.Consigneename}</p>
//             <p>Consignee Mobile no: {order.consigneemobileno}</p>
//             <p>Consignee Alternate Mobile no: {order.consigneealterno}</p>
//             <p>Consignee Address: {order.consigneeaddress}</p>
//             <p>Consignee District: {order.consigneedistrict}</p>
//             <p>Consignee Pincode: {order.consigneepin}</p>
//             <p>Status: <span className="text-green-500">{order.Orderstatus}</span></p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Outfordelivery;










// import React from 'react'
// import { Pencil } from 'lucide-react';
// import { Dialog } from 'primereact/dialog';
// import { Button } from 'primereact/button';

// function Outfordelivery({ updateOrder, out, visible, setVisible,setFormData,formData }) {

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => {
//           let updatedData = { ...prev, [name]: value };
//           return updatedData;
//         });
//       };

//     const ORDER_STATUS = {
//         INITIAL: "",
//         PLACED: "Order Placed",
//         DISPATCHED: "Order Dispatched",
//         OUT_FOR_DELIVERY: "Out for Delivery",
//         DELIVERED: "Delivered"
//       };
    
    
//       const getNextAllowedStatuses = (currentStatus) => {
//         switch (currentStatus) {
//           case ORDER_STATUS.INITIAL:
//             return [ORDER_STATUS.PLACED];
//           case ORDER_STATUS.PLACED:
//             return [ORDER_STATUS.PLACED, ORDER_STATUS.DISPATCHED];
//           case ORDER_STATUS.DISPATCHED:
//             return [ORDER_STATUS.DISPATCHED, ORDER_STATUS.OUT_FOR_DELIVERY];
//           case ORDER_STATUS.OUT_FOR_DELIVERY:
//             return [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED];
//           case ORDER_STATUS.DELIVERED:
//             return [ORDER_STATUS.DELIVERED];
//           default:
//             return [ORDER_STATUS.PLACED];
//         }
//       };

//     return (
//         <div>
//             <h1 className='text-2xl font-bold mb-4'> Out For delivery Orders</h1>
//             <div className="card flex justify-content-center">

//                 <Dialog header="Edit Status" visible={visible} onHide={() => { if (!visible) return; setVisible(false); }}
//                     style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
//                    <h1>Order Status</h1>
//                     <select
//                         name="Orderstatus"
//                         value={formData.Orderstatus}
//                         onChange={handleInputChange}
//                         className="p-4 border-2 bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
//                         required
//                     >
//                         <option value="">Select Order Status</option>
//                         {getNextAllowedStatuses(formData.Orderstatus).map((status) => (
//                             <option key={status} value={status}>
//                                 {status}
//                             </option>
//                         ))}
//                     </select>
//                 </Dialog>
//             </div>
//             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
//                 {out.map((out, index) => (
//                     <div Key={index} className="border border-violet-500 shadow-violet-700 rounded-lg shadow p-4 bg-white" >
//                         <div >
//                             <div className="flex justify-between ">

//                                 <h2 className="text-lg font-semibold">Order ID: {out.orderId}</h2>
//                                 {/* 
//                                 <button
//                                     onClick={() => editOrder({ _id: out._id })}
//                                     className=" text-purple-500 "
//                                 >
//                                     <Pencil />
//                                 </button> */}

//                                 <Button label={<Pencil/>} onClick={() => setVisible(true)} />
//                             </div>
//                         </div>
//                         <hr />
//                         <p>Consignee Name: {out.Consigneename}</p>
//                         <p>Consignee Mobile no: {out.consigneemobileno}</p>
//                         <p>Consignee Alternate Mobile no: {out.consigneealterno}</p>
//                         <p>Consignee Address: {out.consigneeaddress}</p>
//                         <p>Consignee Address: {out.consigneedistrict}</p>
//                         <p>Consignee Pincode: {out.consigneepin}</p>
//                         <p>Status: <span className="text-green-500">{out.Orderstatus}</span></p>
//                     </div>
//                 ))}
//             </div>

//         </div>
//     )


// }

// export default Outfordelivery;