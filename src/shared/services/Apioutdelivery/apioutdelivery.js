import axios from "axios";
import apiurl from "../Apiendpoint/Apiendpoint";



const UserRole = localStorage.getItem("role");
const getregion = UserRole === "admin" ? "admin" : localStorage.getItem("Region");

const userRole = localStorage.getItem("role");
const outRegion = userRole === "admin" ? "admin" : localStorage.getItem("Region");

//   const apiout = async()=>{
//     var res = await axios.get(`${apiurl}/api/order/orders/out/${outRegion}`);
//     return res.data;
//  }


//  const apidelivery = async() => {
//     var res = await axios.get(`${apiurl}/api/order/orders/delivered/${getregion}`);
//     return res.data;
//  }


//  const apiupdateout = async() => {
//     var res = await axios.put(`${apiurl}/api/order/consignee/${formData.cid}`,formDataToSend,{ headers: { "Content-Type": "multipart/form-data" } });
//     return res.data;
//  }


const apiout = async()=>{
   const token = localStorage.getItem("authToken");
   var res = await axios.get(`${apiurl()}/api/order/orders/out/${outRegion}`, { headers: { "Authorization": `Bearer ${token}`},});
   return res.data;
}

const apidelivery = async()=>{
   const token = localStorage.getItem("authToken");
   var res = await axios.get(`${apiurl()}/api/order/orders/delivered/${getregion}`, { headers: { "Authorization": `Bearer ${token}`},});
   return res.data;
}

const apiupdateout = async(formData,formDataToSend)=>{
   const token = localStorage.getItem("authToken");
   var res = await axios.put(`${apiurl()}/api/order/consignee/${formData.cid}`,formDataToSend, { headers: { "Authorization": `Bearer ${token}`},});
   return res.data;
}




 export {apiout,apidelivery,apiupdateout};