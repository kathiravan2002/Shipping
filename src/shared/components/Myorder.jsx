import axios from "axios";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import { Search } from "lucide-react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import Apiendpoint from "../../shared/services/Apiendpoint";
import { toast } from "react-toastify"; // Ensure toast is imported

export function Myorder() {
  const navigate = useNavigate();
  const [myorder, setMyorder] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState(null);

  const UserRole = localStorage.getItem("role");
  const getregion =
    UserRole === "admin" ? "admin" : localStorage.getItem("Region");

  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortField: null,
    sortOrder: null,
    filters: {
      orderId: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ConsignerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      Orderstatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consignermobileNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consignercity: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consignermail: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consignerdistrict: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consignerstate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      Consigneename: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consigneemobileno: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consigneealterno: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consigneedistrict: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consigneecity: { value: null, matchMode: FilterMatchMode.CONTAINS },
      consigneestate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      productname: { value: null, matchMode: FilterMatchMode.CONTAINS },
      packagetype: { value: null, matchMode: FilterMatchMode.CONTAINS },
      dispatchstate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      dispatchdistrict: { value: null, matchMode: FilterMatchMode.CONTAINS },
      cid: { value: null, matchMode: FilterMatchMode.CONTAINS }, // Added for consignee ID filtering
    },
    status: "",
  });

  const loadOrders = async () => {
    try {
      setLoading(true);

      // Check if any filters are active
      const hasActiveFilters = Object.values(lazyState.filters).some(
        (filter) => filter.value !== null && filter.value !== ""
      );
      const hasSearch = searchQuery !== "";
      const hasStatus = lazyState.status !== "";
      const hasSort = lazyState.sortField !== null;

      let response;

      if (hasActiveFilters || hasSearch || hasStatus || hasSort) {
        const params = new URLSearchParams();
        params.append("page", lazyState.page + 1);
        params.append("limit", lazyState.rows);
        params.append("region", getregion);

        if (lazyState.sortField) {
          params.append("sortField", lazyState.sortField);
          params.append("sortOrder", lazyState.sortOrder || "asc");
        }

        if (hasStatus) {
          params.append("status", lazyState.status);
        }

        if (hasSearch) {
          params.append("search", searchQuery);
        }

        if (hasActiveFilters) {
          const activeFilters = {};
          Object.entries(lazyState.filters).forEach(([key, filter]) => {
            if (filter.value !== null && filter.value !== "") {
              activeFilters[key] = filter;
            }
          });
          params.append("filters", JSON.stringify(activeFilters));
        }

        response = await axios.get(
          `${Apiendpoint}/api/order/orders/filter?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        setMyorder(response.data.order);
        setTotalRecords(response.data.total);
        setCurrentPage(response.data.page);
      } else {
        response = await axios.get(
          `${Apiendpoint}/api/order/myorder/${getregion}?page=${lazyState.page + 1}&limit=${lazyState.rows}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        setMyorder(response.data.order);
        setTotalRecords(response.data.total);
        setCurrentPage(response.data.page);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders. Please try again.");
      setMyorder([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [lazyState, searchQuery, getregion]);

  const downloadinvoice = async (_id) => {
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
      console.error("Invalid ID passed to downloadInvoice");
      return;
    }

    try {
      const response = await axios.post(
        `${Apiendpoint}/api/invoices/generate-invoice/${_id}`,
        {},
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the invoice:", error);
      toast.error("Error downloading invoice. Please try again.");
    }
  };

  const consigneeinvoice = async (_id) => {
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
      console.error("Invalid ID passed to downloadInvoice");
      return;
    }

    try {
      const response = await axios.post(
        `${Apiendpoint}/api/invoices/consignee-invoice/${_id}`,
        {},
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the invoice:", error);
      toast.error("Error downloading invoice. Please try again.");
    }
  };

  const deleteOrder = async ({ _id }) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`${Apiendpoint}/api/order/${_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        loadOrders();
        toast.success("Order deleted successfully");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Error deleting order. Please try again.");
      }
    }
  };

  const onPage = (event) => {
    setLazyState((prevState) => ({
      ...prevState,
      page: event.page,
      first: event.first,
      rows: event.rows,
    }));
  };

  const onSort = (event) => {
    setLazyState((prevState) => ({
      ...prevState,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    }));
  };

  const onFilter = (event) => {
    setLazyState((prevState) => ({
      ...prevState,
      filters: event.filters,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setLazyState(prevState => ({
      ...prevState,
      page: 0,
      first: 0
    }));
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center -space-x-4 -ml-5">
        <Button
          icon="pi pi-pencil"
          className="p-button-text p-button-rounded p-button-info"
          onClick={() => navigate(`/Addorder/${rowData._id}`)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-rounded p-button-info"
          onClick={() => deleteOrder({ _id: rowData._id })}
        />
      </div>
    );
  };

  const invoiceBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-download"
        className="p-button-text p-button-rounded p-button-info"
        onClick={() => downloadinvoice(rowData._id)}
      />
    );
  };

  const consigneeinvTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-download"
        className="p-button-text p-button-rounded p-button-info"
        onClick={() => consigneeinvoice(rowData._id)}
      />
    );
  };

  const productImage = (rowData) => {
    return (
      <img
        src={`http://192.168.29.12:5000${rowData.productImage}`}
        alt="Not Delivered"
        className="w-25 h-20 rounded-lg"
      />
    );
  };

  const rowExpansionTemplate = (rowData) => {
    console.log("Row data in expansion - Consignee Details:", rowData.consigneeDetails); // Debug log
    // Ensure consigneeDetails is an array, default to empty if undefined or not an array
    const consignees = Array.isArray(rowData.consigneeDetails) ? rowData.consigneeDetails : [];
    return (
      <div className="p-4 rounded-md bg-gray-50">
        <DataTable
          value={consignees}
          scrollable
          scrollHeight="300px"
          className="p-datatable-striped w-auto text-sm"
          emptyMessage="No consignee details found."
        >
          <Column field="invoice" header="Invoices" body={consigneeinvTemplate} />
          <Column field="cid" header="Consignee Id" frozen alignFrozen="left" />
          <Column field="cstatus" header="Status" />
          <Column field="Consigneename" header="Consignee Name" />
          <Column field="consigneemobileno" header="Mobile No" />
          {/* <Column field="consigneealterno" header="Consignee Altermobile No" /> */}
          <Column field="consigneeaddress" header="Consignee Address" />
          <Column field="consigneecity" header="Consignee City" />
          <Column field="consigneestate" header="Consignee State" />
          <Column field="consigneedistrict" header="Consignee District" />
          <Column field="consigneepin" header="Consignee Pincode" />
          <Column field="typename" header="Product Name" />
          <Column field="ptype" header="Package Type" />
          <Column field="weight" header="Weight" />
          <Column field="packages" header="Packages" />
          <Column field="totalWeight" header="Total Weight" />
          <Column field="cprice" header="Price" />
        
          <Column field="productImage" header="Image" body={productImage} />
        </DataTable>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-300 mt-3">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold">My Region Orders</h3>
        </div>
        <div className="flex-1 flex justify-center gap-10">
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
      </header>
      <DataTable
        value={myorder}
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
          </div>}
        className="p-datatable-striped text-sm text-gray-700 rounded-lg   border border-gray-200"
        rowsPerPageOptions={[10, 20, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate={`Showing page ${currentPage} of ${Math.ceil(
          totalRecords / lazyState.rows
        )}`}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column expander style={{ width: "3em" }} />
        <Column header="S.No" body={(data, options) => options.rowIndex + 1} style={{ width: "4rem" }} />
        <Column field="action" header="Action" body={actionBodyTemplate} style={{ width: "6rem" }} />
        <Column field="invoice" header="Invoice" body={invoiceBodyTemplate} style={{ width: "6rem" }} />
        <Column field="orderId" header="OrderId" filter filterPlaceholder="Search by Order ID" showFilterMenu={true} frozen style={{ minWidth: "8rem" }}
          className="font-medium text-indigo-600" />
        <Column field="orderDate" header="Order Date" filter filterPlaceholder="Search by Orderdate" showFilterMenu={true} />
        <Column field="Orderstatus" header="Order Status" filter filterPlaceholder="Search by Order Status" showFilterMenu={true} style={{ minWidth: "8rem" }}
          body={(rowData) => (
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                rowData.Orderstatus === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : rowData.Orderstatus === "Order Placed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {rowData.Orderstatus}
            </span>
          )}/>
        <Column field="ConsignerName" header="Consigner Name" filter filterPlaceholder="Search by Consigner Name" showFilterMenu={true} />
        <Column field="consignermobileNumber" header="Consigner No" filter filterPlaceholder="Search by Consigner Mobile" showFilterMenu={true} />
        <Column field="consignerAddress" header="Consigner Address" filter filterPlaceholder="Search by Consigner Address" showFilterMenu={true} />
        <Column field="consignercity" header="Consigner City" filter filterPlaceholder="Search by Consigner City" showFilterMenu={true} />
        {/* <Column field="consignermail" header="ConsignerMail" filter filterPlaceholder="Search by Consigner Mail" showFilterMenu={true} /> */}
        <Column field="consignerdistrict" header="Consigner District" filter filterPlaceholder="Search by Consigner District" showFilterMenu={true} />
        <Column field="consignerstate" header="Consigner State" filter filterPlaceholder="Search by Consigner State" showFilterMenu={true} />
        <Column field="consignerpincode" header="Consigner Pincode" filter filterPlaceholder="Search by Consigner Pincode" showFilterMenu={true} />
        <Column field="noofpackage" header="No of Package" filter filterPlaceholder="Search by No. of Packages" showFilterMenu={true} />
        <Column field="packageWeight" header="Package Weight" filter filterPlaceholder="Search by Package Weight" showFilterMenu={true} />
        <Column field="price" header="Price" filter filterPlaceholder="Search by Price" showFilterMenu={true} />
      </DataTable>
      <div>
        <Button
          type=""
          onClick={() => navigate("/Order")}
          className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-7 py-3 rounded"
        >
          Back
        </Button>
      </div>
    </div>
  );
}