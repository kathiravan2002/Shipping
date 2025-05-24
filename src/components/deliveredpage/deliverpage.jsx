import React , { useState, useEffect, } from 'react'
import Delivered from "../../shared/components/Delivered";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiurl from '../../shared/services/Apiendpoint';

export function Deliverpage() {

  const [orders, setOrders] = useState([]);

  const UserRole = localStorage.getItem("role");
  const getregion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");
  const navigate = useNavigate();

  // Fetch Delivered Orders
  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(`${apiurl()}/api/order/orders/delivered/${getregion}`);
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

      <Delivered  orders={orders} navigate={navigate}/>

      </div>
  )
}

