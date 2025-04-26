/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function Datatable ({order, lazyState, onPage, onSort, onFilter, loading, expandedRows, setExpandedRows, rowExpansionTemplate, 
    actionBodyTemplate, orderIdFilterTemplate, orderDateFilterTemplate, orderStatusFilterTemplate, consignerNameFilterTemplate, consignerCityFilterTemplate, 
    conrDistrictFilterTemplate, totalRecords, currentPage}) {

    return (
        <>
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
            <span className="mt-2 font-medium text-gray-600">No orders found.</span>
          </div>
        }
        className="text-sm text-gray-700 border border-gray-200 rounded-lg p-datatable-striped"
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
        
        </>
    )
}