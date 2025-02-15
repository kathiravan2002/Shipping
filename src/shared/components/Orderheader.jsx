import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Exportdata from "./Exportdata";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";


const Orderheader = (props) => {
    const {navigate,order,totalRecords,loading,searchQuery,currentPage,lazyState,onPage,onSort,onFilter,handleStatusChange,handleSearchChange,actionBodyTemplate,invoiceBodyTemplate,deliverytemplate,} = props;
  
  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-300 mt-3">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Order List</h1>
          <Button
             icon="pi pi-list-check"
             label="My Order"
             className="flex items-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 rounded-md text-sm"
             onClick={() => navigate("/Myorder")}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <InputText
              type="text"
              placeholder="Search for Order ID or Consigneer Name"
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex gap-4 mr-5"> 
            <Button
            icon="pi pi-plus"
            label="Add Order"
            className="flex items-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 rounded-md text-sm"
            onClick={() => navigate("/Addorder")}
          />
          <Dropdown
            value={lazyState.status}
            options={[
              { label: "All Orders", value: " " },
              { label: "Placed Order", value: "Order Placed" },
              { label: "Dispatched Order", value: "Order Dispatched" },
              { label: "Out for Delivery", value: "Out for Delivery" },
              { label: "Delivered Order", value: "Delivered" },
            ]}
            onChange={handleStatusChange}
            placeholder="Select Order Status"
            className="p-dropdown"
          />
          <Exportdata data={order} fileName="orders.csv" />
         
        </div>
      </header>

      <DataTable
        value={order}
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
        emptyMessage="No orders found."
        className="p-datatable-striped"
        rowsPerPageOptions={[10, 20, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate={`Showing page ${currentPage} of ${Math.ceil(
          totalRecords / lazyState.rows
        )}`}
      >
        <Column  field="action" header="Action" body={actionBodyTemplate} />
        <Column  field="invoice" header="Invoice" body={invoiceBodyTemplate} />
        <Column  field="orderId"  header="OrderId"  filter  filterPlaceholder="Search by Order ID"  showFilterMenu={true}  frozen/>
        <Column  field="orderDate"  header="OrderDate"  filter  filterPlaceholder="Search by Orderdate"  showFilterMenu={true}/>
        <Column  field="Orderstatus"  header="Orderstatus"  filter  filterPlaceholder="Search by Order Status"  showFilterMenu={true}/>
        <Column  field="ConsignerName"  header="ConsignerName"  filter  filterPlaceholder="Search by Consigner Name"  showFilterMenu={true}/>
        <Column  field="consignermobileNumber"  header="ConsignerNo"  filter  filterPlaceholder="Search by Consigner Mobile"  showFilterMenu={true}/>
        <Column  field="consignerAddress"  header="ConsignerAddress"  filter  filterPlaceholder="Search by Consigner Address"  showFilterMenu={true}/>
        <Column  field="consignercity"  header="ConsignerCity"  filter  filterPlaceholder="Search by Consigner City"  showFilterMenu={true}/>
        <Column  field="consignermail"  header="ConsignerMail"  filter  filterPlaceholder="Search by Consigner Mail"  showFilterMenu={true}/>
        <Column  field="consignerdistrict"  header="ConsignerDistrict"  filter  filterPlaceholder="Search by Consigner District"  showFilterMenu={true}/>
        <Column  field="consignerstate"  header="ConsignerState"  filter  filterPlaceholder="Search by Consigner State"  showFilterMenu={true}/>
        <Column  field="consignerpincode"  header="ConsignerPincode"  filter  filterPlaceholder="Search by Consigner Pincode"  showFilterMenu={true}/>
        <Column  field="Consigneename"  header="ConsigneeName"  filter  filterPlaceholder="Search by Consignee Name"  showFilterMenu={true}/>
        <Column  field="consigneemobileno"  header="ConsigneeMobileNo"  filter  filterPlaceholder="Search by Consignee Mobile"  showFilterMenu={true}/>
        <Column  field="consigneealterno"  header="ConsigneeAlterNo"  filter  filterPlaceholder="Search by Consignee Alter No"  showFilterMenu={true}/>
        <Column  field="consigneeedistrict"  header="ConsigneeDistrict"  filter  filterPlaceholder="Search by Consignee District"  showFilterMenu={true}/>
        <Column  field="consigneeaddress"  header="ConsigneeAddress"  filter  filterPlaceholder="Search by Consignee Address"  showFilterMenu={true}/>
        <Column  field="consigneecity"  header="ConsigneeCity"  filter  filterPlaceholder="Search by Consignee City"  showFilterMenu={true}/>
        <Column  field="consigneestate"  header="ConsigneeState"  filter  filterPlaceholder="Search by Consignee State"  showFilterMenu={true}/>
        <Column  field="consigneepin"  header="ConsigneePin"  filter  filterPlaceholder="Search by Consignee Pin"  showFilterMenu={true}/>
        <Column  field="packagetype"  header="PackageType"  filter  filterPlaceholder="Search by Package Type"  showFilterMenu={true}/>
        <Column  field="noofpackage"  header="No.of.Package"  filter  filterPlaceholder="Search by No. of Packages"  showFilterMenu={true}/>
        <Column  field="packageWeight"  header="PackageWeight"  filter  filterPlaceholder="Search by Package Weight"  showFilterMenu={true}/>
        <Column  field="price"  header="Price"  filter  filterPlaceholder="Search by Price"  showFilterMenu={true}/>
        <Column  field="deliveryimage"  header="DeliveryImage"  body={deliverytemplate}/>
      </DataTable>
    </div>
  );
};

export default Orderheader;