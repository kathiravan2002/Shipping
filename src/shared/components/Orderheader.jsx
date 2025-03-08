import React, { useState } from "react";
import { Search, X } from "lucide-react";
import Exportdata from "./Exportdata";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";

const Orderheader = (props) => {
  const {
    rowExpansionTemplate,
    expandedRows,
    setExpandedRows,
    navigate,
    order,
    totalRecords,
    loading,
    searchQuery,
    currentPage,
    lazyState,
    onPage,
    onSort,
    onFilter,
    handleStatusChange,
    handleSearchChange,
    handleClearAllFilters,
    actionBodyTemplate,
    deliverytemplate,
    consignerNames,
    orderStatuses,
    consignerCities,
    OrderDate,
    OrderId,
    conrDistrict,
    ConsignerPincode,
  } = props;

  // Declare all state hooks at the top level
  const [filterValues, setFilterValues] = useState({
    consignerNames: [],
    orderStatuses: [],
    consignerCities: [],
    orderDates: [],
    orderIds: [],
    conrDistricts: [],
    consignerPincodes: [],
  });

 

  const applyFilter = (field, value) => {
    onFilter({
      filters: {
        ...lazyState.filters,
        [field]: { value, matchMode: lazyState.filters[field]?.matchMode || "in" },
      },
    });
   
  };
  
  const clearFilter = (field) => {
    
    onFilter({
      filters: {
        ...lazyState.filters,
        [field]: { value: null, matchMode: lazyState.filters[field]?.matchMode || "in" },
      },
    });
  };

  const consignerNameFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={filterValues.consignerNames}
        options={consignerNames?.map((name) => ({ label: name, value: name })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, consignerNames: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, consignerNames: [] }));

                clearFilter("ConsignerName");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("ConsignerName", filterValues.consignerNames);
                props.hide();
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search names..."
        disabled={!consignerNames?.length}
      />
    );
  };
  const orderStatusFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={filterValues.orderStatuses}
        options={orderStatuses?.map((status) => ({ label: status, value: status })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, orderStatuses: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, orderStatuses: [] }));

                clearFilter("Orderstatus");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("Orderstatus", filterValues.orderStatuses);
                props.hide();
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="p-multiselect w-full"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search statuses..."
        disabled={!orderStatuses?.length}
      />
    );
  };

  const consignerCityFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={filterValues.consignerCities}
        options={consignerCities?.map((city) => ({ label: city, value: city })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, consignerCities: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, consignerCities: [] }));

                clearFilter("consignercity");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("consignercity", filterValues.consignerCities);
                props.hide(); 
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="p-multiselect w-full"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search cities..."
        disabled={!consignerCities?.length}
      />
    );
  };

  const orderDateFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={filterValues.orderDates}
        options={OrderDate?.map((date) => ({ label: date, value: date })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, orderDates: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, orderDates: [] }));

                clearFilter("orderDate");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("orderDate", filterValues.orderDates);
                props.hide();
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="p-multiselect w-full"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search dates..."
        disabled={!OrderDate?.length}
      />
    );
  };

  const orderIdFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={filterValues.orderIds}
        options={OrderId?.map((id) => ({ label: id, value: id })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, orderIds: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, orderIds: [] }));

                clearFilter("orderId");
                props.hide(); // 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("orderId", filterValues.orderIds);
                props.hide(); // 
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="p-multiselect w-full"
        maxSelectedLabels={1}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search order IDs..."
        disabled={!OrderId?.length}
      />
    );
  };

  const conrDistrictFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={filterValues.conrDistricts}
        options={conrDistrict?.map((district) => ({ label: district, value: district })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, conrDistricts: e.value || [] }));
        }}
        orderId panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, conrDistricts: [] }));

                clearFilter("consignerdistrict");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("consignerdistrict", filterValues.conrDistricts);
                props.hide(); 
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="p-multiselect w-full"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search districts..."
        disabled={!conrDistrict?.length}
      />
    );
  };

  return (
    <div className="w-full mx-auto p-3 sm:p-5 md:p-6 lg:p-4 bg-white shadow-xl rounded-lg border border-gray-200 transition-all duration-300 lg:mt-0 mt-2">
      <header className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Order List</h1>
          <Button
            icon="pi pi-list-check"
            label="My Order"
            className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
            onClick={() => navigate("/Myorder")}
          />
        </div>
        <div className="flex-1 flex justify-center w-full sm:w-auto">
          <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <InputText
              type="text"
              placeholder="Search for Order ID or Consigneer Name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm shadow-sm transition-all duration-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button
            icon="pi pi-filter-slash"
            className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
            onClick={handleClearAllFilters}
          />
          <Button
            icon="pi pi-plus"
            label="Add Order"
            className="flex items-center gap-2 px-3 py-2  bg-purple-100 text-purple-700 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-sm font-medium shadow-md"
            onClick={() => navigate("/Addorder")}
          />
          <Dropdown
            value={lazyState.status}
            options={[
              { label: "All Orders", value: " " },
              { label: "Placed Order", value: "Order Placed" },
              { label: "Partial Order", value: "Partial" },
              { label: "Delivered Order", value: "Delivered" },
            ]}
            onChange={handleStatusChange}
            placeholder="Select Order Status"
            className="p-dropdown border-gray-300 rounded-lg shadow-sm bg-gray-50"
          />
          <Exportdata data={order} fileName="orders.csv" />
        </div>
      </header>
      <DataTable
        value={order || []}
        lazy
        scrollable
        scrollHeight="650px"
        dataKey="_id"
        paginator
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        onSort={onSort}
        sortField={lazyState.sortField}
        sortOrder={lazyState.sortOrder}
        onFilter={onFilter}
        filters={lazyState.filters}
        loading={loading}
        showGridlines
        filterDisplay="menu"
        emptyMessage={
          <div className="flex flex-col items-center py-8">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span className="text-gray-600 font-medium mt-2">No orders found.</span>
          </div>
        }
        className="p-datatable-striped text-sm text-gray-700 rounded-lg border border-gray-200"
        rowsPerPageOptions={[10, 20, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate={`Showing page ${currentPage} of ${Math.ceil(totalRecords / lazyState.rows)}`}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column expander style={{ width: "3rem" }} />
        <Column header="S.No" body={(data, options) => options.rowIndex + 1} style={{ width: "4rem" }} />
        <Column field="action" header="Action" body={actionBodyTemplate} style={{ width: "6rem" }} />
        <Column
          field="orderId"
          header="Order Id"
          filter
          showFilterMatchModes={false}
          filterElement={orderIdFilterTemplate}
          filterPlaceholder="Search by Order ID"
          showFilterMenu={true}
          frozen
          style={{ minWidth: "8rem" }}
          className="font-medium text-indigo-600"
        />
        <Column
          field="orderDate"
          header="Order Date"
          filter
          showFilterMatchModes={false}
          filterElement={orderDateFilterTemplate}
          filterPlaceholder="Search by Order Date"
          showFilterMenu={true}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="Orderstatus"
          header="Order Status"
          filter
          showFilterMatchModes={false}
          filterElement={orderStatusFilterTemplate}
          showFilterMenu={true}
          style={{ minWidth: "8rem" }}
          body={(rowData) => (
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                rowData?.Orderstatus === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : rowData?.Orderstatus === "Order Placed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {rowData?.Orderstatus || "N/A"}
            </span>
          )}
        />
        <Column
          field="ConsignerName"
          header="Consigner Name"
          filter
          showFilterMatchModes={false}
          filterElement={consignerNameFilterTemplate}
          showFilterMenu={true}
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="consignermobileNumber"
          header="Consigner No"
          filterPlaceholder="Search by Consigner Mobile"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="consignerAddress"
          header="Consigner Address"
          filterPlaceholder="Search by Consigner Address"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="consignercity"
          header="Consigner City"
          filter
          showFilterMatchModes={false}
          filterElement={consignerCityFilterTemplate}
          showFilterMenu={true}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="consignerdistrict"
          header="Consigner District"
          filter
          showFilterMatchModes={false}
          filterElement={conrDistrictFilterTemplate}
          filterPlaceholder="Search by Consigner District"
          showFilterMenu={true}
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="consignerstate"
          header="Consigner State"
          filter
          showFilterMatchModes={false}
          filterPlaceholder="Search by Consigner State"
          showFilterMenu={true}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="consignerpincode"
          header="Consigner Pincode"
          filterPlaceholder="Search by Consigner Pincode"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="noofpackage"
          header="No of Package"
          filterPlaceholder="Search by No. of Packages"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="packageWeight"
          header="Package Weight"
          filterPlaceholder="Search by Package Weight"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="price"
          header="Price"
          filterPlaceholder="Search by Price"
          style={{ minWidth: "6rem" }}
          body={(rowData) => `₹${rowData?.price || 0}`}
        />
      </DataTable>
    </div>
  );
};

export default Orderheader;


// import React, { useState, useEffect } from "react";
// import { Search, X } from "lucide-react";
// import Exportdata from "./Exportdata";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { InputText } from "primereact/inputtext";
// import { Dropdown } from "primereact/dropdown";
// import { Button } from "primereact/button";
// import { MultiSelect } from "primereact/multiselect"; // Import MultiSelect

// const Orderheader = (props) => {
//   const {
//     rowExpansionTemplate,
//     expandedRows,
//     setExpandedRows,
//     navigate,
//     order,
//     totalRecords,
//     loading,
//     searchQuery,
//     currentPage,
//     lazyState,
//     onPage,
//     onSort,
//     onFilter,
//     handleStatusChange,
//     handleSearchChange,
//     handleClearAllFilters,
//     actionBodyTemplate,
//     invoiceBodyTemplate,
//     deliverytemplate,
//     consignerNames,
//     orderStatuses,
//     consignerCities,
//     OrderDate,
//     OrderId,
//     conrDistrict,
//     ConsignerPincode,
//   } = props;

//   // const handleClearSearch = () => {
//   //   handleSearchChange({ target: { value: "" } }); // Reset searchQuery to empty string
//   // };
  
//   // Custom filter templates for MultiSelect columns
// const conrdistrictTemplate = (options) =>{
//   return(
//     <MultiSelect
//     value={options.value || []}
//     options={conrDistrict.map((district) => ({label:district ,value:district}))}
//     onChange={(e) => options.filterCallback(e.value)}
//     placeholder="Select District"
//     className="p-multiselect"
//     maxSelectedLabels={3}
//     selectedItemsLabel="{0} items selected"
//     />
//   )
// }
 
//  const orderidTemplate = (options) =>{
//   return(
//     <MultiSelect
//     value={options.value || []}
//     options={OrderId.map((id) => ({label:id , value:id}))}
//     onChange={(e) => options.filterCallback(e.value)}
//     placeholder="Select orderid"
//     className="p-multiselect"
//     maxSelectedLabels={2}
//     selectedItemsLabel="{0} items selected"
//   />
//   )
//  }


//   const orederdateTemplate = (options) =>{
//     return(
//       <MultiSelect
//        value={options.value || []}
//        options={OrderDate.map((date) => ({label:date , value:date}))}
//        onChange={(e) => options.filterCallback(e.value)}
//         placeholder="Select orderdate"
//         className="p-multiselect"
//         maxSelectedLabels={2}
//         selectedItemsLabel="{0} items selected"
//       />
//     )
//   }

//   const consignerNameFilterTemplate = (options) => {
//     return (
//       <MultiSelect
//         value={options.value || []}
//         options={consignerNames.map((name) => ({ label: name, value: name }))}
//         onChange={(e) => options.filterCallback(e.value)}
//         placeholder="Select Consigners"
//         className="p-multiselect"
//         maxSelectedLabels={3}
//         selectedItemsLabel="{0} items selected"
//       />
//     );
//   };

//   const orderStatusFilterTemplate = (options) => {
//     return (
//       <MultiSelect
//         value={options.value || []}
//         options={orderStatuses.map((status) => ({ label: status, value: status }))}
//         onChange={(e) => options.filterCallback(e.value)}
//         placeholder="Select Order Statuses"
//         className="p-multiselect"
//         maxSelectedLabels={3}
//         selectedItemsLabel="{0} items selected"
//       />
//     );
//   };

//   const consignerCityFilterTemplate = (options) => {
//     return (
//       <MultiSelect
//         value={options.value || []}
//         options={consignerCities.map((city) => ({ label: city, value: city }))}
//         onChange={(e) => options.filterCallback(e.value)}
//         placeholder="Select Cities"
//         className="p-multiselect"
//         maxSelectedLabels={3}
//         selectedItemsLabel="{0} items selected"
//       />
//     );
//   };


//   const consignerpincodeFilterTemplate = (options) => {
//     return (
//       <MultiSelect
//         value={options.value || []}
//         options={ConsignerPincode.map((pincode) => ({ label: pincode, value: pincode }))}
//         onChange={(e) => options.filterCallback(e.value)}
//         placeholder="Select Pincode"
//         className="p-multiselect"
//         maxSelectedLabels={3}
//         selectedItemsLabel="{0} items selected"
//       />
//     );
//   };

//   return (
//     <div className="w-full mx-auto p-3 sm:p-5 md:p-6 lg:p-4 bg-white shadow-xl rounded-lg border border-gray-200 transition-all duration-300 lg:mt-0 mt-2">
//       <header className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center justify-between mb-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Order List</h1>
//           <Button
//             icon="pi pi-list-check"
//             label="My Order"
//             className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
//             onClick={() => navigate("/Myorder")}
//           />
//         </div>
//         <div className="flex-1 flex justify-center w-full sm:w-auto">
//           <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//             <InputText
//               type="text"
//               placeholder="Search for Order ID or Consigneer Name"
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm shadow-sm transition-all duration-200"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//              {/* {searchQuery && (
//               <button
//                 onClick={handleClearSearch}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-5 w-5 text-purple-500 hover:text-purple-800" />
//               </button>
//             )} */}
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
//         <Button
//             icon="pi pi-filter-slash"
//             // label="Clear All"
//             className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
//             onClick={handleClearAllFilters}
//           />
          
//           <Button
//             icon="pi pi-plus"
//             label="Add Order"
//             className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-sm font-medium shadow-md"
//             onClick={() => navigate("/Addorder")}
//           />
//           <Dropdown
//             value={lazyState.status}
//             options={[
//               { label: "All Orders", value: " " },
//               { label: "Placed Order", value: "Order Placed" },
//               { label: "Partial Order", value: "Partial" },
//               { label: "Delivered Order", value: "Delivered" },
//             ]}
//             onChange={handleStatusChange}
//             placeholder="Select Order Status"
//             className="p-dropdown border-gray-300 rounded-lg shadow-sm bg-gray-50"
//           />

          
//           <Exportdata data={order} fileName="orders.csv" />
//         </div>
//       </header>
//       <DataTable
//         value={order}
//         lazy
//         scrollable
//         scrollHeight="650px"
//         dataKey="_id"
//         paginator
//         first={lazyState.first}
//         rows={lazyState.rows}
//         totalRecords={totalRecords}
//         onPage={onPage}
//         onSort={onSort}
//         sortField={lazyState.sortField}
//         sortOrder={lazyState.sortOrder}
//         onFilter={onFilter}
//         filters={lazyState.filters}
//         loading={loading}
//         showGridlines
//         filterDisplay="menu"
//         emptyMessage={
//           <div className="flex flex-col items-center py-8">
//             <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//             </svg>
//             <span className="text-gray-600 font-medium mt-2">No orders found.</span>
//           </div>
//         }
//         className="p-datatable-striped text-sm text-gray-700 rounded-lg border border-gray-200"
//         rowsPerPageOptions={[10, 20, 50, 100]}
//         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//         currentPageReportTemplate={`Showing page ${currentPage} of ${Math.ceil(
//           totalRecords / lazyState.rows
//         )}`}
//         expandedRows={expandedRows}
//         onRowToggle={(e) => setExpandedRows(e.data)}
//         rowExpansionTemplate={rowExpansionTemplate}
//       >
//         <Column expander style={{ width: "3rem" }} />
//         <Column header="S.No" body={(data, options) => options.rowIndex + 1} style={{ width: "4rem" }} />
//         <Column field="action" header="Action" body={actionBodyTemplate} style={{ width: "6rem" }} />
//         {/* <Column field="invoice" header="Invoice" body={invoiceBodyTemplate} style={{ width: "6rem" }} /> */}
//         <Column
//           field="orderId"
//           header="Order Id"
//           filter
//           filterElement={orderidTemplate}
//           filterPlaceholder="Search by Order ID"
//           showFilterMenu={true}
//           frozen
//           style={{ minWidth: "8rem" }}
//           className="font-medium text-indigo-600"
//         />
//         <Column
//           field="orderDate"
//           header="Order Date"
//           filter
//           filterElement={orederdateTemplate}
//           filterPlaceholder="Search by Orderdate"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="Orderstatus"
//           header="Order Status"
//           filter
//           filterElement={orderStatusFilterTemplate} // Multi-select filter
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//           body={(rowData) => (
//             <span
//               className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
//                 rowData.Orderstatus === "Delivered"
//                   ? "bg-green-100 text-green-800"
//                   : rowData.Orderstatus === "Order Placed"
//                   ? "bg-blue-100 text-blue-800"
//                   : "bg-yellow-100 text-yellow-800"
//               }`}
//             >
//               {rowData.Orderstatus}
//             </span>
//           )}
//         />
//         <Column
//           field="ConsignerName"
//           header="Consigner Name"
//           filter
//           filterElement={consignerNameFilterTemplate} // Multi-select filter
//           showFilterMenu={true}
//           style={{ minWidth: "10rem" }}
//         />
//         <Column
//           field="consignermobileNumber"
//           header="Consigner No"
//           filter
//           filterPlaceholder="Search by Consigner Mobile"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="consignerAddress"
//           header="Consigner Address"
//           // filter
//           filterPlaceholder="Search by Consigner Address"
//           showFilterMenu={true}
//           style={{ minWidth: "12rem" }}
//         />
//         <Column
//           field="consignercity"
//           header="Consigner City"
//           filter
//           filterElement={consignerCityFilterTemplate} // Multi-select filter
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="consignerdistrict"
//           header="Consigner District"
//           filter
//           filterElement={conrdistrictTemplate}
//           filterPlaceholder="Search by Consigner District"
//           showFilterMenu={true}
//           style={{ minWidth: "10rem" }}
//         />
//         <Column
//           field="consignerstate"
//           header="Consigner State"
//           // filter
//           filterPlaceholder="Search by Consigner State"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="consignerpincode"
//           header="Consigner Pincode"
//           // filter
//           // filterElement={consignerpincodeFilterTemplate}
//           filterPlaceholder="Search by Consigner Pincode"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="noofpackage"
//           header="No of Package"
//           // filter
//           filterPlaceholder="Search by No. of Packages"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="packageWeight"
//           header="Package Weight"
//           // filter
//           filterPlaceholder="Search by Package Weight"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="price"
//           header="Price"
//           // filter
//           filterPlaceholder="Search by Price"
//           showFilterMenu={true}
//           style={{ minWidth: "6rem" }}
//           body={(rowData) => `₹${rowData.price}`}
//         />
//       </DataTable>
//     </div>
//   );
// };

// export default Orderheader;

// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import Exportdata from "./Exportdata";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { InputText } from "primereact/inputtext";
// import { Dropdown } from "primereact/dropdown";
// import { Button } from "primereact/button";



// const Orderheader = (props) => {
//     const {rowExpansionTemplate,expandedRows,setExpandedRows,navigate,order,totalRecords,loading,searchQuery,currentPage,lazyState,onPage,onSort,onFilter,handleStatusChange,handleSearchChange,actionBodyTemplate,invoiceBodyTemplate,deliverytemplate} = props;

//   return (
//     <div className="w-full mx-auto p-3 sm:p-5 md:p-6 lg:p-4 bg-white shadow-xl rounded-lg border border-gray-200  transition-all duration-300 lg:mt-0 mt-2">
//       <header className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center justify-between  mb-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Order List</h1>
//           <Button
//              icon="pi pi-list-check"
//              label="My Order"
//              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
//              onClick={() => navigate("/Myorder")}
//           />
//         </div>
//         <div className="flex-1 flex justify-center  w-full sm:w-auto">
//           <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//             <InputText
//               type="text"
//               placeholder="Search for Order ID or Consigneer Name"
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm shadow-sm transition-all duration-200"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
//             <Button
//             icon="pi pi-plus"
//             label="Add Order"
//              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-sm font-medium shadow-md"
//             onClick={() => navigate("/Addorder")}
//           />
//           <Dropdown
//             value={lazyState.status}
//             options={[
//               { label: "All Orders", value: " " },
//               { label: "Placed Order", value: "Order Placed" },
//               { label: "Partial Order", value: "Partial" },
//               // { label: "Out for Delivery", value: "Out for Delivery" },
//               { label: "Delivered Order", value: "Delivered" },
//             ]}
//             onChange={handleStatusChange}
//             placeholder="Select Order Status"
//             className="p-dropdown border-gray-300 rounded-lg shadow-sm bg-gray-50"
//           />
//           <Exportdata data={order} fileName="orders.csv" />
         
//         </div>
//       </header>
//       {/* <CustomPaginator> */}
//       <DataTable
//         value={order}
//         lazy
//         scrollable
//         scrollHeight="650px"
//         dataKey="_id"
//         paginator
//         first={lazyState.first}
//         rows={lazyState.rows}
//         totalRecords={totalRecords}
//         onPage={onPage}
//         onSort={onSort}
//         sortField={lazyState.sortField}
//         sortOrder={lazyState.sortOrder}
//         onFilter={onFilter}
//         filters={lazyState.filters}
//         loading={loading}
//         showGridlines
//         filterDisplay="menu"
//         emptyMessage={
//         <div className="flex flex-col items-center py-8">
//           <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//           </svg>
//           <span className="text-gray-600 font-medium mt-2">No orders found.</span>
//         </div>}
//          className="p-datatable-striped text-sm text-gray-700 rounded-lg   border border-gray-200"
//         rowsPerPageOptions={[10, 20, 50, 100]}
//         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//         currentPageReportTemplate={`Showing page ${currentPage} of ${Math.ceil(
//           totalRecords / lazyState.rows
//         )}`}
//         expandedRows={expandedRows}
//         onRowToggle={(e) => setExpandedRows(e.data)}
//         rowExpansionTemplate={rowExpansionTemplate}
//       > 
//          <Column expander style={{ width: "3rem" }} />
//         <Column header="S.No" body={(data, options) => options.rowIndex + 1} style={{ width: "4rem" }} />
//         <Column field="action" header="Action" body={actionBodyTemplate} style={{ width: "6rem" }}  />
//         <Column field="invoice" header="Invoice" body={invoiceBodyTemplate} style={{ width: "6rem" }} />
//         <Column
//           field="orderId"
//           header="Order Id"
//           filter
//           filterPlaceholder="Search by Order ID"
//           showFilterMenu={true}
//           frozen
//           style={{ minWidth: "8rem" }}
//           className="font-medium text-indigo-600"
//         />
//         <Column
//           field="orderDate"
//           header="Order Date"
//           filter
//           filterPlaceholder="Search by Orderdate"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="Orderstatus"
//           header="Order Status"
//           filter
//           filterPlaceholder="Search by Order Status"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//           body={(rowData) => (
//             <span
//               className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
//                 rowData.Orderstatus === "Delivered"
//                   ? "bg-green-100 text-green-800"
//                   : rowData.Orderstatus === "Order Placed"
//                   ? "bg-blue-100 text-blue-800"
//                   : "bg-yellow-100 text-yellow-800"
//               }`}
//             >
//               {rowData.Orderstatus}
//             </span>
//           )}
//         />
//         <Column
//           field="ConsignerName"
//           header="Consigner Name"
//           filter
//           filterPlaceholder="Search by Consigner Name"
//           showFilterMenu={true}
//           style={{ minWidth: "10rem" }}
//         />
//         <Column
//           field="consignermobileNumber"
//           header="Consigner No"
//           filter
//           filterPlaceholder="Search by Consigner Mobile"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="consignerAddress"
//           header="Consigner Address"
//           filter
//           filterPlaceholder="Search by Consigner Address"
//           showFilterMenu={true}
//           style={{ minWidth: "12rem" }}
//         />
//         <Column
//           field="consignercity"
//           header="Consigner City"
//           filter
//           filterPlaceholder="Search by Consigner City"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         {/* <Column  field="consignermail"  header="ConsignerMail"  filter  filterPlaceholder="Search by Consigner Mail"  showFilterMenu={true}/> */}
//         <Column
//           field="consignerdistrict"
//           header="Consigner District"
//           filter
//           filterPlaceholder="Search by Consigner District"
//           showFilterMenu={true}
//           style={{ minWidth: "10rem" }}
//         />
//         <Column
//           field="consignerstate"
//           header="Consigner State"
//           filter
//           filterPlaceholder="Search by Consigner State"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="consignerpincode"
//           header="Consigner Pincode"
//           filter
//           filterPlaceholder="Search by Consigner Pincode"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         {/* <Column header="Consignee Name" body={(rowData) => consigneeFieldTemplate(rowData, 'Consigneename')} filter filterPlaceholder="Search by Consignee Name" showFilterMenu />
//         <Column header="Consignee Mobile No" body={(rowData) => consigneeFieldTemplate(rowData, 'consigneemobileno')} filter filterPlaceholder="Search by Consignee Mobile" showFilterMenu />
//         <Column header="Consignee Alter No" body={(rowData) => consigneeFieldTemplate(rowData, 'consigneealterno')} filter filterPlaceholder="Search by Consignee Alter No" showFilterMenu />
//         <Column header="Consignee District" body={(rowData) => consigneeFieldTemplate(rowData, 'consigneedistrict')} filter filterPlaceholder="Search by Consignee District" showFilterMenu />
//         <Column header="Consignee Address" body={(rowData) => consigneeFieldTemplate(rowData, 'consigneeaddress')} filter filterPlaceholder="Search by Consignee Address" showFilterMenu />
//         <Column header="Consignee City" body={(rowData) => consigneeFieldTemplate(rowData, 'consigneecity')} filter filterPlaceholder="Search by Consignee City" showFilterMenu />
//         <Column header="Consignee State" body={(rowData) => consigneeFieldTemplate(rowData, 'consigneestate')} filter filterPlaceholder="Search by Consignee State" showFilterMenu />
//         <Column header="Consignee Pin" body={(rowData) => consigneeFieldTemplate(rowData, 'consigneepin')} filter filterPlaceholder="Search by Consignee Pin" showFilterMenu /> */}
//         {/* <Column  field="packagetype"  header="PackageType"  filter  filterPlaceholder="Search by Package Type"  showFilterMenu={true}/> */}
//         <Column
//           field="noofpackage"
//           header="No of Package"
//           filter
//           filterPlaceholder="Search by No. of Packages"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="packageWeight"
//           header="Package Weight"
//           filter
//           filterPlaceholder="Search by Package Weight"
//           showFilterMenu={true}
//           style={{ minWidth: "8rem" }}
//         />
//         <Column
//           field="price"
//           header="Price"
//           filter
//           filterPlaceholder="Search by Price"
//           showFilterMenu={true}
//           style={{ minWidth: "6rem" }}
//           body={(rowData) => `₹${rowData.price}`}
//         />
//         {/* <Column  field="deliveryimage"  header="DeliveryImage"  body={deliverytemplate}/> */}
//       </DataTable>
//       {/* </CustomPaginator> */}
//     </div>
//   );
// };
  
// export default Orderheader;