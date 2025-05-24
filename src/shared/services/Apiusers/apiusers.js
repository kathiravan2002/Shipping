import axios from "axios";
import apiurl from "../Apiendpoint";


const  apigetFilter = async()=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.get(`${apiurl()}/api/add/get/filter`, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }


 const apigetglobalFilter = async(queryParams)=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.get(`${apiurl()}/api/add/getuser?${queryParams.toString()}`, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }

 const apiupdateusers = async(userForm)=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.put(`${apiurl()}/api/add/${userForm._id}`, userForm, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }

 const apiaddusers = async(userForm)=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.post(`${apiurl()}/api/add/adduser`, userForm, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }

 const apigetUser = async()=>{
    const token = localStorage.getItem("authToken");
    var res = await axios.get(`${apiurl()}/api/add/getuser`, { headers: { "Authorization": `Bearer ${token}`},});
    return res.data;
 }


 export {apigetFilter,apigetglobalFilter,apiupdateusers,apiaddusers,apigetUser};