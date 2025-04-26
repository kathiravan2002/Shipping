import { useState, useEffect } from 'react';
import Outfordelivery from '../../shared/components/Outfordelivery';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {apidelivery, apiout, apiupdateout} from '../../shared/services/Apioutdelivery/apioutdelivery.js'


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



  const fetchOut = async () => {
    try {
      const response = await apiout()
      setOut(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching Out for Delivery orders:", error);
      setOut([]);
    }
  };

  useEffect(() => {
    fetchOut();
  }, []);


  const fetchDeliveredOrders = async () => {
    try {
      const response = await apidelivery()
      setOrders(response);
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
      formDataToSend.append("cstatus", formData.cstatus);
  
      if (formData.productImage) {
        formDataToSend.append("productImage", formData.productImage);
      }
  
      console.log("Updating with cid:", formData.cid); // Debug log
      const response = await apiupdateout(formData, formDataToSend);
  
      toast.success("Consignee status updated successfully!");
      await fetchOut(); // Refresh orders after update
      setVisible(false);
    } catch (error) {
      console.error("Error updating consignee status:", error.response || error.message);
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