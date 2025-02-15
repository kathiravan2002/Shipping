import React, { useState, useEffect } from "react";
import Outfordelivery from "../../shared/components/Outfordelivery";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Outdeliverypage() {
  const { id } = useParams();
  const [out, setOut] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState([]);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};
  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      deliveryimage: file, // Store file object in state
    }));
  };

 
  const UserRole = localStorage.getItem("role");
  const getRegion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

  // Fetch orders for "Out for Delivery"
  const fetchOut = async () => {
    try {
      const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/out/${getRegion}`);
      setOut(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOut();
  }, []);

  const updateOrder = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Orderstatus", formData.Orderstatus);

      if (formData.deliveryimage) {
        formDataToSend.append("deliveryimage", formData.deliveryimage);
      }

      await axios.put(`http://192.168.29.71:5000/api/order/${formData._id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Order updated successfully!");
      fetchOut(); // Refresh orders after update
      setVisible(false);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  const ORDER_STATUS = {
    INITIAL: "",
    PLACED: "Order Placed",
    DISPATCHED: "Order Dispatched",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
  };

  const getNextAllowedStatuses = (currentStatus) => {
    let allowedStatuses = [];

    switch (currentStatus) {
        case ORDER_STATUS.INITIAL:
            allowedStatuses = [ORDER_STATUS.PLACED];
            break;
        case ORDER_STATUS.PLACED:
            allowedStatuses = [ORDER_STATUS.DISPATCHED];
            break;
        case ORDER_STATUS.DISPATCHED:
            allowedStatuses = [ORDER_STATUS.OUT_FOR_DELIVERY];
            break;
        case ORDER_STATUS.OUT_FOR_DELIVERY:
            allowedStatuses = [ORDER_STATUS.DELIVERED];
            break;
        case ORDER_STATUS.DELIVERED:
            allowedStatuses = [ORDER_STATUS.DELIVERED]; // No further change possible
            break;
        default:
            allowedStatuses = [];
    }

    // Ensure current status is included in the dropdown
    return [currentStatus, ...allowedStatuses].filter(Boolean);
}


  return (
    <div>
      <Outfordelivery
        updateOrder={updateOrder}
        formData={formData}
        setFormData={setFormData}
        out={out}
        visible={visible}
        setVisible={setVisible}
        getNextAllowedStatuses={getNextAllowedStatuses}
        handleImageUpload={handleImageUpload}
        handleInputChange={handleInputChange}
        ORDER_STATUS={ORDER_STATUS}
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