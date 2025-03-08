import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect"; // Add MultiSelect import
import { InputText } from "primereact/inputtext";
import Exportdata from "./Exportdata";

function Dispatched(props) {
  const {
    handleInputChange,
    handleImageUpload,
    getNextAllowedStatuses,
    CONSIGNEE_STATUS,
    updateOrder,
    formData,
    setFormData,
    dispatch,
    visible,
    setVisible,
    applyFilters,
  } = props;

  const [globalFilter, setGlobalFilter] = useState(""); 
  // State for filters
  const [filters, setFilters] = useState({
    cid: { value: null, matchMode: "in" },
    Consigneename: { value: null, matchMode: "in" },
    consigneeedistrict: { value: null, matchMode: "in" },
    cstatus: { value: null, matchMode: "in" },
    consigneepin:{ value: null, matchMode: "in"},
    consigneemobileno:{ value: null, matchMode: "in"}

  });

  const getDispatcheddate = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(entry => entry.status === CONSIGNEE_STATUS.DISPATCHED);
    return dispatchedEntry ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(0, 8) : "N/A";
  };

  const getDispatchedTime = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(entry => entry.status === CONSIGNEE_STATUS.DISPATCHED);
    return dispatchedEntry ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(9) : "N/A";
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon={<Pencil />}
        onClick={() => {
          setFormData({ ...rowData, cid: rowData.cid });
          setVisible(true);
        }}
        className="p-button-text"
      />
    );
  };

  

  // Filter templates
  const multiSelectFilterTemplate = (options, field, placeholder) => {
    const uniqueValues = [...new Set(dispatch.map(item => item[field]))];
    return (
      <MultiSelect
        value={options.value}
        options={uniqueValues.map(value => ({ label: value, value }))}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder={placeholder}
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: '12rem' }}
        filter
        filterPlaceholder={`Search ${placeholder}`}
      />
    );
  };

   // Handle global filter change
   const handleGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilter(value);
    applyFilters({ ...filters, search: value }); // Pass the search term to applyFilters
  };

  const resetFilters = () => {
    const resetFiltersState = {
      cid: { value: null, matchMode: "in" },
      Consigneename: { value: null, matchMode: "in" },
      consigneeedistrict: { value: null, matchMode: "in" },
      cstatus: { value: null, matchMode: "in" },
      consigneepin:{ value: null, matchMode: "in"},
      consigneemobileno:{ value: null, matchMode: "in"}
    };
    setFilters(resetFiltersState);
    setGlobalFilter("");
    applyFilters({}); // Reset filters on the backend as well
  };
  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-200">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Dispatched Orders</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full sm:w-auto">
         <span className="p-input-icon-left">
         <InputText
            value={globalFilter}
            onChange={handleGlobalFilterChange}
            placeholder="Search "
            className="lg:w-full sm:w-24rem px-2 py-2 border rounded-lg"
          />
            </span>

            <Button
            onClick={resetFilters}
            className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
            icon="pi pi-filter-slash"
          />
          
          
          <button className=""><Exportdata data={dispatch} fileName="dispatchorders.csv"/></button>
          <h1 className="flex items-center gap-2 px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium  ">
          Total Dispatched: <span className="text-xl">{dispatch.length}</span>
        </h1>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
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
              {getNextAllowedStatuses(formData.cstatus || CONSIGNEE_STATUS.DISPATCHED).map((status) => (
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
              <Button label="Update Status" onClick={updateOrder} className="p-button-primary" />
            </div>
          </Dialog>

          <DataTable
            value={dispatch}
            paginator
            rows={10}
            scrollable
            scrollHeight="650px"
            showGridlines
            rowsPerPageOptions={[10, 25, 50, 100]}
            tableStyle={{ minWidth: "25rem" }}
            className="p-datatable-striped text-sm text-gray-700 rounded-lg border border-gray-200"
            emptyMessage="No order found."
            filters={filters}
            filterDisplay="menu"
            onFilter={(e) => setFilters(e.filters)}
          >
            <Column
              header="S.No"
              body={(rowData, { rowIndex }) => rowIndex + 1}
              
            />
              <Column
                header="Action"
                body={actionBodyTemplate}
                // style={{ width: '10%' }}
              />
            <Column
              field="cid"
              header="Consignee Id"
              style={{ width: '10%' }}
              bodyClassName="text-sky-700"
              filter
              showFilterMatchModes={false}
              filterElement={(options) => multiSelectFilterTemplate(options, 'cid', 'Select IDs')}
            />
              <Column
                field="cstatus"
                header="Status"
                style={{ width: '10%' }}
                bodyClassName="text-green-600"
                filter
                filterElement={(options) => multiSelectFilterTemplate(options, 'cstatus', 'Select Status')}
                showFilterMatchModes={false}
  
              />
            <Column
              header="Dispatched Date"
              body={(rowData) => getDispatcheddate(rowData.statusHistory)}
              style={{ width: '10%' }}
              // showFilterMatchModes={false}
              // filter
              // filterElement={(options) => multiSelectFilterTemplate(options, 'getDispatcheddate', 'Select Date')}
            />
            <Column
              header="Dispatched Time"
              body={(rowData) => getDispatchedTime(rowData.statusHistory)}
              style={{ width: '10%' }}
            />
            <Column
              field="Consigneename"
              header="Consignee Name"
              style={{ width: '12%' }}
              bodyClassName="text-indigo-600"
              showFilterMatchModes={false}
              filter
              filterElement={(options) => multiSelectFilterTemplate(options, 'Consigneename', 'Select Names')}
            />
            <Column
              field="consigneemobileno"
              header="Mobile no"
              style={{ width: '10%' }}
              filter
              filterElement={(options) => multiSelectFilterTemplate(options, 'consigneemobileno' , 'Select mobileno')}
              showFilterMatchModes={false}
            />
            <Column
              field="consigneeaddress"
              header="Consignee Address"
              style={{ width: '10%' }}
            />
            <Column
              field="consigneeedistrict"
              header="Consignee District"
              style={{ width: '10%' }}
              filter
              filterElement={(options) => multiSelectFilterTemplate(options, 'consigneeedistrict', 'Select Districts')}
              showFilterMatchModes={false}

            />
            <Column
              field="consigneepin"
              header="Consignee Pincode"
              style={{ width: '8%' }}
              filter
              filterElement={(options) => multiSelectFilterTemplate(options, 'consigneepin','select pincode')}
              showFilterMatchModes={false}
            />
          </DataTable>        
        </div>
      </div>
    </div>
  );
}

export default Dispatched;

// import React from 'react';
// import { Pencil } from 'lucide-react';
// import { Button } from 'primereact/button';
// import { Dialog } from 'primereact/dialog';

// function Dispatched(props) {

//     const { updateOrder, formData, setFormData, dispatch, visible, setVisible } = props;


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // Handle Image Upload
//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         setFormData((prev) => ({
//             ...prev,
//             deliveryimage: file, // Store file object in state
//         }));
//     };

//     const ORDER_STATUS = {
//         INITIAL: "",
//         PLACED: "Order Placed",
//         DISPATCHED: "Order Dispatched",
//         OUT_FOR_DELIVERY: "Out for Delivery",
//         DELIVERED: "Delivered",
//     };

//     const getNextAllowedStatuses = (currentStatus) => {
//         switch (currentStatus) {
//             case ORDER_STATUS.INITIAL:
//                 return [ORDER_STATUS.PLACED];
//             case ORDER_STATUS.PLACED:
//                 return [ORDER_STATUS.DISPATCHED];
//             case ORDER_STATUS.DISPATCHED:
//                 return [ORDER_STATUS.OUT_FOR_DELIVERY];
//             case ORDER_STATUS.OUT_FOR_DELIVERY:
//                 return [ORDER_STATUS.DELIVERED];
//             case ORDER_STATUS.DELIVERED:
//                 return [ORDER_STATUS.DELIVERED];
//             default:
//                 return [ORDER_STATUS.PLACED];
//         }
//     };



//     return (

//         <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-200">
//             <h1 className='text-2xl font-bold mb-4'> Dispatched Orders</h1>


//             <div className="mt-4 overflow-x-auto">
//                 <div className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
//                     <Dialog
//                         header="Edit Status"
//                         visible={visible}
//                         onHide={() => setVisible(false)}
//                         style={{ width: "50vw" }}
//                         breakpoints={{ "960px": "75vw", "641px": "100vw" }}
//                     >
//                         <h2 className="text-lg font-semibold mb-2">Update Order Status</h2>

//                         <select
//                             name="Orderstatus"
//                             value={formData.Orderstatus || ""}
//                             onChange={handleInputChange}
//                             className="p-4 border-2 bg-purple-50 rounded mb-4 focus:outline-none focus:ring-purple-400 focus:ring-2 w-full"
//                             required
//                         >
//                             <option value="">Select Order Status</option>
//                             {getNextAllowedStatuses(formData.Orderstatus || ORDER_STATUS.INITIAL).map((status) => (
//                                 <option key={status} value={status}>
//                                     {status}
//                                 </option>
//                             ))}
//                         </select>

//                         {/* Image Upload Field (Only when status is "Delivered") */}
//                         {formData.Orderstatus === "Delivered" && (
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageUpload}
//                                 className="p-4 border-2 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
//                                 capture="environment"
//                             />
//                         )}

