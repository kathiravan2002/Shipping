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

export function Myorder() {
  const navigate = useNavigate();
  const [myorder, setMyorder] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
      consignermobileNumber: { value: null, matchMode: FilterMatchMode.CONTAINS,},
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
          `http://192.168.29.12:5000/api/order/orders/filter?${params.toString()}`,
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
          `http://192.168.29.12:5000/api/order/myorder/${getregion}?page=${lazyState.page + 1}&limit=${lazyState.rows}`,
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
  }, [lazyState, searchQuery,getregion]);

  const downloadinvoice = async (_id) => {
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
      console.error("Invalid ID passed to downloadInvoice");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.29.12:5000/api/invoice/generate-invoice/${_id}`,
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
        await axios.delete(`http://192.168.29.12:5000/api/order/${_id}`, {
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

  
  const handleStatusChange = (event) => {
    setLazyState(prevState => ({
        ...prevState,
        status: event.value,
        page: 0,
        first: 0
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
      <div>
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

  const deliverytemplate = (rowData) => {
    return (
      <img
        src={`http://192.168.29.12:5000${rowData.deliveryimage}`}
        alt="Not Delivered"
        className="w-auto h-auto rounded-lg"
      />
    );
  };
  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-300 mt-3">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
         <div className="flex items-center gap-4 ">
           <h3  className="text-2xl font-semibold">My Region Orders</h3>
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
          {/* <Dropdown
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
          /> */}
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
        emptyMessage="No orders found."
        className="p-datatable-striped"
        rowsPerPageOptions={[10, 20, 50, 100]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate={`Showing page ${currentPage} of ${Math.ceil(
          totalRecords / lazyState.rows
        )}`}
      >
        <Column field="action" header="Action" body={actionBodyTemplate} />
        <Column field="invoice" header="Invoice" body={invoiceBodyTemplate} />
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
        <Column  field="consigneedistrict"  header="ConsigneeDistrict"  filter  filterPlaceholder="Search by Consignee District"  showFilterMenu={true}/>
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

// import axios from "axios";
// import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { DataTable } from "primereact/datatable";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FilterMatchMode } from "primereact/api";

// export function Myorder() {
//   const navigate = useNavigate();
//   const [myorder, setMyrder] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const UserRole = localStorage.getItem("role");
//   const getregion =
//     UserRole === "admin" ? "admin" : localStorage.getItem("Region");

//   const [lazyState, setLazyState] = useState({
//     first: 0,
//     rows: 10,
//     page: 0,
//     sortField: null,
//     sortOrder: null,
//     filters: {
//       orderId: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       ConsignerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       Orderstatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consignermobileNumber: { value: null, matchMode: FilterMatchMode.CONTAINS,},
//       consignercity: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consignermail: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consignerdistrict: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consignerstate: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       Consigneename: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consigneemobileno: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consigneealterno: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consigneedistrict: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consigneecity: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consigneestate: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       productname: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       packagetype: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       dispatchstate: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       dispatchdistrict: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     },
//     status: "",
//   });

//   const loadOrders = async () => {
//     try {
//       setLoading(true);

//       // Check if any filters are active
//       const hasActiveFilters = Object.values(lazyState.filters).some(
//         (filter) => filter.value !== null && filter.value !== ""
//       );
//       const hasSearch = searchQuery !== "";
//       const hasStatus = lazyState.status !== "";
//       const hasSort = lazyState.sortField !== null;

//       let response;

//       // If there are any active filters, use the filter API
//       if (hasActiveFilters || hasSearch || hasStatus || hasSort) {
//         const params = new URLSearchParams();
//         params.append("page", lazyState.page + 1);
//         params.append("limit", lazyState.rows);
//         params.append("region", getregion);

//         if (lazyState.sortField) {
//           params.append("sortField", lazyState.sortField);
//           params.append("sortOrder", lazyState.sortOrder || "asc");
//         }

//         if (hasStatus) {
//           params.append("status", lazyState.status);
//         }

//         if (hasSearch) {
//           params.append("search", searchQuery);
//         }

//         if (hasActiveFilters) {
//           const activeFilters = {};
//           Object.entries(lazyState.filters).forEach(([key, filter]) => {
//             if (filter.value !== null && filter.value !== "") {
//               activeFilters[key] = filter;
//             }
//           });
//           params.append("filters", JSON.stringify(activeFilters));
//         }

//         response = await axios.get(
//           `http://192.168.29.12:5000/api/order/orders/filter?${params.toString()}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//             },
//           }
//         );

//         setMyrder(response.data.order);
//         setTotalRecords(response.data.total);
//       } else {
//         // Use the getall API if no filters are active
//         response = await axios.get(
//           `http://192.168.29.12:5000/api/order/myorder/${getregion}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//             },
//           }
//         );

//         const orders = response.data || [];
//         setMyrder(orders);
//         setTotalRecords(orders.length);
//       }

//       setCurrentPage(lazyState.page + 1);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       toast.error("Error loading orders. Please try again.");
//       setMyrder([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, [lazyState, searchQuery]);

//   const downloadinvoice = async (_id) => {
//     if (!_id || typeof _id !== "string" || _id.length !== 24) {
//       console.error("Invalid ID passed to downloadInvoice");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://192.168.29.12:5000/api/invoice/generate-invoice/${_id}`,
//         {},
//         {
//           responseType: "blob",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `invoice_${_id}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error downloading the invoice:", error);
//       toast.error("Error downloading invoice. Please try again.");
//     }
//   };

//   const deleteOrder = async ({ _id }) => {
//     if (window.confirm("Are you sure you want to delete this order?")) {
//       try {
//         await axios.delete(`http://192.168.29.12:5000/api/order/${_id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         });
//         loadOrders();
//         toast.success("Order deleted successfully");
//       } catch (error) {
//         console.error("Error deleting order:", error);
//         toast.error("Error deleting order. Please try again.");
//       }
//     }
//   };

//   const onPage = (event) => {
//     setLazyState((prevState) => ({
//       ...prevState,
//       page: event.page,
//       first: event.first,
//       rows: event.rows,
//     }));
//   };

//   const onSort = (event) => {
//     setLazyState((prevState) => ({
//       ...prevState,
//       sortField: event.sortField,
//       sortOrder: event.sortOrder,
//     }));
//   };

//   const onFilter = (event) => {
//     setLazyState((prevState) => ({
//       ...prevState,
//       filters: event.filters,
//     }));
//   };

//   const actionBodyTemplate = (rowData) => {
//     return (
//       <div>
//         <Button
//           icon="pi pi-pencil"
//           className="p-button-text p-button-rounded p-button-info"
//           onClick={() => navigate(`/Addorder/${rowData._id}`)}
//         />
//         <Button
//           icon="pi pi-trash"
//           className="p-button-text p-button-rounded p-button-info"
//           onClick={() => deleteOrder({ _id: rowData._id })}
//         />
//       </div>
//     );
//   };

//   const invoiceBodyTemplate = (rowData) => {
//     return (
//       <Button
//         icon="pi pi-download"
//         className="p-button-text p-button-rounded p-button-info"
//         onClick={() => downloadinvoice(rowData._id)}
//       />
//     );
//   };

//   const deliverytemplate = (rowData) => {
//     return (
//       <img
//         src={`http://192.168.29.12:5000${rowData.deliveryimage}`}
//         alt="Not Delivered"
//         className="w-auto h-auto rounded-lg"
//       />
//     );
//   };
//   return (
//     <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-300 mt-3">
//       <div className="flex items-start text-2xl font-semibold mb-4 ">
//         <h3>My Region Orders</h3>
//       </div>
//       <DataTable
//         value={myorder}
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
//         emptyMessage="No orders found."
//         className="p-datatable-striped"
//         rowsPerPageOptions={[10, 20, 50, 100]}
//         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//         currentPageReportTemplate={`Showing page ${currentPage} of ${Math.ceil(
//           totalRecords / lazyState.rows
//         )}`}
//       >
//         <Column field="action" header="Action" body={actionBodyTemplate} />
//         <Column field="invoice" header="Invoice" body={invoiceBodyTemplate} />
//         <Column  field="orderId"  header="OrderId"  filter  filterPlaceholder="Search by Order ID"  showFilterMenu={true}  frozen/>
//         <Column  field="orderDate"  header="OrderDate"  filter  filterPlaceholder="Search by Orderdate"  showFilterMenu={true}/>
//         <Column  field="Orderstatus"  header="Orderstatus"  filter  filterPlaceholder="Search by Order Status"  showFilterMenu={true}/>
//         <Column  field="ConsignerName"  header="ConsignerName"  filter  filterPlaceholder="Search by Consigner Name"  showFilterMenu={true}/>
//         <Column  field="consignermobileNumber"  header="ConsignerNo"  filter  filterPlaceholder="Search by Consigner Mobile"  showFilterMenu={true}/>
//         <Column  field="consignerAddress"  header="ConsignerAddress"  filter  filterPlaceholder="Search by Consigner Address"  showFilterMenu={true}/>
//         <Column  field="consignercity"  header="ConsignerCity"  filter  filterPlaceholder="Search by Consigner City"  showFilterMenu={true}/>
//         <Column  field="consignermail"  header="ConsignerMail"  filter  filterPlaceholder="Search by Consigner Mail"  showFilterMenu={true}/>
//         <Column  field="consignerdistrict"  header="ConsignerDistrict"  filter  filterPlaceholder="Search by Consigner District"  showFilterMenu={true}/>
//         <Column  field="consignerstate"  header="ConsignerState"  filter  filterPlaceholder="Search by Consigner State"  showFilterMenu={true}/>
//         <Column  field="consignerpincode"  header="ConsignerPincode"  filter  filterPlaceholder="Search by Consigner Pincode"  showFilterMenu={true}/>
//         <Column  field="Consigneename"  header="ConsigneeName"  filter  filterPlaceholder="Search by Consignee Name"  showFilterMenu={true}/>
//         <Column  field="consigneemobileno"  header="ConsigneeMobileNo"  filter  filterPlaceholder="Search by Consignee Mobile"  showFilterMenu={true}/>
//         <Column  field="consigneealterno"  header="ConsigneeAlterNo"  filter  filterPlaceholder="Search by Consignee Alter No"  showFilterMenu={true}/>
//         <Column  field="consigneedistrict"  header="ConsigneeDistrict"  filter  filterPlaceholder="Search by Consignee District"  showFilterMenu={true}/>
//         <Column  field="consigneeaddress"  header="ConsigneeAddress"  filter  filterPlaceholder="Search by Consignee Address"  showFilterMenu={true}/>
//         <Column  field="consigneecity"  header="ConsigneeCity"  filter  filterPlaceholder="Search by Consignee City"  showFilterMenu={true}/>
//         <Column  field="consigneestate"  header="ConsigneeState"  filter  filterPlaceholder="Search by Consignee State"  showFilterMenu={true}/>
//         <Column  field="consigneepin"  header="ConsigneePin"  filter  filterPlaceholder="Search by Consignee Pin"  showFilterMenu={true}/>
//         <Column  field="packagetype"  header="PackageType"  filter  filterPlaceholder="Search by Package Type"  showFilterMenu={true}/>
//         <Column  field="noofpackage"  header="No.of.Package"  filter  filterPlaceholder="Search by No. of Packages"  showFilterMenu={true}/>
//         <Column  field="packageWeight"  header="PackageWeight"  filter  filterPlaceholder="Search by Package Weight"  showFilterMenu={true}/>
//         <Column  field="price"  header="Price"  filter  filterPlaceholder="Search by Price"  showFilterMenu={true}/>
//         <Column  field="deliveryimage"  header="DeliveryImage"  body={deliverytemplate}/>
//       </DataTable>
//       <div>
//         <Button
//           type=""
//           onClick={() => navigate("/Order")}
//           className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-7 py-3 rounded"
//         >
//           Back
//         </Button>
//       </div>
//     </div>
//   );
// }
