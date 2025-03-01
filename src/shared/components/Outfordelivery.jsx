import React, { useState } from "react";
import { Pencil,CheckCircle } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tabs, Tab } from "@heroui/react";

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
  getNextAllowedStatuses,navigate,orders,
})

 {
  const [activeTab, setActiveTab] = useState("outfordelivery");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">  
        <h1 className="lg:text-2xl font-semibold text-xl mb-4">Delivery Management</h1>
        <Tabs
          aria-label="Tabs colors"
          color="secondary"
          radius="full"
          selectedKey={activeTab}
          onSelectionChange={handleTabChange}
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
          name="cstatus" // Changed to cstatus to match backend
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
          <h1 className="text-2xl font-bold mb-4">Out For Delivery Orders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(out) && out.length > 0 ? (
          out.map((order, index) => (
            <div
              key={order._id} // Use _id from Ordermaster
              className="border shadow-md hover:shadow-xl transition-shadow rounded-lg  p-4 bg-white"
            >
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">
                  Consignee ID: <span className="text-indigo-600">{order.cid}</span>
                </h2>
                <Button
                  icon={<Pencil />}
                  onClick={() => {
                    setFormData({ ...order, cid: order.cid }); // Ensure cid is included
                    setVisible(true);
                  }}
                  className="p-button-text"
                />
              </div>
              <hr />
              <p>Consignee Name: <span className="text-indigo-600">{order.Consigneename}</span></p>
              <p>Mobile no: <span className="text-indigo-600">{order.consigneemobileno}</span></p>
              <p>Alternate Mobile no: <span className="text-indigo-600">{order.consigneealterno}</span></p>
              <p>Consignee Address: <span className="text-indigo-600">{order.consigneeaddress}</span></p>
              <p>Consignee District: <span className="text-indigo-600">{order.consigneedistrict}</span></p>
              <p>Consignee Pincode: <span className="text-indigo-600">{order.consigneepin}</span></p>
              <p>
                Status: <span className="text-lg text-green-500">{order.cstatus}</span>
              </p>
            </div>
          ))
        ) : (
          <p>No Out for Delivery orders found.</p>
        )}
      </div>
      </div>
      )}

    {activeTab === "delivered" && (
      <div>
        <h1 className="text-2xl font-bold mb-4 sm:mt-0 mt-4 ">
          {/* <button onClick={() => navigate("/outfordelivery")} className='border text-white bg-purple-600 rounded-md px-3'>{"< "}</button> */}
          Delivered Orders</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="border rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 bg-white">
                <div className='flex '>
                  <CheckCircle className="text-green-600 mr-3" size={22} />
                  <h2 className="text-lg font-semibold">Consignee ID : {order.cid}</h2>
                </div>
                <hr />
                <p>Consignee Name : {order.Consigneename}</p>
                <p>Consignee Mobile no : {order.consigneemobileno}</p>
                <p>Consignee Alternate Mobile no : {order.consigneealterno}</p>
                <p>Consignee Address : {order.consigneeaddress}</p>
                <p>Consignee Pincode : {order.consigneepin}</p>
                <p>Status :<span className="text-green-500 text-lg">{order.cstatus} </span></p>
                <img src={`http://192.168.29.12:5000${order.productImage}`} className="w-auto h-32" />
              </div>
            ))
          ) : (
            <p>No delivered orders found.</p>
          )}
        </div>
      </div>
     
    )}
    </div>
  );
}

export default Outfordelivery;