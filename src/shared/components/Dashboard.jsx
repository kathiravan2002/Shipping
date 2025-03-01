import React from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp, Package, Users, Truck, CheckCircle, Clock } from "lucide-react";

function Dashboard(props) {
  const {
    pending,
    totalorder,
    multipleConsignee,
    singleConsignee,
    todayorder,
    totaluser,
    dispatch,
    orders,
    out,
    orderData,
    COLORS,
    navigate
  } = props;

  return (
    <div className="bg-gray-100 p-3 rounded-md">
       <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="mr-2 text-violet-600" /> Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">Order and User Statistics</p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Add Order Card */}
        <div className="bg-gradient-to-tr from-purple-400 to-violet-600 rounded-xl p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <button
            onClick={() => navigate("/Addorder")}
            className="flex items-center justify-center w-full h-full text-white font-bold text-lg hover:text-blue-100 transition-colors"
          >
            <Plus className="mr-2" /> Add New Order
          </button>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow">
          <div className="flex items-center">
              <Package className="text-violet-600 mr-3" size={26} />
              <div>
                <h3 className="text-gray-600  font-semibold  text-sm  uppercase">Total Orders</h3>
                <p className="text-4xl font-extrabold text-gray-800 mt-1">{totalorder}</p>
                <div className="mt-3 text-sm">
                  <span className="text-gray-600">Single: </span>
                  <span className="font-medium text-gray-800">{singleConsignee}</span>
                  <span className="text-gray-600 ml-2">Multiple: </span>
                  <span className="font-medium text-gray-800">{multipleConsignee}</span>
                </div>
              </div>
            </div>
        </div>

        {/* Today's Orders Card */}
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-center mt-2">
              <Clock className="text-violet-600 mr-3" size={26} />
              <div>
                <h3 className="text-gray-600 text-sm font-semibold uppercase">Today’s Orders</h3>
                <p className="text-4xl font-extrabold text-gray-800 mt-1">{todayorder.length || 0}</p>
              </div>
            </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-center mt-2">
              <Users className="text-violet-600 mr-3" size={26} />
              <div>
                <h3 className="text-gray-600 text-sm font-semibold uppercase">Total Users</h3>
                <p className="text-4xl font-extrabold text-gray-800 mt-1">{totaluser.length || 0}</p>
              </div>
            </div>
        </div>

        {/* Dispatched Card */}
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-center mt-2 m-2">
              <Truck className="text-violet-600 mr-3" size={26} />
              <div>
                <h3 className="text-gray-600 text-sm font-semibold uppercase">Dispatched</h3>
                <p className="text-4xl font-extrabold text-gray-800 mt-1">{dispatch.length || 0}</p>
              </div>
            </div>
        </div>
 
        {/* Out for Delivery Card */}
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-center mt-2 m-2">
              <Truck className="text-violet-600 mr-3" size={26} />
              <div>
                <h3 className="text-gray-600 text-sm font-semibold uppercase">Out for Delivery</h3>
                <p className="text-4xl font-extrabold text-gray-800 mt-1">{out.length || 0}</p>
              </div>
            </div>
        </div>

        {/* Delivered Card */}
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-center mt-2 m-2">
              <CheckCircle className="text-violet-600 mr-3" size={26} />
              <div>
                <h3 className="text-gray-600 text-sm font-semibold uppercase">Delivered</h3>
                <p className="text-4xl font-extrabold text-gray-800 mt-1">{orders.length || 0}</p>
              </div>
            </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-center mt-2 m-2">
              <Clock className="text-violet-600 mr-3" size={26} />
              <div>
                <h3 className="text-gray-600 text-sm font-semibold uppercase">Pending</h3>
                <p className="text-4xl font-extrabold text-gray-800 mt-1">{pending.length || 0}</p>
              </div>
            </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-xl shadow-md p-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pie Chart */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Distribution</h2>
            <PieChart width={400} height={400}>
              <Pie
                data={orderData}
                cx={200}
                cy={180}
                innerRadius={60}
                outerRadius={140}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
              >
                {orderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip  contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}/>
              <Legend wrapperStyle={{ paddingTop: "10px" }}/>
            </PieChart>
          </div>

          {/* Bar Chart */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Statistics</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip  contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}/>
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="value" fill="#8135e6" radius={[4, 4, 0, 0]} barSize={50}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;