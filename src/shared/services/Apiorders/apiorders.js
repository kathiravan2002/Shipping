import axios from "axios";
import apiurl from "../Apiendpoint";

export const apigetRegionFilter = async () => {
  const token = localStorage.getItem("authToken");
  const UserRole = localStorage.getItem("role");
  const getregion =
    UserRole === "admin" ? "admin" : localStorage.getItem("Region");

  var res = await axios.get(
    `${apiurl()}/api/order/orders/filter?region=${getregion}&getFilterOptions=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const apimyorderRegionfilter = async () => {
  const token = localStorage.getItem("authToken");
  const UserRole = localStorage.getItem("role");
  const getregion =
    UserRole === "admin" ? "admin" : localStorage.getItem("Region");

  var res = await axios.get(
    `${apiurl()}/api/order/myorders/filter?region=${getregion}&getFilterOptions=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
