import axios from "axios";
import apiurl from "../Apiendpoint/Apiendpoint";


const apigetRegionFilter = async(getregion)=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.get(`${apiurl()}/api/order/orders/filter?region=${getregion}&getFilterOptions=true`, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }

 const apideleteOrder = async(_id)=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.delete(`${apiurl()}/api/order/${_id}`, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }


 export { apigetRegionFilter, apideleteOrder };