import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Dispatched from "../../shared/components/Dispatched";
import { toast } from "react-toastify";

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
        deliveryimage: file,
    }));
};


 
  const UserRole = localStorage.getItem("role");
  const getRegion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

  const fetchDispatched = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.71:5000/api/order/orders/dispatche/${getRegion}`
      );
      setDispatch(response.data);
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
      formDataToSend.append("Orderstatus", formData.Orderstatus);

      if (formData.deliveryimage) {
        formDataToSend.append("deliveryimage", formData.deliveryimage);
      }

      await axios.put(
        `http://192.168.29.71:5000/api/order/${formData._id}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Order updated successfully!");
      fetchDispatched(); // Refresh orders after update
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
          allowedStatuses = [ORDER_STATUS.DELIVERED]; 
      default:
          allowedStatuses = [];
  }

  
  return [currentStatus, ...allowedStatuses].filter(Boolean);
}

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
        ORDER_STATUS={ORDER_STATUS}
        getNextAllowedStatuses={getNextAllowedStatuses}
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
//     const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/dispatche/${getregion}`)
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

//       await axios.put(`http://192.168.29.71:5000/api/order/${formData._id}`, formDataToSend, {
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