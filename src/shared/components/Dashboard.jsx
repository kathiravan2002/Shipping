/* eslint-disable react/prop-types */
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
    <div className="p-3 bg-gray-100 rounded-md">
       <div className="mb-2">
        <h1 className="flex items-center text-2xl font-bold text-gray-800">
          <TrendingUp className="mr-2 text-violet-600" /> Dashboard Overview
        </h1>
        <p className="mt-1 text-gray-500">Order and User Statistics</p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Add Order Card */}
        <div className="p-6 transition-all duration-300 transform shadow-lg bg-gradient-to-tr from-purple-400 to-violet-600 rounded-xl hover:-translate-y-1">
          <button
            onClick={() => navigate("/Addorder")}
            className="flex items-center justify-center w-full h-full text-lg font-bold text-white transition-colors hover:text-blue-100"
          >
            <Plus className="mr-2" /> Add New Order
          </button>
        </div>

        {/* Total Orders Card */}
        <div className="p-4 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl">
          <div className="flex items-center">
              <Package className="mr-3 text-violet-600" size={26} />
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Orders</h3>
                <p className="mt-1 text-4xl font-extrabold text-gray-800">{totalorder}</p>
                <div className="mt-3 text-sm">
                  <span className="text-gray-600">Single: </span>
                  <span className="font-medium text-gray-800">{singleConsignee}</span>
                  <span className="ml-2 text-gray-600">Multiple: </span>
                  <span className="font-medium text-gray-800">{multipleConsignee}</span>
                </div>
              </div>
            </div>
        </div>

        {/* Today's Orders Card */}
        <div className="p-4 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl">
        <div className="flex items-center mt-2">
              <Clock className="mr-3 text-violet-600" size={26} />
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Today’s Orders</h3>
                <p className="mt-1 text-4xl font-extrabold text-gray-800">{todayorder?.length || 0}</p>
              </div>
            </div>
        </div>

        {/* Total Users Card */}
        <div className="p-4 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl">
        <div className="flex items-center mt-2">
              <Users className="mr-3 text-violet-600" size={26} />
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Users</h3>
                <p className="mt-1 text-4xl font-extrabold text-gray-800">{totaluser.length || 0}</p>
              </div>
            </div>
        </div>

        {/* Dispatched Card */}
        <div className="p-4 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl">
        <div className="flex items-center m-2 mt-2">
              <Truck className="mr-3 text-violet-600" size={26} />
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Dispatched</h3>
                <p className="mt-1 text-4xl font-extrabold text-gray-800">{dispatch.length || 0}</p>
              </div>
            </div>
        </div>
 
        {/* Out for Delivery Card */}
        <div className="p-4 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl">
        <div className="flex items-center m-2 mt-2">
              <Truck className="mr-3 text-violet-600" size={26} />
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Out for Delivery</h3>
                <p className="mt-1 text-4xl font-extrabold text-gray-800">{out.length || 0}</p>
              </div>
            </div>
        </div>

        {/* Delivered Card */}
        <div className="p-4 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl">
        <div className="flex items-center m-2 mt-2">
              <CheckCircle className="mr-3 text-violet-600" size={26} />
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Delivered</h3>
                <p className="mt-1 text-4xl font-extrabold text-gray-800">{orders.length || 0}</p>
              </div>
            </div>
        </div>

        {/* Pending Card */}
        <div className="p-4 transition-shadow bg-white shadow-md rounded-xl hover:shadow-xl">
        <div className="flex items-center m-2 mt-2">
              <Clock className="mr-3 text-violet-600" size={26} />
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Pending</h3>
                <p className="mt-1 text-4xl font-extrabold text-gray-800">{pending.length || 0}</p>
              </div>
            </div>
        </div>
      </div>

      {/* Charts Section */}
      {/* <div className="p-3 bg-white shadow-md rounded-xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Order Distribution</h2>
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
          </div> */}

<div className="p-3 bg-white shadow-md rounded-xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Pie Chart (Mobile Responsive on small screens, original format on lg and above) */}
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Order Distribution</h2>
            <div className="w-full lg:w-96">
              {/* Original format (400x400) on lg and above */}
              <div className="hidden lg:block ">
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
                  <Tooltip contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }} />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                </PieChart>
              </div>
              {/* Mobile-responsive format on smaller screens */}
              <div className="lg:hidden">
                <ResponsiveContainer width="100%" height={300} className="max-w-xs md:max-w-md">
                  <PieChart>
                    <Pie
                      data={orderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
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
                    <Tooltip contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }} />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Order Statistics</h2>
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