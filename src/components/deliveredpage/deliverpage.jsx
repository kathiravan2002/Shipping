import React, { useState, useEffect, } from 'react'
import Delivered from "../../shared/components/Delivered";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Apiendpoint from "../../shared/services/Apiendpoint"

function Deliverpage() {

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
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

  return (
    <div>
      <Delivered orders={orders} navigate={navigate} />
    </div>
  )
}

export default Deliverpage;