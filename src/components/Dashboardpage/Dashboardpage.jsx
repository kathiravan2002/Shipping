
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Spinner from "../../shared/components/Spinner"
import Dashboard from "../../shared/components/Dashboard";

export default function Dashboardpage() {

  const [totalorder, settotalorder] = useState([]);
  const [todayorder, settodayorder] = useState([])
  const [totaluser, SetTotaluser] = useState([]);
  const [dispatch, setDispatch] = useState([]);
  const [orders, setOrders] = useState([]);
  const[pending,setPending]=useState([]);
  const navigate = useNavigate();
  const [out, setOut] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("role")
  const getregion = userRole === "admin" ? "admin" : localStorage.getItem("Region");
  const getAllorder = async () => {
    try {
      const response = await axios.get(`http://192.168.29.71:5000/api/order/total/${getregion}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      console.log(response.data.total)
      settotalorder(response.data.total || []);

    } catch (error) {
      console.error("Error fetching orders:", error);
      settotalorder([]);
    }
  };

  useEffect(() => {
    getAllorder();
  }, [getregion]);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/today/${getregion}`);
        //  const data = await response.json();
        settodayorder(response.data.today || []);
      } catch (error) {
        console.error("Error fetching today's orders:", error);
      }
      const timer = setTimeout(() => {
        setLoading(false);
      }, 400);

      return () => clearTimeout(timer);
    };

    fetchOrders();
  }, [getregion]);

  const getuser = async () => {
    try {
      const userdata = await axios.get("http://192.168.29.71:5000/api/add/getuser", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      console.log(userdata.data);
      SetTotaluser(userdata.data || []);
    }
    catch (error) {
      console.log("Error fetching user data", error);
    }
  };
  useEffect(() => {
    getuser();
  }, []);


  const fetchdispatched = async () => {
    const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/dispatche/${getregion}`)
    setDispatch(response.data);

  }

  useEffect(() => {
    fetchdispatched();
  }, []);

  const fetchout = async () => {
    const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/out/${getregion}`)
    setOut(response.data);

  }

  useEffect(() => {
    fetchout();
  }, []);

  const fetchDeliveredOrders = async () => {

    const response = await axios.get(`http://192.168.29.71:5000/api/order/orders/delivered/${getregion}`);
    setOrders(response.data);

  };

  useEffect(() => {
    fetchDeliveredOrders();

  }, []);

  const fetchPendingOrders = async () => {

   const response = await axios.get(`http://192.168.29.71:5000/api/order/pending/${getregion}`);
   setPending(response.data)

  };


  useEffect(() => {
    fetchPendingOrders();
  },[]);

  if (loading) return <Spinner />;

  const orderData = [
    { name: 'Total Orders', value: Number(totalorder) || 0 },
    // { name: 'Today Orders', value: Number(todayorder.length) || 0 },
    { name: 'Total Dispatched', value: Number(dispatch.length) || 0 },
    { name: 'Total Out for Delivery', value: Number(out.length) || 0 },
    { name: 'Total Delivered', value: Number(orders.length) || 0 },
  ].filter(item => item.value > 0);


  const COLORS = ['#8884d8', '#82ca9d', "#cea193", "#ff5733", "#baa6b1"];
  return (

    <>
      <Dashboard pending={pending} totalorder={totalorder}  todayorder={todayorder} totaluser={totaluser} dispatch={dispatch} orders={orders} out={out} orderData={orderData} COLORS={COLORS} navigate={navigate}/>
    </>
  )
}
