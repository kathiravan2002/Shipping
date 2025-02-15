import React from 'react';


const Delivered = ({orders}) => {
 
 

   return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Delivered Orders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(orders) && orders.length > 0 ?(
        orders.map((order, index) => (
          <div key={index} className="border rounded-lg shadow p-4 bg-white">
            <h2 className="text-lg font-semibold">Order ID: {order.orderId}</h2>
            <hr />
            <p>Customer: {order.Consigneename}</p>
            <p>Consignee Mobile no: {order.consigneemobileno}</p>
            <p>Consignee Alternate Mobile no: {order.consigneealterno}</p>
            <p>Consignee Address: {order.consigneeaddress}</p>
            <p>Consignee Pincode: {order.consigneepin}</p>
            <p>Status: <span className="text-green-500">{order.Orderstatus}</span></p>
            <img src={`http://192.168.29.12:5000${order.deliveryimage}`} className='w-auto h-32  ' />


          </div>
        ))
      ) : (
        <p>No delivered orders found.</p>
      )}
      </div>
    </div>
  );
};

export default Delivered;

