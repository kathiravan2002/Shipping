import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dispatched() {

    const [dispatch, setDispatch] = useState([]);

    const navigate = useNavigate();

    const editOrder = ({ _id }) => {
        navigate(`/Addorder/${_id}`); // Redirect to Add Order page with the order ID
    };

    const fetchdispatched = async () => {
        const response = await axios.get("http://192.168.29.71:5000/api/order/orders/dispatche")
        setDispatch(response.data);

    }

    useEffect(() => {
        fetchdispatched();
    }, []);

    return (
        <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-200">
            <h1 className='text-2xl font-bold mb-4'> Dispatched Orders</h1>
            <div className="mt-4 overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>

                                {["No", "Order Id", "Consignee Name", "Consignee Mobile no", "Consignee Alternate Mobile no", "Consignee Address", "Consignee District", "Consignee Pincode", "Status", "Action"].map((header) => (
                                    <th key={header} className="px-4 py-2 text-left font-medium text-gray-500 uppercase whitespace-nowrap" >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dispatch?.length > 0 ? (dispatch.map((order, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sky-700">{order.orderId}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-indigo-600">{order.Consigneename}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{order.consigneemobileno}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{order.consigneealterno}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{order.consigneeaddress}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{order.consigneedistrict}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{order.consigneepin}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-green-600">{order.Orderstatus}</td>

                                    <td className="px-4 py-3 whitespace-nowrap space-x-2">
                                        <button onClick={() => editOrder({ _id: order._id })} className=" text-purple-500  "> <Pencil /> </button>

                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-10">
                                        <div className="flex flex-col items-center">

                                            <p className="text-gray-600 mt-4 font-semibold text-2xl">
                                                No dispatched order
                                            </p>

                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}


export default Dispatched;