import React, { useState, useEffect, } from 'react'
import Delivered from "../../shared/components/Delivered";
import axios from 'axios';

function Deliverpage() {

  const [orders, setOrders] = useState([]);
  
  const Userrole = localStorage.getItem("role");
  const deliverregion = Userrole === "admin" ? "admin" :  localStorage.getItem("Region");
    if (!deliverregion) {
        console.error("No deliver region found ");
        return;
    }
    console.log(deliverregion);

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(`http://192.168.29.12:5000/api/order/orders/delivered/${deliverregion}`);
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
      <Delivered orders={orders} />
    </div>
  )
}

export default Deliverpage;