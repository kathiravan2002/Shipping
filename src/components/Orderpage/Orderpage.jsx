import React, { useEffect, useState } from 'react'
import Orderheader from '../../shared/components/Orderheader'
import axios from 'axios';


function Orderpage() {
  const [order,setOrder] = useState([]);
  
  const getAllorder = async () => {
    try {
      const response =await axios.get("http://192.168.29.11:5000/api/order/getorder",{
        headers : {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
       }
      });
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
    
    const downloadinvoice = async (_id, data) => {
      if (!_id || typeof _id !== 'string' || _id.length !== 24) {
        console.error('Invalid ID passed to downloadInvoice');
        return;
      }
    
      try {
        const response = await axios.post(
          `http://192.168.29.11:5000/api/invoices/generate-invoice/${_id}`,
          data,
          { responseType: 'blob' }
        );
        console.log(response.data)
    
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${_id}.pdf`);  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading the invoice:', error);
      }
    };
    
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
      <Orderheader order={order}  deleteOrder={deleteOrder} setOrder={setOrder}  downloadinvoice={downloadinvoice}/>
    </div>
  );
}
  
export default Orderpage;
