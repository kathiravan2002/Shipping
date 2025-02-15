import React, { useState,useEffect } from "react";
import axios from "axios";
import Userpage from "../../shared/components/Userpage";
import { useNavigate } from "react-router-dom";
import Apiendpoint from "../../shared/services/Apiendpoint"



function User() {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const edituser = ({ _id }) => {
    navigate(`/Adduser/${_id}`);
  };

  const getuser = async () => {
    try {
      const userdata = await axios.get(`${Apiendpoint}/api/add/getuser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(userdata.data);
      setUser(userdata.data || []);
    } catch (error) {
      console.log("Error fetching user data", error);
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
      <Userpage filteredUsers={filteredUsers} selectedRole={selectedRole} navigate={navigate} edituser={edituser} handleRoleChange={handleRoleChange} />
    </div>
  );
}

export default User;
