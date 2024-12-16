import React, { useEffect, useState } from 'react'
import Orderheader from '../../shared/components/Orderheader'
import axios from 'axios';


function Orderpage() {
  const [order,setorder] = useState([]);
  
  const getAllorder = async () => {
    try {
      const response =await axios.get("http://192.168.29.11:5000/api/order/getorder");
      console.log(response.data)
      setorder( response.data || []);
      console.log(order);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setorder([]); 
    }
    
};

    useEffect(() => {
      getAllorder();
    },[]);


  return (
    <div>
      <Orderheader order={order} />
    </div>
  );
}

export default Orderpage;
