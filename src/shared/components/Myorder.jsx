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
import { MultiSelect } from "primereact/multiselect";

export function Myorder() {
  const navigate = useNavigate();
  const [myorder, setMyorder] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState(null);
  const [consignerNames, setConsignerNames] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [orderDate, setOrderDate] = useState([]);
  const [orderId, setOrderId] = useState([]);
  const [consignerDistrict, setConsignerDistrict] = useState([]);
  const [consignerCities, setConsignerCities] = useState([]);
  const [consignerPincode, setConsignerPincode] = useState([]);


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


  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(
          `${Apiendpoint}/api/order/myorders/filter?region=${getregion}&getFilterOptions=true`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const { filterOptions } = response.data;

        setConsignerNames(filterOptions.consignerNames || []);
        setOrderStatuses(filterOptions.orderStatuses || []);
        setConsignerCities(filterOptions.consignerCities || []);
        setOrderDate(filterOptions.orderDates || []);
        setOrderId(filterOptions.orderIds || []);
        setConsignerDistrict(filterOptions.consignerDistricts || []);
        setConsignerPincode(filterOptions.consignerPincodes || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, [getregion]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      // Check if any filters are active
      const hasActiveFilters = Object.values(lazyState.filters).some(
        (filter) =>
          filter.value !== null &&
          filter.value !== "" &&
          (Array.isArray(filter.value) ? filter.value.length > 0 : true)
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
            if (
              filter.value !== null &&
              filter.value !== "" &&
              (Array.isArray(filter.value) ? filter.value.length > 0 : true)
            ) {
              activeFilters[key] = filter;
            }
          });
          params.append("filters", JSON.stringify(activeFilters));
        }


        response = await axios.get(
          `${Apiendpoint}/api/order/myorders/filter?${params.toString()}`,
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
        `${Apiendpoint}/api/invoice/generate-invoice/${_id}`,
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
        `${Apiendpoint}/api/invoice/consignee-invoice/${_id}`,
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


  const deleteOrder = async ({ _id }, loadOrders) => {
    const confirmDelete = new Promise((resolve) => {
      toast.info(
        <div>
          Are you sure you want to delete this order?
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => resolve(true)}
              className="text-blue-500 underline"
            >
              Yes
            </button>
            <button
              onClick={() => resolve(false)}
              className="text-gray-500 underline"
            >
              No
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeOnClick: true,
          closeButton: true,
        }
      );
    });

    const confirmed = await confirmDelete;
    if (!confirmed) return;

    try {
      await axios.delete(`${Apiendpoint}/api/order/${_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      loadOrders();
      // toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order. Please try again.");
    }
  };


  const handleClearAllFilters = () => {
    setSearchQuery(""); // Reset global search
    setLazyState({
      first: 0,
      rows: 10,
      page: 0,
      sortField: null,
      sortOrder: null,
      filters: {
        orderDate: { value: null },
        orderId: { value: null },
        ConsignerName: { value: null },
        Orderstatus: { value: null },
        consignermobileNumber: { value: null },
        consignercity: { value: null },
        consignermail: { value: null },
        consignerdistrict: { value: null },
        consignerpincode: { value: null },
        consignerstate: { value: null },
        productname: { value: null },
        packagetype: { value: null },
        dispatchstate: { value: null },
        dispatchdistrict: { value: null },
      },
      status: "", // Reset status dropdown
    });
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
          className="p-button-text p-button-rounded p-button-info text-teal-400"
          onClick={() => navigate(`/Addorder/${rowData._id}`)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-rounded p-button-info text-red-400"
          onClick={() => deleteOrder({ _id: rowData._id })}
        />
        <Button
          icon="pi pi-download"
          className="p-button-text p-button-rounded p-button-info text-yellow-600"
          onClick={() => downloadinvoice(rowData._id)}
        />
      </div>
    );
  };

  // const invoiceBodyTemplate = (rowData) => {
  //   return (
  //     <Button
  //       icon="pi pi-download"
  //       className="p-button-text p-button-rounded p-button-info"
  //       onClick={() => downloadinvoice(rowData._id)}
  //     />
  //   );
  // };

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
        src={`http://192.168.29.71:5000${rowData.productImage}`}
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
          <Column field="consigneeedistrict" header="Consignee District" />
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
        options={orderDate?.map((date) => ({ label: date, value: date })) || []}
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
        disabled={!orderDate?.length}
      />
    );
  };

  const orderIdFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={filterValues.orderIds}
        options={orderId?.map((id) => ({ label: id, value: id })) || []}
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
        disabled={!orderId?.length}
      />
    );
  };

  const conrDistrictFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={filterValues.conrDistricts}
        options={consignerDistrict?.map((district) => ({ label: district, value: district })) || []}
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
        disabled={!consignerDistrict?.length}
      />
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
          <div>
            <Button
              icon="pi pi-filter-slash"
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
              onClick={handleClearAllFilters}
            />
          </div>
          
        </div>
        <h1 className="text-purple-500 flext justify-end">Total My order :<span className="text-lg"> {myorder.length}</span></h1>

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
};