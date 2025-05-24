import React, { useEffect, useState } from "react";
import Orderheader from "../../shared/components/Orderheader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { apigetRegionFilter } from "../../shared/services/Apiorders/apiorders";
import apiurl from "../../shared/services/Apiendpoint";


function Orderpage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
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
      orderDate: { value: null },
      orderId: { value: null },
      ConsignerName: { value: null }, // Multi-select filter
      Orderstatus: { value: null }, // Multi-select filter
      consignermobileNumber: { value: null },
      consignercity: { value: null }, // Multi-select filter
      consignermail: { value: null },
      consignerdistrict: { value: null },
      consignerpincode: { value: null },
      consignerstate: { value: null },
      productname: { value: null },
      packagetype: { value: null },
      dispatchstate: { value: null },
      dispatchdistrict: { value: null },
    },
    status: "",
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await apigetRegionFilter(); 
        const { filterOptions } = response;
  
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
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

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
          `${apiurl()}/api/order/orders/filter?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      } else {
        response = await axios.get(
          `${apiurl()}/api/order/getorder/${getregion}?page=${lazyState.page + 1}&limit=${lazyState.rows}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      }

      setOrder(response.data.order);
      setTotalRecords(response.data.total);
      setCurrentPage(response.data.page);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders. Please try again.");
      setOrder([]);
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
        `${apiurl()}/api/invoice/generate-invoice/${_id}`,
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
        `${apiurl()}/api/invoice/consignee-invoice/${_id}`,
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
      await axios.delete(`${apiurl()}/api/order/${_id}`, {
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

  const handleStatusChange = (event) => {
    setLazyState((prevState) => ({
      ...prevState,
      status: event.value,
      page: 0,
      first: 0,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setLazyState((prevState) => ({
      ...prevState,
      page: 0,
      first: 0,
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
          onClick={() => deleteOrder({ _id: rowData._id }, loadOrders)}
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

  const deliverytemplate = (rowData) => {
    return (
      <img
        src={`${apiurl()}${rowData.deliveryimage}`}
        alt="Not Delivered"
        className="w-auto h-auto rounded-lg"
      />
    );
  };

  const productImage = (rowData) => {
    return (
      <img
        src={`${apiurl()}${rowData.productImage}`}
        alt="Not Delivered"
        className="w-25 h-20 rounded-lg"
      />
    );
  };

  const rowExpansionTemplate = (rowData) => {
    return (
      <div className="p-4 rounded-md bg-gray-50">
        <DataTable
          value={rowData.consignees || []}
          scrollable
          scrollHeight="300px"
          className="p-datatable-striped w-auto text-sm"
          emptyMessage="No consignee details found"
        >
          <Column field="invoice" header="Invoices" body={consigneeinvTemplate} />
          <Column field="cid" header="Consignee Id" frozen />
          <Column field="cstatus" header="Status" />
          <Column field="Consigneename" header="Consignee Name" />
          <Column field="consigneemobileno" header="Mobile No" />
          <Column field="consigneeaddress" header="Address" />
          <Column field="consigneecity" header="ConsigneeCity" />
          <Column field="consigneestate" header="ConsigneeState" />
          <Column field="consigneeedistrict" header="ConsigneeDistrict" />
          <Column field="consigneepin" header="ConsigneePin" />
          <Column field="typename" header="Product Name" />
          <Column field="ptype" header="Packagetype" />
          <Column field="totalWeight" header="TotalWeight" />
          <Column field="cprice" header="Price" />
          <Column field="productImage" header="Image" body={productImage} />
        </DataTable>
      </div>
    );
  };

  return (
    <>
      <Orderheader
        rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows}
        setExpandedRows={setExpandedRows}
        navigate={navigate}
        order={order}
        totalRecords={totalRecords}
        loading={loading}
        searchQuery={searchQuery}
        currentPage={currentPage}
        lazyState={lazyState}
        onPage={onPage}
        onSort={onSort}
        onFilter={onFilter}
        handleStatusChange={handleStatusChange}
        handleSearchChange={handleSearchChange}
        actionBodyTemplate={actionBodyTemplate}
        // invoiceBodyTemplate={invoiceBodyTemplate}
        deliverytemplate={deliverytemplate}
        consignerNames={consignerNames}
        orderStatuses={orderStatuses}
        consignerCities={consignerCities}
        OrderDate={orderDate}
        OrderId={orderId}
        conrDistrict={consignerDistrict}
        ConsignerPincode={consignerPincode}
        handleClearAllFilters={handleClearAllFilters}
        
      />
    </>
  );
}

export default Orderpage;

// import React, { useEffect, useState } from 'react'
// import Orderheader from '../../shared/components/Orderheader'
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FilterMatchMode } from "primereact/api";
// import { Button } from "primereact/button";
// import Apiendpoint from "../../shared/services/Apiendpoint"
// import { Column } from 'primereact/column';
// import { DataTable } from 'primereact/datatable';



// function Orderpage() {
//   const navigate = useNavigate();
//   const [order, setOrder] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [expandedRows,setExpandedRows] = useState(null);

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
//       orderDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       orderId: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       ConsignerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       Orderstatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consignermobileNumber: { value: null, matchMode: FilterMatchMode.CONTAINS,},
//       consignercity: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consignermail: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consignerdistrict: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       consignerstate: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       // Consigneename: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       // consigneemobileno: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       // consigneealterno: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       // consigneedistrict: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       // consigneecity: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       // consigneestate: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
//          `${Apiendpoint}/api/order/orders/filter?${params.toString()}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//             },
//           }
//         );

//         setOrder(response.data.order);
//         setTotalRecords(response.data.total);
//         setCurrentPage(response.data.page);
//       } else {
//         // If no filters are active, use the regular GET API
//         response = await axios.get(
//             `${Apiendpoint}/api/order/getorder/${getregion}?page=${lazyState.page + 1}&limit=${lazyState.rows}`,
//             {
//                 headers: {
//                     "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//                 }
//             }
//         );
        
//         setOrder(response.data.order);
//         setTotalRecords(response.data.total);
//         setCurrentPage(response.data.page);
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       toast.error("Error loading orders. Please try again.");
//       setOrder([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, [lazyState, searchQuery, getregion]);

//   const downloadinvoice = async (_id) => {
//     if (!_id || typeof _id !== "string" || _id.length !== 24) {
//       console.error("Invalid ID passed to downloadInvoice");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${Apiendpoint}/api/invoice/generate-invoice/${_id}`,
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

//   const consigneeinvoice = async (_id) => {
//     if (!_id || typeof _id !== "string" || _id.length !== 24) {
//       console.error("Invalid ID passed to downloadInvoice");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${Apiendpoint}/api/invoice/consignee-invoice/${_id}`,
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
//         await axios.delete(`${Apiendpoint}/api/order/${_id}`, {
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

//   const handleStatusChange = (event) => {
//     setLazyState(prevState => ({
//         ...prevState,
//         status: event.value,
//         page: 0,
//         first: 0
//     }));
// };

// const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     setLazyState(prevState => ({
//         ...prevState,
//         page: 0,
//         first: 0
//     }));
// };

//   const actionBodyTemplate = (rowData) => {
//     return (
//       <div className="flex items-center -space-x-4 -ml-5">
//       <Button
//         icon="pi pi-pencil"
//         className="p-button-text p-button-rounded p-button-info"
//         onClick={() => navigate(`/Addorder/${rowData._id}`)}
//       />
//       <Button
//         icon="pi pi-trash"
//         className="p-button-text p-button-rounded p-button-info"
//         onClick={() => deleteOrder({ _id: rowData._id })}
//       />
//     </div>
    
     
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
//   const consigneeinvTemplate = (rowData) => {
//     return (
//       <Button
//         icon="pi pi-download"
//         className="p-button-text p-button-rounded p-button-info"
//         onClick={() => consigneeinvoice(rowData._id)}
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

//   const productImage =(rowData) => {
//     return (
//       <img
//         src={`http://192.168.29.12:5000${rowData.productImage}`}
//         alt="Not Delivered"
//         className="w-25 h-20 rounded-lg"
//       />
//     );
//   };
//   const rowExpansionTemplate =(rowData) => {
//     return (
//       <div className='p-4 rounded-md bg-gray-50'>
//         <DataTable
//         value={rowData.consignees || []}
//         scrollable
//         scrollHeight="300px"
//         className="p-datatable-striped w-auto text-sm"
//         emptyMessage="No consignee details found"
//         > <Column field="invoice" header="Invoices" body={consigneeinvTemplate} />
//           <Column field="cid" header="Consignee Id" frozen />
//           <Column field="cstatus" header="Status" />
//           <Column field="Consigneename" header="Consignee Name" />
//           <Column field="consigneemobileno" header="Mobile No" />
//           {/* <Column field="consigneealterno" header="Alter No" /> */}
//           <Column field="consigneeaddress" header="Address" />
//           <Column field="consigneecity" header="ConsigneeCity" />
//           <Column field="consigneestate" header="ConsigneeState" />
//           <Column field="consigneeedistrict" header="ConsigneeDistrict" />
//           <Column field="consigneepin" header="ConsigneePin" />
//           <Column field="typename" header="Product Name" />
//           <Column field="ptype" header="Packagetype" />
//           <Column field="totalWeight" header="TotalWeight" />
//           <Column field="cprice" header="Price" />
        
//           <Column field='productImage' header="Image" body={productImage} />
//         </DataTable>

//       </div>
//     )
//   }

//   return (
//     <>
//       <Orderheader  rowExpansionTemplate={rowExpansionTemplate} expandedRows={expandedRows} setExpandedRows={setExpandedRows} navigate={navigate} order={order} totalRecords={totalRecords} loading={loading}  searchQuery={searchQuery} currentPage={currentPage} lazyState={lazyState} onPage={onPage} onSort={onSort} onFilter={onFilter} handleStatusChange={handleStatusChange} handleSearchChange={handleSearchChange} actionBodyTemplate={actionBodyTemplate} invoiceBodyTemplate={invoiceBodyTemplate}  deliverytemplate={deliverytemplate}  />
//     </>
//   );
// }
  
// export default Orderpage;

