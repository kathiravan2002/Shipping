import React from "react";
import first from "/images/first.jpeg";
import img2 from "/images/img2.jpeg";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <> 
            <div className='space-y-3'> <h1 className="font-bold text-2xl ml-2">Getting started</h1>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 p-2 max-w-full lg:grid-cols-3">

                    {/* <!-- Today's Orders Section --> */}
                    <div className="bg-gray-100 rounded-lg p-4  shadow-md">
                        <div className="flex items-center">

                            <div className="sm:mr-4 lg:ml-20 space-y-2">
                                <h2 className="text-gray-900 font-bold">Add your 1st Order</h2>
                                <p className=" text-gray-600">Add your 1st Order to start your shipping jouney</p>
                                <p className="text-sm"><button className="bg-violet-500 rounded text-white p-2"  onClick={() => navigate("/Addorder")}>Add order</button></p>

                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4  shadow-md">
                        <div className="flex items-center">

                            <div className="sm:mr-4 lg:ml-20 space-y-2">
                                <h2 className="text-gray-900 font-bold">Recharge your Wallet</h2>
                                <p className=" text-gray-600">Add wallet balance to start shipping orders</p>
                                <p className="text-sm"><button className="bg-violet-500 rounded text-white p-2">recharge</button></p>

                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4  shadow-md">
                        <div className="flex items-center">

                            <div className="sm:mr-4 lg:ml-20 space-y-2">
                                <h2 className="text-gray-900 font-bold">Complete your KYC</h2>
                                <p className=" text-gray-600">Complete your KYC verifiaction to start shipping orders</p>
                                <p className="text-sm"><button className="bg-violet-500 rounded text-white p-2">verify KYC</button></p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <br />


            <div className='space-y-4'> <h1 className="font-bold text-2xl ml-2">Setup Business Profile</h1>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 p-2 max-w-full lg:grid-cols-3">

                    {/* <!-- Today's Orders Section --> */}
                    <div className="bg-gray-100 rounded-lg p-4  shadow-md ">
                        <div className="flex items-center">

                            <div className="sm:mr-4 lg:ml-20 space-y-2">
                                <h2 className="text-gray-900 font-bold">Add Store Details</h2>
                                <p className=" text-gray-600">Add store name,email & logo</p>
                                <p className="text-sm"><button className="bg-violet-500 rounded text-white p-2 ">Completed</button></p>

                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4  shadow-md">
                        <div className="flex items-center">

                            <div className="sm:mr-4 lg:ml-20 space-y-2">
                                <h2 className="text-gray-900 font-bold">Add Bank Details</h2>
                                <p className=" text-gray-600">To receive COD remittance add bank details</p>
                                <p className="text-sm"><button className="bg-violet-500 rounded text-white p-2">+ Add</button></p>

                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4  shadow-md">
                        <div className="flex items-center">

                            <div className="sm:mr-4 lg:ml-20 space-y-2">
                                <h2 className="text-gray-900 font-bold">Add Store's Social Media Handle </h2>
                                <p className=" text-gray-600">Complete your KYC verifiaction to start shipping orders</p>
                                <p className="text-sm"><button className="bg-violet-500 rounded text-white p-2">+ Add </button></p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <br />
            <div className="grid grid-cols-1 sm:grid-cols-1  p-2 max-w-full lg:grid-cols-1">

                {/* <!-- Today's Orders Section --> */}
                <div className="bg-gray-100 rounded-lg p-10 shadow-md ">


                    <div className="space-y-14">
                        <h1 className="text-gray-900 font-bold flex items-start text-lg">Action Needing Your Attention Today</h1>

                        <div className="flex flex-col items-center space-y-4">{/* Image */}
                            <img src={first} alt="image" className="w-50 h-50 object-contain" />

                            <p className=" text-gray-600">Add store name,email & logo</p></div>



                    </div>

                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1  p-2 max-w-full lg:grid-cols-1">

                {/* <!-- Today's Orders Section --> */}
                <div className="bg-gray-100 rounded-lg p-10 shadow-md ">


                    <div className="space-y-14">
                        <h1 className="text-gray-900 font-bold flex items-start text-lg">Your Upcoming Pickups</h1>

                        <div className="flex flex-col items-center space-y-4">
                            {/* Image */}
                            <img src={img2} alt="image" className="w-50 h-50 object-contain" />

                            <p className=" text-gray-600">No Pickups Scheduled</p></div>



                    </div>

                </div>

            </div>

        </>
    )
}

export default Home;
