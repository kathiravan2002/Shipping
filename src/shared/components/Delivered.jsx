import React from 'react';

const Delivered = ({orders,navigate}) => {
return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Delivered Orders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {orders.map((order, index) => (
          <div key={index} className="border  border-violet-500 shadow-violet-700 rounded-lg shadow p-4 bg-white">
            <h2 className="text-lg font-semibold  bg-gray-200">Consignee ID: {order.cid}</h2>
            <hr />
            <p>Consignee Name: {order.Consigneename}</p>
            <p>Consignee Mobile no: {order.consigneemobileno}</p>
            {/* <p>Consignee Alternate Mobile no: {order.consigneealterno}</p> */}
            <p>Consignee District: {order.consigneeedistrict}</p>
            <p>Consignee Pincode: {order.consigneepin}</p>
            <p>Status: <span className="text-green-500">{order.cstatus}</span></p>
            <img src={`${apiurl()}${order.productImage}`} className='w-auto h-32  ' />


          </div>
        ))}
      </div>
      <button
        onClick={() =>navigate("/outfordelivery")}
         className="mt-3 px-5 py-2 hover:bg-purple-500 bg-gradient-to-r from-purple-600 to-green-500 text-white font-semibold rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-400"

      >
        Back
      </button>
    </div>
  );
};

export default Delivered;

