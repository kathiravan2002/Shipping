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

  const Userrole = localStorage.getItem("role");
  const deliverregion = Userrole === "admin" ? "admin" : localStorage.getItem("Region");
  if (!deliverregion) {
    console.error("No deliver region found ");
    return;
  }
  console.log(deliverregion);

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(`${Apiendpoint}/api/order/orders/delivered/${deliverregion}`);
      setOrders(Array.isArray(response.data) ? response.data : []);
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
        navigate ={navigate}
        visible={visible}
        setVisible={setVisible}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        updateOrder={updateOrder}
        CONSIGNEE_STATUS={CONSIGNEE_STATUS}
        getNextAllowedStatuses={getNextAllowedStatuses}
        orders={orders}
      />
    </div>
  );
}
export default Outdeliverypage;