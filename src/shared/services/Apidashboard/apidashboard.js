import axios from "axios";
import apiurl from "../Apiendpoint/Apiendpoint";


const userRole = localStorage.getItem("role");
const getregion =
  userRole === "admin" ? "admin" : localStorage.getItem("Region");

const apigetTotalOrders = async()=>{
    var res = await axios.get(`${apiurl()}/api/order/total/${getregion}`,{ headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`,},});
    return res.data;
 }


 const apitoday = async()=>{
    var res = await axios.get(`${apiurl()}/api/order/orders/today/${getregion}`);
    return res.data;
 }

 const apigetuser = async()=>{
    var res = await axios.get(
        `${apiurl()}/api/add/getuser`, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`,  },} );
    return res.data;
 }

 const totaldispatch = async()=>{
    var res = await axios.get(`${apiurl()}/api/order/orders/dispatche/${getregion}`);
    return res.data;
 }

 const apiout = async()=>{
    var res = await axios.get(`${apiurl()}/api/order/orders/out/${getregion}`);
    return res.data;
 }


 const totaldelivered = async()=>{
    var res = await axios.get(`${apiurl()}/api/order/orders/delivered/${getregion}`);
    return res.data;
 }

 const totalpending = async()=>{
    var res = await axios.get(
        `${apiurl()}/api/order/pending/${getregion}`
      );
    return res.data;
 }


 export { apigetTotalOrders,apitoday ,apiout,apigetuser,totaldispatch,totaldelivered,totalpending};