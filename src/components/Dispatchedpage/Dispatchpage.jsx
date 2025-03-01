import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Dispatched from "../../shared/components/Dispatched";
import { toast } from "react-toastify";
import Apiendpoint from "../../shared/services/Apiendpoint";

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

  const fetchDispatched = async () => {
    try {
      const response = await axios.get(
        `${Apiendpoint}/api/order/orders/dispatche/${getRegion}`
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
      formDataToSend.append("cstatus", formData.cstatus);

      if (formData.productImage) {
        formDataToSend.append("productImage", formData.productImage);
      }

      console.log("Updating with cid:", formData.cid); // Debug log
      const response = await axios.put(
        `${Apiendpoint}/api/order/consignee/${formData.cid}`, // Updated endpoint
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Consignee status updated successfully!");
      await fetchDispatched();
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
      />
    </div>
  );
}

export default Dispatchpage;