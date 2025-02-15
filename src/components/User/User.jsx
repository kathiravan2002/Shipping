import React, { useEffect, useState } from 'react'
import Userpage from '../../shared/components/Userpage'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function User() {

  const [user,setUser]= useState([]);
  const navigate = useNavigate();
  const edituser = ({ _id }) => {
      navigate(`/Adduser/${_id}`); 
    };
 
const getuser =async() =>{
  try{
      const userdata = await axios.get("http://192.168.29.71:5000/api/add/getuser",{
        headers : {
           "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
  });
      console.log(userdata.data);
      setUser(userdata.data || []);
  }
  catch(error){
      console.log("Error fetching user data",error);
  }
};
 useEffect(()=>{
  getuser();
 },[]);

  return (
    <div><Userpage user={user} edituser={edituser} navigate={navigate}/></div>
  )
}

export default User;