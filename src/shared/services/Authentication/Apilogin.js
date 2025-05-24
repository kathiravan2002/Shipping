import axios from "axios";
import apiurl from "../Apiendpoint";



const apilogin = async(data)=>{
    var res = await axios.post(`${apiurl()}/api/login/user`,data);
    return res.data;
 }


 const apigetName = async()=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.get(`${apiurl()}/api/add/login/getname`, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }

 

 export { apilogin, apigetName };