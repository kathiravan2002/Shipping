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
    
    const dispatchregion = localStorage.getItem("Region");
    if (!dispatchregion) {
        console.error("No dispatch region found ");
        return;
    }
    console.log(dispatchregion);
    const fetchdispatched = async () => {
        const response = await axios.get(`http://192.168.29.11:5000/api/order/orders/dispatche/${dispatchregion}`)
        setDispatch(response.data);

    }

    useEffect(() => {
        fetchdispatched();
    }, []);

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4'> Dispatched Orders</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {dispatch.map((order, index) => (
                    <div Key={index} className="border border-violet-500 shadow-violet-700 rounded-lg shadow p-4 bg-white" >
                        <div>
                            <div className="flex justify-between">

                                <h2 className="text-lg font-semibold">Order ID: {order.orderId}</h2>

                                <button
                                    onClick={() => editOrder({ _id: order._id })}
                                    className=" text-purple-500 "
                                >
                                    <Pencil />
                                </button>
                            </div>
                        </div>
                        <hr />
                        <p>Consignee Name: {order.Consigneename}</p>
                        <p>Consignee Mobile no: {order.consigneemobileno}</p>
                        <p>Consignee Alternate Mobile no: {order.consigneealterno}</p>
                        <p>Consignee Address: {order.consigneeaddress}</p>
                        <p>Consignee Address: {order.consigneedistrict}</p>
                        <p>Consignee Pincode: {order.consigneepin}</p>
                        <p>Status: <span className="text-green-500">{order.Orderstatus}</span></p>
                    </div>
                ))}
           </div>

        </div>
    )
}


export default Dispatched;