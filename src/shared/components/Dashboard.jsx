import React from "react";
import axios from "axios";
import Spinner from "./Spinner";
import {PieChart,Pie,Cell,Tooltip,BarChart,Bar,XAxis,YAxis,CartesianGrid,Legend,ResponsiveContainer} from "recharts";
import { Plus } from "lucide-react";

function Dashboard(props) {
    const {pending,totalorder,todayorder,totaluser,dispatch,orders,out,orderData,COLORS,navigate} = props;

  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-4 rounded-lg gap-4">
        <div className="bg-purple-300 rounded-lg  border-t-8 border-x-4 p-14 mt-4 hover:shadow-xl hover:shadow-blue-200 transition-shadow">
          <div className=" justify-between ">
            <button
              onClick={() => navigate("/Addorder")}
              className="flex item-center text-gray-600 font-extrabold text-xl px-4 py-2  rounded-md  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-purple-500 hover:text-white"
              type="button"
            >
              <Plus /> Add Order
            </button>
          </div>
        </div>

        {/* <!-- Today's Orders Section --> */}
        <div className="bg-purple-300 rounded-lg  border-t-8 border-x-4 p-14 mt-4 hover:shadow-xl hover:shadow-blue-200 transition-shadow">
          <div className="justify-between">
            <h3 className=" text-gray-600 font-extrabold text-lg ">
              Total Orders
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {totalorder}
            </p>
          </div>
        </div>
        {/* <!-- Today revenue Section --> */}
        <div className="bg-purple-300 rounded-lg  border-t-8 border-x-4 p-14 mt-4 hover:shadow-xl hover:shadow-blue-200 transition-shadow">
          <div className="justify-between">
            <h3 className="text-gray-600 font-extrabold text-lg">
              Today orders
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {todayorder}
            </p>
          </div>
        </div>
        {/* <!-- Today revenue Section --> */}
        <div className="bg-purple-300 rounded-lg  border-t-8 border-x-4 p-14 mt-4 hover:shadow-xl hover:shadow-blue-200 transition-shadow">
          <div className="justify-between">
            <h3 className="text-gray-600 font-extrabold text-lg">
              Total Users
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {totaluser.length || 0}
            </p>
          </div>
        </div>
        <div className="bg-purple-300 rounded-lg  border-t-8 border-x-4 p-14 mt-4 hover:shadow-xl hover:shadow-blue-200 transition-shadow">
          <div className="justify-between">
            <h3 className="text-gray-600 font-extrabold text-lg">
              Total Dispatched
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {dispatch.length || 0}
            </p>
          </div>
        </div>
        <div className="bg-purple-300 rounded-lg  border-t-8 border-x-4 p-14 mt-4 hover:shadow-xl hover:shadow-blue-200 transition-shadow">
          <div className="justify-between">
            <h3 className="text-gray-600 font-extrabold text-lg">
              Total Out for Delivery
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {out.length || 0}
            </p>
          </div>
        </div>
        <div className="bg-purple-300 rounded-lg  border-t-8 border-x-4 p-14 mt-4 hover:shadow-xl hover:shadow-blue-200 transition-shadow">
          <div className="justify-between">
            <h3 className="text-gray-600 font-extrabold text-lg">
              Total Delivered Orders
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {orders.length || 0}
            </p>
          </div>
        </div>

        <div className="bg-purple-300 rounded-lg  border-t-8 border-x-4 p-14 mt-4 hover:shadow-xl hover:shadow-blue-200 transition-shadow">
          <div className="justify-between">
            <h3 className="text-gray-600 font-extrabold text-lg">
              Total Pending Orders
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {pending.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-purple-200 rounded-lg grid grid-cols-1 lg:grid-cols-2 mt-4">
        <div className="flex flex-col items-center mt-10">
          <PieChart width={400} height={400}>
            <Pie
              data={orderData}
              cx={200}
              cy={180}
              innerRadius={60}
              outerRadius={160}
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
            <Tooltip /> 
            <Legend  />
          </PieChart>
        </div>
        <div className="mt-10">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
