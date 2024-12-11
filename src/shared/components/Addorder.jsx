import axios from "axios";
import React, { useState } from "react";

const Addorder = () => {
    const [formData, setFormData] = useState({
        orderId: "",
        orderDate: "",
        customerName: "",
        contact: "",
        productName: "",
        quantity: "",
        paymentMethod: "",
        amountPaid: "",
        status: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.orderId || !formData.customerName || !formData.productName) {
            alert("Please fill in all required fields!");
            return;
        }

        try {
            console.log(formData)
            const response = await axios.post("http://192.168.29.71:5000/api/order/createorder", formData);

            console.log(response.data)

           
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 sm:min-w-full lg:px-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Order</h1>
                <form onSubmit={handleSubmit}>
                    {/* Order Details */}
                    <section className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Order Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <label className="font-medium text-gray-600" htmlFor="orderId">
                                    Order ID:
                                </label>
                                <input
                                    type="text"
                                    id="orderId"
                                    name="orderId"
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    value={formData.orderId}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="p-4 border rounded-lg">
                                <label className="font-medium text-gray-600" htmlFor="orderDate">
                                    Order Date:
                                </label>
                                <input
                                    type="date"
                                    id="orderDate"
                                    name="orderDate"
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    value={formData.orderDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Customer Details */}
                    <section className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Customer Details</h2>
                        <div className="p-4 border rounded-lg">
                            <label className="font-medium text-gray-600" htmlFor="customerName">
                                Name:
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={formData.customerName}
                                onChange={handleChange}
                            />
                            <label className="font-medium text-gray-600" htmlFor="contact">
                                Contact:
                            </label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={formData.contact}
                                onChange={handleChange}
                            />
                        </div>
                    </section>

                    {/* Product Details */}
                    <section className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Product Details</h2>
                        <div className="p-4 border rounded-lg">
                            <label className="font-medium text-gray-600" htmlFor="productName">
                                Product Name:
                            </label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={formData.productName}
                                onChange={handleChange}
                            />
                            <label className="font-medium text-gray-600" htmlFor="quantity">
                                Quantity:
                            </label>
                            <input
                                type="text"
                                id="quantity"
                                name="quantity"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>
                    </section>

                    {/* Payment */}
                    <section className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Payment</h2>
                        <div className="p-4 border rounded-lg">
{/* 
                            <div className="flex place-items-baseline gap-4">
                                <label className="font-medium text-gray-600  py-10 " htmlFor="amountPaid">
                                    Payment Method :
                                </label>
                                <select className="px-3 py-1.5 border rounded-md  bg-white text-sm sm:text-base ">
                                    <option value="">Select a Payment Method</option>
                                    <option value="creditCard">Credit Card</option>
                                    <option value="debitCard">Debit Card</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </div> */}



                            <label className="font-medium text-gray-600" htmlFor="amountPaid">
                                Amount Paid:
                            </label>
                            <input
                                type="text"
                                id="amountPaid"
                                name="amountPaid"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={formData.amountPaid}
                                onChange={handleChange}
                            />

                        </div>
                    </section>

                    {/* Status */}
                    <section className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Status</h2>
                        <div className="p-4 border rounded-lg">
                            <label className="font-medium text-gray-600" htmlFor="status">
                                Current Status:
                            </label>
                            <input
                                type="text"
                                id="status"
                                name="status"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={formData.status}
                                onChange={handleChange}
                            />
                        </div>
                    </section>

                    {/* Add remaining sections as in your original code */}

                    <section className="mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </section>
                </form>
            </div>
        </div>
    );
};

export default Addorder;
