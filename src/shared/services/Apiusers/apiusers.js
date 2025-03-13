import axios from "axios";
import apiurl from "../Apiendpoint/Apiendpoint";


const apigetUser = async()=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.get(`${apiurl()}/api/add/getuser`, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }

 export { apigetUser };