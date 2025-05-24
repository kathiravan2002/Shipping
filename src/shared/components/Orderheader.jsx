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
    consignerNames,
    orderStatuses,
    consignerCities,
    OrderDate,
    OrderId,
    conrDistrict,
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

  const currentRegionBody = (rowData) => {
    const userRegion = localStorage.getItem("Region");
    return userRegion && userRegion === rowData.currentRegion
      ? "My Region Order"
      : rowData.currentRegion || "N/A";
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
              { label: "Dispatched Order", value: "Order Dispatched" },
              { label: "Out for Delivery", value: "Out for Delivery" },
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
          showApplyButton={false}
          showClearButton={false}
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
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${rowData?.Orderstatus === "Delivered"
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
          field="currentRegion"
          header="Received from"
          style={{ minWidth: "8rem" }}
          body={currentRegionBody}
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
