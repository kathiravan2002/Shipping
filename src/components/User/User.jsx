
import { useState, useEffect } from "react";
import Userpage from "../../shared/components/Userpage";
import { useNavigate } from "react-router-dom";
import { apigetUser } from "../../shared/services/Apiusers/apiusers";

function User() {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const getuser = async () => {
    try {
      const userdata = await apigetUser();
      // console.log("User data:", userdata);
      setUser(userdata || []);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setUser([]);
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  const handleRoleChange = (event) => {
    const selected = event.target.value;
    setSelectedRole(selected);

    if (selected === "") {
      setFilteredUsers(user);
    } else {
      setFilteredUsers(
        user.filter((u) => u.role === selected || u.status === selected)
      );
    }
  };

  useEffect(() => {
    setFilteredUsers(user);
  }, [user]);

  return (
    <div>
      <Userpage 
        filteredUsers={filteredUsers} 
        selectedRole={selectedRole} 
        navigate={navigate} 
        handleRoleChange={handleRoleChange} 
        refreshUsers={getuser} // Added to refresh user list
      />
    </div>
  );
}

export default User;
// import React, { useEffect, useState } from 'react'
// import Userpage from '../../shared/components/Userpage'
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Apiendpoint from '../../shared/services/Apiendpoint';

// function User() {

//   const [user,setUser]= useState([]);
//   const navigate = useNavigate();
//   const edituser = ({ _id }) => {
//       navigate(`/Adduser/${_id}`); 
//     };
 
// const getuser =async() =>{
//   try{
//       const userdata = await axios.get(`${Apiendpoint}/api/add/getuser`,{
//         headers : {
//            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//         }
//   });
//       console.log(userdata.data);
//       setUser(userdata.data || []);
//   }
//   catch(error){
//       console.log("Error fetching user data",error);
//   }
// };
//  useEffect(()=>{
//   getuser();
//  },[]);

//   return (
//     <div><Userpage user={user} edituser={edituser} navigate={navigate}/></div>
//   )
// }

// export default User;