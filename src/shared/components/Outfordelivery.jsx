import React from "react";
import { Pencil } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

function Outfordelivery({
  out,
  visible,
  setVisible,
  formData,
  setFormData,
  handleInputChange,
  handleImageUpload,
  updateOrder,
  ORDER_STATUS,
  getNextAllowedStatuses,
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4"> Out For delivery Orders</h1>
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
          {getNextAllowedStatuses(
            formData.Orderstatus || ORDER_STATUS.INITIAL
          ).map((status) => (
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
          <Button
            label="Update Order"
            onClick={updateOrder}
            className="p-button-primary"
          />
        </div>
      </Dialog>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(out) && out.length > 0 ? (
          out.map((order, index) => (
            <div
              Key={index}
              className="border border-violet-500 shadow-violet-700 rounded-lg shadow p-4 bg-white"
            >
              <div>
                <div className="flex  justify-between">
                  <h2 className="text-lg font-semibold">
                    Order ID: {order.orderId}
                  </h2>

                  <Button
                    icon={<Pencil />}
                    onClick={() => {
                      setFormData({ ...order });
                      setVisible(true);
                    }}
                    className="p-button-text"
                  />
                </div>
              </div>
              <hr />
              <p>Consignee Name: {order.Consigneename}</p>
              <p>Consignee Mobile no: {order.consigneemobileno}</p>
              <p>Consignee Alternate Mobile no: {order.consigneealterno}</p>
              <p>Consignee Address: {order.consigneeaddress}</p>
              <p>Consignee Address: {order.consigneedistrict}</p>
              <p>Consignee Pincode: {order.consigneepin}</p>
              <p>
                Status:{" "}
                <span className="text-green-500">{order.Orderstatus}</span>
              </p>
            </div>
          ))
        ) : (
          <p>No Out of delivery orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Outfordelivery;
