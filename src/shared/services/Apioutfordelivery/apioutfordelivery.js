import axios from "axios";
import apiurl from "../Apiendpoint";

const userRole = localStorage.getItem("role");
const outRegion =
  userRole === "admin" ? "admin" : localStorage.getItem("Region");

const UserRole = localStorage.getItem("role");
const getregion =
  UserRole === "admin" ? "admin" : localStorage.getItem("Region");


export const apiout = async(outRegion)=>{
   const token = localStorage.getItem("authToken");
   var res = await axios.get(`${apiurl()}/api/order/orders/out/${outRegion}`, { headers: { "Authorization": `Bearer ${token}`},});
   return res.data;
}

export const apidelivered = async(getregion)=>{
   const token = localStorage.getItem("authToken");
   var res = await axios.get(`${apiurl()}/api/order/orders/delivered/${getregion}`, { headers: { "Authorization": `Bearer ${token}`},});
   return res.data;
}

export const apioutupdate = async(formData,formDataToSend)=>{
   const token = localStorage.getItem("authToken");
   var res = await axios.put(`${apiurl()}/api/order/consignee/${formData.cid}`,formDataToSend, { headers: { "Authorization": `Bearer ${token}`},});
   return res.data;
}