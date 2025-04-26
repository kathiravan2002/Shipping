import axios from "axios";
import apiurl from "../Apiendpoint/Apiendpoint";


const apigetdispatch = async(getRegion,queryParams)=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.get(`${apiurl()}/api/order//filter/dispatched/${getRegion}${queryParams ? `?${queryParams}` : ''}`, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }


 const apiupdatedispatch = async(formData,formDataToSend)=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.put(`${apiurl()}/api/order/consignee/${formData.cid}`,formDataToSend, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }

 export { apigetdispatch, apiupdatedispatch };