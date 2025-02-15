import React from 'react';

const Delivered = ({orders}) => {
return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Delivered Orders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {orders.map((order, index) => (
          <div key={index} className="border  border-violet-500 shadow-violet-700 rounded-lg shadow p-4 bg-white">
            <h2 className="text-lg font-semibold  bg-gray-200">Order ID: {order.orderId}</h2>
            <hr />
            <p>Customer: {order.Consigneename}</p>
            <p>Consignee Mobile no: {order.consigneemobileno}</p>
            <p>Consignee Alternate Mobile no: {order.consigneealterno}</p>
            <p>Consignee District: {order.consigneeedistrict}</p>
            <p>Consignee Pincode: {order.consigneepin}</p>
            <p>Status: <span className="text-green-500">{order.Orderstatus}</span></p>
            <img src={`http://192.168.29.71:5000${order.deliveryimage}`} className='w-auto h-32  ' />


          </div>
        ))}
      </div>
    </div>
  );
};

export default Delivered;

