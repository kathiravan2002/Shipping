import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

function Dispatched(props) {

 const { handleInputChange,handleImageUpload,getNextAllowedStatuses,ORDER_STATUS,updateOrder, formData, setFormData, dispatch, visible, setVisible } =props;

    return (
        <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-200">
            <h1 className="text-2xl font-bold mb-4">Dispatched Orders</h1>

            <div className="mt-4 overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
                    <Dialog
                        header="Edit Status"
                        visible={visible}
                        onHide={() => setVisible(false)}
                        style={{ width: "50vw" }}
                        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                    >
                        <h2 className="text-lg font-semibold mb-2">Update Order Status</h2>

                        {/* Dropdown displays selected status + allowed statuses */}
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

                        {/* Show file input only if status is "Delivered" */}
                        {formData.Orderstatus === ORDER_STATUS.DELIVERED && (
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

                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {["No", "Order Id", "Consignee Name", "Consignee Mobile no", "Consignee Alternate Mobile no", "Consignee Address", "Consignee District", "Consignee Pincode", "Status", "Action"].map((header) => (
                                    <th key={header} className="px-4 py-2 text-left font-medium text-gray-500 uppercase whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dispatch.length > 0 ? (
                                dispatch.map((order, index) => (
                                    <tr key={order._id}>
                                        <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sky-700">{order.orderId}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-indigo-600">{order.Consigneename}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{order.consigneemobileno}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{order.consigneealterno}</td>
                                        <td className="px-4 py-3">{order.consigneeaddress}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{order.consigneedistrict}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{order.consigneepin}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-green-600">{order.Orderstatus}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Button
                                                icon={<Pencil />}
                                                onClick={() => {
                                                    setFormData({ ...order });
                                                    setVisible(true);
                                                }}
                                                className="p-button-text"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-10 text-gray-600">
                                        No dispatched orders
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dispatched;
