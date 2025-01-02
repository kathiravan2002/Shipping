import React, { useEffect, useState } from 'react'
import Orderheader from '../../shared/components/Orderheader'
import axios from 'axios';


function Orderpage() {
  const [order,setOrder] = useState([]);
  
  const getAllorder = async () => {
    try {
      const response =await axios.get("http://192.168.29.11:5000/api/order/getorder");
      console.log(response.data)
      setOrder( response.data || []);
      console.log(order);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrder([]); 
    }
    
};

    useEffect(() => {
    getAllorder();
    },[]);

    
    const deleteOrder = async ({ _id }) => {
      if (window.confirm("Are you sure you want to delete this order?")) {
        try {
          await axios.delete(`http://192.168.29.11:5000/api/order/${_id}`);
          getAllorder();
          console.log("Order deleted successfully");
        } catch (error) {
          console.error("Error deleting order:", error);
        }
      }
    };
    
  return (
    <div>
      <Orderheader order={order}  deleteOrder={deleteOrder} setOrder={setOrder} />
    </div>
  );
}
  
export default Orderpage;
