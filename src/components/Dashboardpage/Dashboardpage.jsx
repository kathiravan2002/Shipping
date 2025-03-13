import { useEffect, useState } from "react";
import Dashboard from "../../shared/components/Dashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../../shared/components/Spinner";
import  {apigetTotalOrders,totalpending,totaldelivered,totaldispatch,apigetuser,apitoday,apiout}from "../../shared/services/Apidashboard/apidashboard.js"

export default function Dashboardpage() {
  const [totalorder, setTotalorder] = useState(0);
  const [singleConsignee, setSingleConsignee] = useState(0);
  const [multipleConsignee, setMultipleConsignee] = useState(0);
  //for orders
  // const [allOrders, setAllOrders] = useState([]);
  // const [singleConsigneeOrders, setSingleConsigneeOrders] = useState([]);
  // const [multipleConsigneeOrders, setMultipleConsigneeOrders] = useState([]);
  const [todayorder, setTodayorder] = useState([]);
  const [totaluser, setTotaluser] = useState([]);
  const [dispatch, setDispatch] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pending, setPending] = useState([]);
  const navigate = useNavigate();
  const [out, setOut] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem("role");
  const getregion =
    userRole === "admin" ? "admin" : localStorage.getItem("Region");

  const getTotalOrders = async () => {
    try {
      const data = await apigetTotalOrders();
      setTotalorder(data.total.count);
      setSingleConsignee(data.singleConsignee.count);
      setMultipleConsignee(data.multipleConsignee.count);

      // setAllOrders(response.data.total.orders);
      // setSingleConsigneeOrders(response.data.singleConsignee.orders);
      // setMultipleConsigneeOrders(response.data.multipleConsignee.orders);
    } catch (error) {
      console.error("Error fetching total orders:", error);
      setTotalorder(0);
      setSingleConsignee(0);
      setMultipleConsignee(0);
    }
  };

  useEffect(() => {
    getTotalOrders();
  }, [getregion]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apitoday();
        setTodayorder(data.today);
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
      const data = await apigetuser();
      // console.log(userdata.data);
      setTotaluser(data || []);
    } catch (error) {
      console.log("Error fetching user data", error);
    }
  };
  useEffect(() => {
    getuser();
  }, []);

  const fetchdispatched = async () => {
    const data = await totaldispatch();
    setDispatch(data);
  };

  useEffect(() => {
    fetchdispatched();
  }, []);

  const fetchout = async () => {
    const data = await apiout();
    setOut(data);
  };

  useEffect(() => {
    fetchout();
  }, []);

  const fetchDeliveredOrders = async () => {
    const data = await totaldelivered();
    setOrders(data);
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchPendingOrders = async () => {
    const data = await totalpending();
    setPending(data);
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  if (loading) return <Spinner />;

  const orderData = [
    { name: "Total Orders", value: Number(totalorder) || 0 },
    { name: "Today Orders", value: Number(todayorder?.length) || 0 },
    { name: "Total Dispatched", value: Number(dispatch.length) || 0 },
    { name: "Total Out for Delivery", value: Number(out.length) || 0 },
    { name: "Total Delivered", value: Number(orders.length) || 0 },
  ].filter((item) => item.value > 0);

  const COLORS = ["#8884d8", "#82ca9d", "#cea193", "#ff5733", "#baa6b1"];

  return (
    <>
      <Dashboard
        pending={pending}
        totalorder={totalorder}
        multipleConsignee= {multipleConsignee}
        singleConsignee= {singleConsignee}
        todayorder={todayorder}
        totaluser={totaluser}
        dispatch={dispatch}
        orders={orders}
        out={out}
        loading={loading}
        orderData={orderData}
        COLORS={COLORS}
        navigate={navigate}
      />
    </>
  );
}