//                         <div className="flex justify-end">
//                             <Button label="Update Order" onClick={updateOrder} className="p-button-primary" />
//                         </div>
//                     </Dialog>
//                     <table className="min-w-full divide-y divide-gray-200 text-sm">
//                         <thead className="bg-gray-50">
//                             <tr>

//                                 {["No", "Order Id", "Consignee Name", "Consignee Mobile no", "Consignee Alternate Mobile no", "Consignee Address", "Consignee District", "Consignee Pincode", "Status", "Action"].map((header) => (
//                                     <th key={header} className="px-4 py-2 text-left font-medium text-gray-500 uppercase whitespace-nowrap" >
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {dispatch?.length > 0 ? (dispatch.map((order, index) => (
//                                 <tr key={index}>
//                                     <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sky-700">{order.orderId}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-indigo-600">{order.Consigneename}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap">{order.consigneemobileno}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap">{order.consigneealterno}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap">{order.consigneeaddress}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap">{order.consigneeedistrict}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap">{order.consigneepin}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-green-600">{order.Orderstatus}</td>

//                                     <td className="px-4 py-3 whitespace-nowrap space-x-2">
//                                         <Button
//                                             icon={<Pencil />}
//                                             onClick={() => {
//                                                 setFormData({ ...order });
//                                                 setVisible(true);
//                                             }}
//                                             className="p-button-text"
//                                         />

//                                     </td>
//                                 </tr>
//                             ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="9" className="text-center py-10">
//                                         <div className="flex flex-col items-center">

//                                             <p className="text-gray-600 mt-4 font-semibold text-2xl">
//                                                 No dispatched order
//                                             </p>

//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//             </div>
//         </div>

//         // <div>
//         //     <h1 className='text-2xl font-bold mb-4'> Dispatched Orders</h1>
//         //     <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
//         //         {dispatch.map((order, index) => (
//         //             <div Key={index} className="border border-violet-500 shadow-violet-700 rounded-lg shadow p-4 bg-white" >
//         //                 <div >
//         //                     <div className="flex justify-between ">

//         //                         <h2 className="text-lg font-semibold">Order ID: {order.orderId}</h2>

//         //                         <button
//         //                             onClick={() => editOrder({ _id: order._id })}
//         //                             className=" text-purple-500 "
//         //                         >
//         //                             <Pencil />
//         //                         </button>
//         //                     </div>
//         //                 </div>
//         //                 <hr />
//         //                 <p>Consignee Name: {order.Consigneename}</p>
//         //                 <p>Consignee Mobile no: {order.consigneemobileno}</p>
//         //                 <p>Consignee Alternate Mobile no: {order.consigneealterno}</p>
//         //                 <p>Consignee Address: {order.consigneeaddress}</p>
//         //                 <p>Consignee Address: {order.consigneedistrict}</p>
//         //                 <p>Consignee Pincode: {order.consigneepin}</p>
//         //                 <p>Status: <span className="text-green-500">{order.Orderstatus}</span></p>
//         //             </div>
//         //         ))}
//         //     </div>

//         // </div>

//     )
// }


// export default Dispatched;