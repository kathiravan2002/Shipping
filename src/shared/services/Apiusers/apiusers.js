import axios from "axios";
import apiurl from "../Apiendpoint/Apiendpoint";


const apigetUser = async(data)=>{
    var res = await axios.get(`${apiurl()}/api/add/getuser`,data, {headers: {Authorization: `Bearer ${localStorage.getItem("authToken")}`},});
    return res.data;
 }

 export { apigetUser };