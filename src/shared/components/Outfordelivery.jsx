/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Pencil, CheckCircle } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { Tabs, Tab } from "@heroui/react";
import Exportdata from "./User/Exportdata";
import { InputText } from "primereact/inputtext";
import apiurl from "../services/Apiendpoint/Apiendpoint";

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
      <div className="items-center justify-between mb-4 lg:flex">
        <h1 className="flex justify-center mb-4 ml-5 text-xl font-semibold lg:text-2xl lg:ml-0">
          Delivery Management
        </h1>
        <div className="flex justify-end gap-4">
        <InputText
          type="text"
          placeholder="Search by any field..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-2 border rounded-lg sm:w-24rem focus:ring-2 focus:ring-purple-500"
        />
        <Button
           onClick={resetAllFilters}
           className="flex items-center px-1 py-3 text-sm font-medium text-purple-700 transition-all duration-300 bg-purple-100 rounded-lg shadow-sm hover:bg-purple-200"
           icon="pi pi-filter-slash"
       />
       </div>
        <Tabs
          aria-label="Tabs colors"
          color="secondary"
          radius="full"
          selectedKey={activeTab}
          onSelectionChange={handleTabChange}
          className="flex justify-center ml-4 lg:ml-0"
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
        <h2 className="mb-2 text-lg font-semibold">Update Consignee Status</h2>
        <select
          name="cstatus"
          value={formData.cstatus || ""}
          onChange={handleInputChange}
          className="w-full p-4 mb-4 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2"
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
            className="p-4 mb-2 border-2 rounded focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
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
          <div className="justify-between lg:flex">
            <h1 className="mb-4 text-2xl font-bold">Out For Delivery Orders</h1>
            <div className="justify-between gap-4 lg:flex">
              <h1 className="flex items-center px-2 py-2 mb-4 text-sm font-medium text-purple-600 rounded-md bg-purple-50">
                Total out for delivery : <span className="text-xl">{filteredOutOrders.length}</span>
              </h1>
              <button className="mb-4">
                <Exportdata data={filteredOutOrders} fileName="outfordelivery" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedOutOrders.length > 0 ? (
              paginatedOutOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 transition-shadow bg-white border rounded-lg shadow-md hover:shadow-xl"
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
          <div className="justify-between lg:flex">
            <h1 className="mt-4 mb-4 text-2xl font-bold sm:mt-0">Delivered Orders</h1>
            <div className="justify-between gap-4 lg:flex">
              <h1 className="flex items-center px-2 py-2 mb-4 text-sm font-medium text-purple-600 rounded-md bg-purple-50">
                Total delivered : <span className="text-xl">{filteredDeliveredOrders?.length}</span>
              </h1>
              <button className="mb-4">
                <Exportdata data={filteredDeliveredOrders} fileName="delivered" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedDeliveredOrders.length > 0 ? (
              paginatedDeliveredOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 transition-shadow bg-white border rounded-lg shadow-md hover:shadow-2xl"
                >
                  <div className="flex">
                    <CheckCircle className="mr-3 text-green-600" size={22} />
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
                    Status: <span className="text-lg text-green-500">{order.cstatus}</span>
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