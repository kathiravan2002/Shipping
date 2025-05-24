import axios from "axios";
import apiurl from "../Apiendpoint";

const userRole = localStorage.getItem("role");
const getregion =
  userRole === "admin" ? "admin" : localStorage.getItem("Region");


export const apigetTotalOrders = async(getregion)=>{
    var res = await axios.get(`${apiurl()}/api/order/total/${getregion}`,{ headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`,},});
    return res.data;
 }


export const apitodayOrders = async(getregion)=>{
    var res = await axios.get(`${apiurl()}/api/order/orders/today/${getregion}`);
    return res.data;
}

export const apitotaluser = async()=>{
    var res = await axios.get(`${apiurl()}/api/add/getuser`,{ headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`,},});
    return res.data;
}

export const totalDispatched = async(getregion)=>{
    var res = await axios.get(`${apiurl()}/api/order/orders/dispatche/${getregion}`);
    return res.data;
}

export const totaloutfordelivery = async(getregion)=>{
    var res = await axios.get(`${apiurl()}/api/order/orders/out/${getregion}`);
    return res.data;
}

export const totalDelivered = async(getregion)=>{
    var res = await axios.get(`${apiurl()}/api/order/orders/delivered/${getregion}`);
    return res.data;
}

export const totalPending = async(getregion)=>{
    var res = await axios.get(`${apiurl()}/api/order/pending/${getregion}`);
    return res.data;
}