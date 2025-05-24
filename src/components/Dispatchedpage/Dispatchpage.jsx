import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Dispatched from "../../shared/components/Dispatched";
import { toast } from "react-toastify";
import apiurl from "../../shared/services/Apiendpoint";
import { apifetchdispatched, apiupdatedispatched } from "../../shared/services/Apidispatch/apidispatch";

function Dispatchpage() {
  const { id } = useParams();
  const [dispatch, setDispatch] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));                                            
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      productImage: file,
    }));
  };

  const UserRole = localStorage.getItem("role");
  const getRegion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

  const fetchDispatched = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await apifetchdispatched(getRegion, queryParams);
      setDispatch(response);
    } catch (error) {
      console.error("Error fetching dispatched orders:", error);
    }
  };

  useEffect(() => {
    fetchDispatched();
  }, []);

  const updateOrder = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("cstatus", formData.cstatus);

      if (formData.productImage) {
        formDataToSend.append("productImage", formData.productImage);
      }

      console.log("Updating with cid:", formData.cid); 
      const response = await apiupdatedispatched(formData, formDataToSend);
      console.log("Update response:", response);
      
      toast.success("Consignee status updated successfully!");
      await fetchDispatched();
      setVisible(false);
    } catch (error) {
      console.error("Error updating consignee status:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to update consignee status.");
    }
  };

  const applyFilters = (filterData) => {
    const filters = {};
    if (filterData.cid?.value) filters.cid = filterData.cid.value.join(',');
    if (filterData.Consigneename?.value) filters.Consigneename = filterData.Consigneename.value.join(',');
    if (filterData.consigneeedistrict?.value) filters.consigneeedistrict = filterData.consigneeedistrict.value.join('');
    if (filterData.cstatus?.value) filters.cstatus = filterData.cstatus.value.join('');
    if (filterData.search) filters.search = filterData.search; // Add search parameter
    fetchDispatched(filters);
  }
  const CONSIGNEE_STATUS = {
    PLACED: "Order Placed",
    DISPATCHED: "Order Dispatched",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
  };

  const getNextAllowedStatuses = (currentStatus) => {
    let allowedStatuses = [];
    switch (currentStatus) {
      case CONSIGNEE_STATUS.PLACED:
        allowedStatuses = [CONSIGNEE_STATUS.DISPATCHED];
        break;
      case CONSIGNEE_STATUS.DISPATCHED:
        allowedStatuses = [CONSIGNEE_STATUS.OUT_FOR_DELIVERY];
        break;
      case CONSIGNEE_STATUS.OUT_FOR_DELIVERY:
        allowedStatuses = [CONSIGNEE_STATUS.DELIVERED];
        break;
      case CONSIGNEE_STATUS.DELIVERED:
        allowedStatuses = [];
        break;
      default:
        allowedStatuses = [CONSIGNEE_STATUS.PLACED];
    }
    return [currentStatus, ...allowedStatuses].filter(Boolean);
  };

  return (
    <div>
      <Dispatched
        updateOrder={updateOrder}
        formData={formData}
        setFormData={setFormData}
        dispatch={dispatch}
        navigate={navigate}
        visible={visible}
        setVisible={setVisible}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        CONSIGNEE_STATUS={CONSIGNEE_STATUS}
        getNextAllowedStatuses={getNextAllowedStatuses}
        applyFilters={applyFilters}
      />
    </div>
  );
}

export default Dispatchpage;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import Dispatched from '../../shared/components/Dispatched';


// function Dispatchpage() {
//   const { id } = useParams();
//   const [dispatch, setDispatch] = useState([]);
//   const [visible, setVisible] = useState([]);
//   const [formData, setFormData] = useState([]);


//   const navigate = useNavigate();

//   const editOrder = ({ _id }) => {
//     navigate(`/Addorder/${_id}`);
//   };


//   const UserRole = localStorage.getItem("role");
//   const getregion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

//   const fetchdispatched = async () => {
//     const response = await axios.get(`http://192.168.29.12:5000/api/order/orders/dispatche/${getregion}`)
//     setDispatch(response.data);

//   }

//   useEffect(() => {
//     fetchdispatched();
//   }, []);


//   const updateOrder = async () => {
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("Orderstatus", formData.Orderstatus);

//       if (formData.deliveryimage) {
//         formDataToSend.append("deliveryimage", formData.deliveryimage);
//       }

//       await axios.put(`http://192.168.29.12:5000/api/order/${formData._id}`, formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Order updated successfully!");
//       fetchOut(); // Refresh orders after update
//       setVisible(false);
//     } catch (error) {
//       console.error("Error updating order:", error);
//       alert("Failed to update order.");
//     }
//   };

//   return (
//     <div>

//       <Dispatched updateOrder={updateOrder} formData={formData} setFormData={setFormData} dispatch={dispatch} editOrder={editOrder} navigate={navigate} visible={visible} setVisible={setVisible} />

//     </div>
//   )
// }

// export default Dispatchpage