import React from 'react';

const Delivered = ({orders,navigate}) => {
return (
    <div>
      <h1 className="text-2xl font-bold mb-4 sm:mt-0 mt-4 ">
        {/* <button onClick={() => navigate("/outfordelivery")} className='border text-white bg-purple-600 rounded-md px-3'>{"< "}</button> */}
         Delivered Orders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(orders) && orders.length > 0 ?(
        orders.map((order, index) => (
          <div key={index} className="border rounded-lg shadow p-4 bg-white">
           <div className='flex '>
           <CheckCircle className="text-green-600 mr-3" size={22} /> 
            <h2 className="text-lg font-semibold">Consignee ID : {order.cid}</h2>
            </div> 
            <hr />
            <p>Consignee Name : {order.Consigneename}</p>
            <p>Consignee Mobile no : {order.consigneemobileno}</p>
            <p>Consignee Alternate Mobile no : {order.consigneealterno}</p>
            <p>Consignee Address : {order.consigneeaddress}</p>
            <p>Consignee Pincode : {order.consigneepin}</p>
            <p>Status :<span className="text-green-500 text-lg">{order.cstatus} </span></p>
            <img src={`http://192.168.29.12:5000${order.productImage}`} className="w-auto h-32" />
          </div>
        ))
      ) : (
        <p>No delivered orders found.</p>
      )}
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

