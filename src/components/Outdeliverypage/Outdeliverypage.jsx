import React, { useState, useEffect } from 'react'
import Outfordelivery from '../../shared/components/Outfordelivery'
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';

function Outdeliverypage() {
  const { id } = useParams();
  const [out, setOut] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState([]);

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

    const userrole = localStorage.getItem("role");
    const outregion = userrole === "admin" ? "admin" : localStorage.getItem("Region");
    if (!outregion) {
        console.error("No Out for deliver region found ");
        return;
    }
    console.log(outregion);

    const fetchout = async () => {
        try{
            const response = await axios.get(`http://192.168.29.12:5000/api/order/orders/out/${outregion}`)
            setOut(Array.isArray(response.data) ? response.data : []);
        }
        catch(error){
            console.log("Error fetching Out of delivery Orders",error)
            setOut([]);
        }

    }

    useEffect(() => {
        fetchout();
    }, []);

    const updateOrder = async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("Orderstatus", formData.Orderstatus);
  
        if (formData.deliveryimage) {
          formDataToSend.append("deliveryimage", formData.deliveryimage);
        }
  
        await axios.put(`http://192.168.29.12:5000/api/order/${formData._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        toast.success("Order updated successfully!");
        fetchout(); // Refresh orders after update
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
      <Outfordelivery out={out} visible={visible} setVisible={setVisible} formData={formData} setFormData={setFormData} handleInputChange={handleInputChange} handleImageUpload={handleImageUpload} updateOrder={updateOrder}  ORDER_STATUS={ ORDER_STATUS} getNextAllowedStatuses={getNextAllowedStatuses} />
      </div>
  )
}

export default Outdeliverypage