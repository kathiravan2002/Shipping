import React, { useState, useEffect } from 'react';
import Outfordelivery from '../../shared/components/Outfordelivery';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Apiendpoint from "../../shared/services/Apiendpoint";

function Outdeliverypage() {
  const { id } = useParams();
  const [out, setOut] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});
   const [orders, setOrders] = useState([]);

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

  const userRole = localStorage.getItem("role");
  const outRegion = userRole === "admin" ? "admin" : localStorage.getItem("Region");

  const fetchOut = async () => {
    try {
      const response = await axios.get(`${Apiendpoint}/api/order/orders/out/${outRegion}`);
      setOut(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching Out for Delivery orders:", error);
      setOut([]);
    }
  };

  useEffect(() => {
    fetchOut();
  }, []);
  const UserRole = localStorage.getItem("role");
  const getregion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(`${Apiendpoint}/api/order/orders/delivered/${getregion}`);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching delivered orders:', err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();

  }, []);

  const updateOrder = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("cstatus", formData.cstatus); // Use cstatus for consignee

      if (formData.productImage) {
        formDataToSend.append("productImage", formData.productImage); // Match backend field
      }

      console.log("Updating with cid:", formData.cid); // Debug log
      const response = await axios.put(
        `${Apiendpoint}/api/order/consignee/${formData.cid}`, // Use consignee endpoint
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Consignee status updated successfully!");
      await fetchOut(); // Refresh orders after update
      setVisible(false);
    } catch (error) {
      console.error("Error updating consignee status:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to update consignee status.");
    }
  };

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
        allowedStatuses = []; // No further change possible
        break;
      default:
        allowedStatuses = [CONSIGNEE_STATUS.PLACED];
    }
    return [currentStatus, ...allowedStatuses].filter(Boolean);
  };

  return (
    <div>
      <Outfordelivery
        out={out}
        visible={visible}
        setVisible={setVisible}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        updateOrder={updateOrder}
        CONSIGNEE_STATUS={CONSIGNEE_STATUS}
        getNextAllowedStatuses={getNextAllowedStatuses}
        navigate={navigate}
        orders={orders}
      />
    </div>
  );
}

export default Outdeliverypage;







// import React, { useState, useEffect } from "react";
// import Outfordelivery from "../../shared/components/Outfordelivery";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// function Outdeliverypage() {
//   const { id } = useParams();
//   const [out, setOut] = useState([]);
//   const navigate = useNavigate();
//   const [visible, setVisible] = useState(false);
//   const [formData, setFormData] = useState({});

//   const editOrder = ({ _id }) => {
//     navigate(`/Addorder/${_id}`);
//   };

//   const UserRole = localStorage.getItem("role");
//   const getregion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

//   const fetchout = async () => {
//     try {
//       const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/out/${getregion}`);
//       setOut(response.data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     fetchout();
//   }, []);

//   const updateOrder = async () => {
//     if (!formData._id) {
//       alert("No order selected for update.");
//       return;
//     }
//     try {
//       await axios.put(`http://192.168.29.71:5000/api/order/${formData._id}`, formData);
//       alert("Order updated successfully!");
//       setVisible(false);
//       fetchout(); // Refresh order list after update
//     } catch (error) {
//       console.error("Error updating order:", error);
//       alert("Failed to update order.");
//     }
//   };

//   return (
//     <div>
//       <Outfordelivery 
//         updateOrder={updateOrder} 
//         formData={formData} 
//         setFormData={setFormData} 
//         out={out} 
//         editOrder={editOrder} 
//         visible={visible} 
//         setVisible={setVisible} 
//       />
//     </div>
//   );
// }

// export default Outdeliverypage;





// import React , { useState, useEffect } from 'react'
// import Outfordelivery from '../../shared/components/Outfordelivery';
// import axios from 'axios'
// import { useNavigate, useParams } from 'react-router-dom';

// function Outdeliverypage() {

//   const { id } = useParams();
//   const [out, setOut] = useState([]);

//   const navigate = useNavigate();
//   const [visible, setVisible] = useState(false);
//   const [formData, setFormData] = useState([])
//   const editOrder = ({ _id }) => {
//       navigate(`/Addorder/${_id}`); // Redirect to Add Order page with the order ID
//   };



//   const UserRole = localStorage.getItem("role");
//   const getregion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

//   const fetchout = async () => {
//       const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/out/${getregion}`)
//       setOut(response.data);

//   }

//   useEffect(() => {
//       fetchout();
//   }, []);

//   useEffect(() => {
//     if (id) {
//       // Fetch order details for editing
//       const fetchOrderDetails = async () => {
//         try {
//           const response = await axios.get(
//             `http://192.168.29.71:5000/api/order/${id}`
//           );
//           setFormData(response.data); // Pre-fill the form
//         } catch (error) {
//           console.error("Error fetching order details:", error);
//         }
//       };

//       fetchOrderDetails();
//     }
//   }, [id]);

  
//   const updateOrder = async () => {
//     try {
//       await axios.put(`http://192.168.29.71:5000/api/order/${id}`, formData);
//       alert("Order updated successfully!");
//       fetchout(); // Refresh the orders list after updating
//     } catch (error) {
//       console.error("Error updating order:", error);
//       alert("Failed to update order.");
//     }
//   };
//   return (
//     <div> <Outfordelivery fetchOrderDetails={fetchOrderDetails} updateOrder={updateOrder} formData={formData} setFormData={setFormData} out={out} editOrder={editOrder} visible={visible} setVisible={setVisible}/></div>
//   )
// }

// export default Outdeliverypage;