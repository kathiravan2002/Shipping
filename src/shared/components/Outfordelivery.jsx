import React, { useState, useEffect } from "react";
import { Pencil, CheckCircle } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { Tabs, Tab } from "@heroui/react";
import Exportdata from "./Exportdata";
import { InputText } from "primereact/inputtext";
import apiurl from "../services/Apiendpoint";

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
    const dispatchedEntry = statusHistory.find((entry) => entry.status === CONSIGNEE_STATUS.OUT_FOR_DELIVERY);
    if (!dispatchedEntry) return "N/A";
  
    const date = new Date(dispatchedEntry.timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getoutfordeliveryTime = (statusHistory) => {
    const dispatchedEntry = statusHistory.find((entry) => entry.status === CONSIGNEE_STATUS.OUT_FOR_DELIVERY);
    return dispatchedEntry
      ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(10)
      : "N/A";
  };

  const getdelivereddate = (statusHistory) => {
    const dispatchedEntry = statusHistory.find((entry) => entry.status === CONSIGNEE_STATUS.DELIVERED);
    if (!dispatchedEntry) return "N/A";
  
    const date = new Date(dispatchedEntry.timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getdeliveredTime = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(
      (entry) => entry.status === CONSIGNEE_STATUS.DELIVERED
    );
    return dispatchedEntry
      ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(10)
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
      setSearchQuery(""); 
    };

     const handleSeeLocation = (address) => {
    const cleanAddress = address.replace(/-\w+\s*\w*\.?\w*\.?$/, '');
    // Open Google Maps with the consignee address as the destination
    const googleMapsUrl = `https://www.google.com/maps/dir//${encodeURIComponent(cleanAddress)}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-2">
        <h1 className="flex lg:text-2xl font-semibold text-xl text-purple-700">
          Delivery Management
        </h1>
        <div className="flex gap-3">
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
          radius=""
          selectedKey={activeTab}
          onSelectionChange={handleTabChange}
          className=""
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
            className="bg-purple-700 hover:bg-purple-600 text-white cursor-pointer p-2"
          />
        </div>
      </Dialog>

      {activeTab === "outfordelivery" && (
        <div>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-1 lg:mb-3 gap-2">
            <h1 className="lg:text-2xl text-xl font-semibold">Out For Delivery Orders</h1>
            <div className="grid grid-cols-2 lg:flex justify-between gap-3">
              <h1 className="flex items-center px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-md font-medium mb-4 ">
                Total: <span className="">{filteredOutOrders.length}</span>
              </h1>
              <button className="mb-4">
                <Exportdata data={filteredOutOrders} fileName="outfordelivery" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> 
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
                  <Button
                    label="See Location"
                    onClick={() =>
                      handleSeeLocation(
                        `${order.consigneeaddress}`
                      )
                    }
                    className="mt-2 bg-purple-700 hover:bg-purple-600 text-white p-2 rounded-lg"
                  />
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
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-1 lg:mb-3  gap-2">
            <h1 className="lg:text-2xl text-xl font-semibold">Delivered Orders</h1>
            <div className="grid grid-cols-2 lg:flex justify-between gap-3">
              <h1 className="flex items-center px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-md font-medium mb-4 ">
                Total delivered : <span className="">{filteredDeliveredOrders.length}</span>
              </h1>
              <button className="mb-4">
                <Exportdata data={filteredDeliveredOrders} fileName="delivered" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
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
                    src={`${apiurl()}${order.productImage}`}
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