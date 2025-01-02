
import React, { useEffect, useState } from 'react'
import axios from "axios";

function Dashboard() {
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
    
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    
    const todaysOrders = order?.filter(o => o.createdAt?.startsWith(today)).length || 0;
    const yesterdaysOrders = order?.filter(o => o.createdAt?.startsWith(yesterdayDate)).length || 0;
    

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 p-2 max-w-full lg:grid-cols-3">
        {/* <!-- Today's Orders Section --> */}
        <div className="bg-purple-100 rounded-lg p-4  shadow-md">
          <div className="flex items-center">
            <div className="bg-purple-300 p-3 rounded-full"></div>
            <div className="sm:mr-4 lg:ml-52">
              <h3 className="text-gray-600 font-semibold">Today's Orders</h3>
              <p className="text-2xl font-bold text-gray-900">
                {order.length || 0}
                {/* Display total orders or 0 if the array is undefined */}
              </p>
              <p className="text-sm text-gray-500">Yesterday</p>
              <p className="text-2xl text-gray-900">0</p>
            </div>
          </div>
        </div>

        {/* <!-- Shipment Details Section --> */}
        <div className="bg-purple-100 rounded-lg p-4  shadow-md  col-span-2 ">
          <h3 className="text-gray-600 font-semibold mb-4 lg:ml-96  md:ml-80">
            Shipment Details
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <div className="text-center bg-white rounded-lg px-0.5 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Total Shipments</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Pickup Pending</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">In-Transit</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Delivered</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">NDR Pending</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">RTO</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 p-2 max-w-full lg:grid-cols-3">
        {/* <!-- Today revenue Section --> */}
        <div className="bg-green-100 rounded-lg p-4  shadow-md">
          <div className="flex items-center">
            <div className="bg-green-300 p-3 rounded-full"></div>
            <div className="sm:mr-4 lg:ml-52">
              <h3 className="text-gray-600 font-semibold">Today revenue</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Yesterday</p>
              <p className="text-2  text-gray-900">0</p>
            </div>
          </div>
        </div>

        {/* <!-- NDR Details Section --> */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-md col-span-2 ">
          <h3 className="text-gray-600 font-semibold mb-4 lg:ml-96  md:ml-80 ">
            NDR Details
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Total NDR</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Your attempt request</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Buyer Reattempt request</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">NDR Deliverables</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 p-2 max-w-full lg:grid-cols-3">
        {/* <!-- Today revenue Section --> */}
        <div className="bg-purple-100 rounded-lg p-4  shadow-md">
          <div className="flex items-center">
            <div className="bg-purple-300 p-3 rounded-full"></div>
            <div className="sm:mr-4 lg:ml-44 mt-11">
              <h3 className="text-gray-600 font-semibold">
                Average shipping cost
              </h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        {/* <!-- NDR Details Section --> */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-md col-span-2">
          <h3 className="text-gray-600 font-semibold mb-4 lg:ml-96  md:ml-80">
            NDR Details
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Total NDR</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Your attempt request</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Buyer Reattempt request</p>
            </div>
            <div className="text-center bg-white rounded-lg p-2 shadow">
              <p className="text-lg font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">NDR Deliverables</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 p-2 max-w-full lg:grid-cols-3">
        {/* <!-- Today revenue Section --> */}
        <div className="bg-purple-100 rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <div className="bg-purple-300 p-3 rounded-full"></div>
            <div className="sm:mr-4 mt-44 lg:ml-52">
              <h3 className="text-gray-600 font-semibold">Today </h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        {/* <!-- NDR Details Section --> */}
        <div className="bg-purple-100 rounded-lg p-4 shadow-md">
          <h3 className="text-gray-600 font-semibold mb-4 mr-96"></h3>
        </div>
        <div className="bg-purple-100 rounded-lg p-4 shadow-md">
          <h3 className="text-gray-600 font-semibold mb-4 mr-96"></h3>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
