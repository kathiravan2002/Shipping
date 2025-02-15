import React , { useState, useEffect, } from 'react'
import Delivered from "../../shared/components/Delivered";
import axios from 'axios';

export function Deliverpage() {

  const [orders, setOrders] = useState([]);

  const UserRole = localStorage.getItem("role");
  const getregion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

  // Fetch Delivered Orders
  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/delivered/${getregion}`);
      setOrders(response.data);
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

      <Delivered  orders={orders}/>

      </div>
  )
}

