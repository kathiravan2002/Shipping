import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {useParams,useNavigate} from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { CornerDownLeft,Trash } from 'lucide-react';
const Addorder = () => {
  const { id } = useParams(); // Get the order ID from the URL
  const [formData, setFormData] = useState({
    ConsignerName: "",
    consignermobileNumber: "",
    consignerAddress: "",
    consignermail: "",
    consignerdistrict: "",
    consignerstate: "",
    consignerpincode: "",
    Consigneename: "",
    consigneemobileno: "",
    consigneealterno: "",
    consigneedistrict: "",
    consigneeaddress: "",
    consigneestate: "",
    consigneepin: "",
    productname: "",
    noofpackage: "",
    packageWeight: "",
    packagetype: "",
    price: ""
    
  });

  const [apiData, setApiData] = useState([]);
  const [consignerDistricts, setConsignerDistricts] = useState([]);
  const [consignerPincodes, setConsignerPincodes] = useState([]);
  const [consigneeDistricts, setConsigneeDistricts] = useState([]);
  const [consigneePincodes, setConsigneePincodes] = useState([]);
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
 

  // Function to convert strings to sentence case
  const toSentenceCase = (str) =>
    str.toLowerCase().replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());

  // Fetch data from the API on component mount  
  useEffect(() => {
    fetch(
      "https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd0000019029558117064dd17c6931b0f89fb6ba&format=json&filters[statename]=Tamil Nadu&limit=40000"
    )
      .then((response) => response.json())
      .then((data) => {
        setApiData(data.records);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const states = [...new Set(apiData.map((item) => item.statename))];

  // Update districts and pincodes for Consigner
  useEffect(() => {
    if (formData.consignerstate) {
      const filteredDistricts = apiData
        .filter((item) => item.statename === formData.consignerstate)
        .map((item) => item.district);

      const formattedDistricts = [...new Set(filteredDistricts)].map(
        toSentenceCase
      );
      setConsignerDistricts(formattedDistricts.sort());
    }
  }, [formData.consignerstate, apiData]);

  useEffect(() => {
    if (formData.consignerdistrict) {
      const originalDistrict = apiData
        .map((item) => ({
          original: item.district,
          formatted: toSentenceCase(item.district),
        }))
        .find((d) => d.formatted === formData.consignerdistrict)?.original;

      const filteredPincodes = apiData
        .filter((item) => item.district === originalDistrict)
        .map((item) => ({
          pincode: item.pincode,
          officename: item.officename,
        }));
      setConsignerPincodes(filteredPincodes);
    }
  }, [formData.consignerdistrict, apiData]);

  // Update districts and pincodes for Consignee
  useEffect(() => {
    if (formData.consigneestate) {
      const filteredDistricts = apiData
        .filter((item) => item.statename === formData.consigneestate)
        .map((item) => item.district);

      const formattedDistricts = [...new Set(filteredDistricts)].map(
        toSentenceCase
      );
      setConsigneeDistricts(formattedDistricts.sort());
    }
  }, [formData.consigneestate, apiData]);

  useEffect(() => {
    if (formData.consigneedistrict) {
      const originalDistrict = apiData
        .map((item) => ({
          original: item.district,
          formatted: toSentenceCase(item.district),
        }))
        .find((d) => d.formatted === formData.consigneedistrict)?.original;

      const filteredPincodes = apiData
        .filter((item) => item.district === originalDistrict)
        .map((item) => ({
          pincode: item.pincode,
          officename: item.officename,
        }));
      setConsigneePincodes(filteredPincodes);
    }
  }, [formData.consigneedistrict, apiData]);
  useEffect(() => {
    if (id) {
      // Fetch order details for editing
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(
            `http://192.168.29.11:5000/api/order/${id}`
          );
          setFormData(response.data); // Pre-fill the form
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };

      fetchOrderDetails();
    }
  }, [id]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      if (name === "packageWeight") {
        const price = calculatePrice(value);
        updatedData = { ...updatedData, price };
      }
      return updatedData;
    });
  };
  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    try {
      if (id) {
        // Update order
        await axios.put(
          `http://192.168.29.11:5000/api/order/${id}`,
          formData
        );
        toast.success("Order updated successfully!");
      } else {
        // Add new order
        await axios.post(`http://192.168.29.11:5000/api/order/createorder`, formData);
        toast.success("Form submitted successfully!");
      }
      navigate("/orders"); // Redirect to orders page
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit order.");
    }
    setIsDataSubmitted(true);

     // Add a delay before navigating
     setIsNavigating(true);
     setTimeout(() => {
       navigate("/Order");
       setIsNavigating(false);
     }, 500); // Ad
   
  };

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [volumetricWeight, setVolumetricWeight] = useState(null);

  const calculateVolumetricWeight = () => {
    if (length && width && height) {
      const volumetric = (length * width * height) / 5000;
      setVolumetricWeight(volumetric.toFixed(2));
    } else {
      alert("Please enter valid dimensions.");
    }
  };

  const calculatePrice = (weight) => {
    if (!weight || isNaN(weight)) {
      return 0;
    }

    weight = parseFloat(weight);

    if (weight <= 1) {
      return "₹40";
    } else if (weight == 0) {
      return "40";
    } else if (weight > 1 && weight <= 2) {
      return "₹80";
    } else if (weight > 2 && weight <= 5) {
      return "₹120";
    } else if (weight > 5 && weight <= 10) {
      return "₹360";
    } else if (weight > 10 && weight <= 20) {
      return "₹600";
    } else {
      return "₹1000";
    }
  };
  const handleClick = () => {
    if (isDataSubmitted) {
      setIsNavigating(true);
      setTimeout(() => {
        navigate("/Order");
        // setIsNavigating(false);
      }, 1000); // Delay navigation
    } 
 
  };
  console.log(formData);
//Dialogbox for weight calculation
const [visible, setVisible] = useState(false);
// weight calculation


  const [rows, setRows] = useState([
    { length: "", width: "", height: "", weight: "", packages: "" },
  ]);
  const [freightRate, setFreightRate] = useState("");

  // Add a new line
  const addRow = () => {
    setRows([...rows, { length: "", width: "", height: "", weight: "", packages: "1" }]);
  };

  // Delete a row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Update a row's data
  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = parseFloat(value) || "";
    setRows(newRows);
  };

  // Calculate totals
  const totalPackages = rows.reduce((sum, row) => sum + (parseFloat(row.packages) || 0), 0);
  const totalWeight = rows.reduce((sum, row) => sum + (parseFloat(row.weight) || 0) * (parseFloat(row.packages) || 0), 0);
  const totalVolumetricWeight = rows.reduce((sum, row) =>
    sum + ((parseFloat(row.length) || 0) * (parseFloat(row.width) || 0) * (parseFloat(row.height) || 0)) / 5000 * (parseFloat(row.packages) || 0),
    0
  );

  const chargeableWeight = Math.max(totalWeight, totalVolumetricWeight);
  const totalChargeableAmount = chargeableWeight * (parseFloat(freightRate) || 0);
  
     // Update formData's packageWeight whenever chargeableWeight changes
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      packageWeight: chargeableWeight, // Update packageWeight
      price:totalChargeableAmount,
      noofpackage:totalPackages,


    }));
  }, [chargeableWeight,totalChargeableAmount,totalPackages]); {/* The dependency array [chargeableWeight] ensures that the effect runs only when chargeableWeight is recalculated. */}

  return (
    <div className="max-w-full mx-auto p-4 bg-white shadow-lg shadow-purple-300 rounded-lg">
      <h1 className="text-center text-2xl font-semibold mb-10">
        Order Details
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-3 gap-4 text-sm"
      >
        {/* Consigner Details */}
        <div className="col-span-3 lg:col-span-1 md:col-span-1">
          <h2 className="font-semibold text-xl mb-6">1. Consigner Details</h2>
          <input
            type="text"
            name="ConsignerName"
            value={formData.ConsignerName}
            onChange={handleInputChange}
            placeholder="Consigner Name"
            className="w-full p-4 border rounded mb-2"
            // required
          />
          <input
            type="number"
          
            name="consignermobileNumber"
            value={formData.consignermobileNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            className="w-full p-4 border rounded mb-2"
            // required
          />
          <input
            type="text"
            name="consignerAddress"
            value={formData.consignerAddress}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full p-4 border rounded mb-2"
            // required
          />
          <input
            type="email"
            name="consignermail"
            value={formData.consignermail}
            onChange={handleInputChange}
            placeholder="Email (optional)"
            className="w-full p-4 border rounded mb-2"
           
         
          />

          {/* State Dropdown */}
          <select
            name="consignerstate"
            value={formData.consignerstate}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            // required
          >
            <option value="">Select State</option>
            {states.length > 0 ? (
              states.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))
            ) : (
              <option>No states available</option>
            )}
          </select>

          {/* District Dropdown */}
          <select
            name="consignerdistrict"
            value={formData.consignerdistrict}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            // required
          >
            <option value="">Select District</option>
            {consignerDistricts.length > 0 ? (
              consignerDistricts.map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))
            ) : (
              <option>No districts available</option>
            )}
          </select>

          {/* Pincode Dropdown */}
          <select
            name="consignerpincode"
            value={formData.consignerpincode}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            // required
          >
            <option value="">Select Pincode</option>
            {consignerPincodes.length > 0 ? (
              consignerPincodes.map((pincode, idx) => (
                <option
                  key={idx}
                  value={`${pincode.pincode}-${pincode.officename}`}
                >
                  {pincode.pincode} - {pincode.officename}
                </option>
              ))
            ) : (
              <option>No pincodes available</option>
            )}
          </select>
        </div>

        {/* Consignee Details */}
        <div className="col-span-3 lg:col-span-1 md:col-span-1">
          <h2 className="font-semibold  text-xl mb-6">2.Consignee Details</h2>
          <input
            type="text"
            name="Consigneename"
            value={formData.Consigneename}
            onChange={handleInputChange}
            placeholder="Consignee Name"
            className="w-full p-4 border rounded mb-2"
            // required
          />
          <input
            type="tel"
            name="consigneemobileno"
            value={formData.consigneemobileno}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            className="w-full p-4 border rounded mb-2"
            // required
          />
          <input
            type="tel"
            name="consigneealterno"
            value={formData.consigneealterno}
            onChange={handleInputChange}
            placeholder="Alternate Mobile No"
            className="w-full p-4 border rounded mb-2"
            // required
          />
          <input
            type="text"
            name="consigneeaddress"
            value={formData.consigneeaddress}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full p-4 border rounded mb-2"
            // required
          />

          {/* State Dropdown */}
          <select
            name="consigneestate"
            value={formData.consigneestate}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            // required
          >
            <option value="">Select State</option>
            {states.length > 0 ? (
              states.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))
            ) : (
              <option>No states available</option>
            )}
          </select>

          {/* District Dropdown */}
          <select
            name="consigneedistrict"
            value={formData.consigneedistrict}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            // required
          >
            <option value="">Select District</option>
            {consigneeDistricts.length > 0 ? (
              consigneeDistricts.map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))
            ) : (
              <option>No districts available</option>
            )}
          </select>

          {/* Pincode Dropdown */}
          <select
            name="consigneepin"
            value={formData.consigneepin}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            // required
          >
            <option value="">Select Pincode</option>
            {consigneePincodes.length > 0 ? (
              consigneePincodes.map((pincode, idx) => (
                <option
                  key={idx}
                  value={`${pincode.pincode}-${pincode.officename}`}
                >
                  {pincode.pincode} - {pincode.officename}
                </option>
              ))
            ) : (
              <option>No pincodes available</option>
            )}
          </select>
        </div>

        {/* Product Details */}
        <div className="col-span-3 lg:col-span-1 md:col-span-1">
          <h2 className="font-semibold  text-xl mb-6">3.Product Details</h2>
          <input
            type="text"
            name="productname"
            value={formData.productname}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="w-full p-4 border rounded mb-2"
            // required
          />
          {/* <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 mb-2">
            <input
              type="number"
              placeholder="Length (cm)"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full p-4 border rounded lg:col-span-1 col-span-3"
             
             
            />
            <input
              type="number"
              placeholder="Width (cm)"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full p-4 border rounded lg:col-span-1 col-span-3"
             
            />
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-4 border rounded lg:col-span-1 col-span-3"
             
            />
          </div> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              className="bg-purple-700 text-white p-3 rounded mb-2 shadow-md shadow-gray-700"
              onClick={() => setShowPriceDialog(true)}
            >
              {" "}
              View Price Range
            </button>

            {showPriceDialog && (
              
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
                <div className="bg-white p-5 rounded shadow-md w-3/4 lg:w-1/3 shadow-gray-700">
                  <h2 className="text-lg font-bold mb-4 text-center">
                    Price Range
                  </h2>

                  <div class="relative overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" class="px-6 py-3">
                          Service Type
                          </th>
                          <th scope="col" class="px-6 py-3">
                          Within Tamil Nadu
                          </th>
                          <th scope="col" class="px-6 py-3">
                          Other States
                          </th>
                         
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            Documents
                          </th>
                          <td class="px-6 py-4">Rs. 40</td>
                          <td class="px-6 py-4">Rs. 60</td>
                        
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                         Small Parcels
                         (up to 1 kg)
                          </th>
                          <td class="px-6 py-4">Rs. 45</td>
                          <td class="px-6 py-4">Rs. 70</td>
                         
                        </tr>
                        <tr class="bg-white  border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                           Medium Parcels 
                           (1-2 kg)
                          </th>
                          <td class="px-6 py-4">Rs. 80</td>
                          <td class="px-6 py-4">Rs. 110</td>
                       
                        </tr>
                        <tr class="bg-white  border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                          Large Parcels
                          (2-5 kg)
                          </th>
                          <td class="px-6 py-4">Rs. 120</td>
                          <td class="px-6 py-4">Rs. 135</td>
                       
                        </tr>
                        <tr class="bg-white  border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                          Extra Large Parcels
                          (5-10 kg)
                          </th>
                          <td class="px-6 py-4">Rs. 360</td>
                          <td class="px-6 py-4">Rs. 360</td>
                       
                        </tr>
                        <tr class="bg-white  border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                          Bulk Shipments 
                          (10-20 kg)
                          </th>
                          <td class="px-6 py-4">Rs. 600</td>
                          <td class="px-6 py-4">Rs. 700</td>
                       
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    className="bg-red-500 text-white pl-3 pr-3 pt-2 pb-2 mt-3 rounded "
                    onClick={() => setShowPriceDialog(false)}
                  >
                    {" "}
                    close
                  </button>

                  
                </div>
              </div>
            )}
            {/* <button
              type="button"
              onClick={calculateVolumetricWeight}
              className="bg-purple-600 text-white  p-3  rounded mb-2 shadow-md shadow-gray-700"
            >
              {" "}
              Calculate Volumetric Weight
            </button> */}
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="bg-purple-700 text-white  p-3  rounded mb-2 shadow-md shadow-gray-700" icon="pi pi-external-link" 
            >
              {" "}
              Calculate  Weight
            </button>
           
            {volumetricWeight && (
              <p className="text-sm">
                Volumetric Weight: {volumetricWeight} kg{" "}
              </p>
            )}
          </div>
          <input
            type="text"
            name="packageWeight"
            value={chargeableWeight  > 0 ? `${ chargeableWeight}` : formData.packageWeight || ""}
            onChange={handleInputChange}
            placeholder="Package Weight (kg)"
            className="w-full p-4 border rounded mb-2"
            required
          />
            <input
            type="text"
            name="noofpackage"
            value={totalPackages > 0 ? `${totalPackages}` : formData.noofpackage || ""}
            onChange={handleInputChange}
            placeholder="No of Packages"
            className="w-full p-4 border rounded mb-2"
            required
          />
       <input
            type="text"
            name="price"
            value={totalChargeableAmount > 0 ? `₹${totalChargeableAmount }` : formData.price || ""}
            placeholder="Price (₹)"
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            required
          />

          <select
            name="packagetype"
            value={formData.packagetype}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            // required
          >
            <option>Select package type</option>
            <option>Perishable goods</option>
            <option>Fragile items</option>
            <option>Crates</option>
            <option>Document</option>
            <option>Envelope</option>
          </select>
          <select
            name="instruction"
            value={formData.instruction}
            onChange={handleInputChange}
            className="w-full p-4 border rounded mb-2"
            required
          >
            <option>Select Handling Instruction</option>
            <option>Do not Tilt</option>
            <option>Handle with care</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-span-3 text-center mt-4 p-4 relative">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-7 py-3 rounded absolute right-0"  onClick={handleClick}
          >
            {id ? "Update Order" : "Add Order"}
          </button>
        </div>
      </form>
      <button
            type=""  onClick={() => navigate("/Order")}
            className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-7 py-3 rounded"
          >
          Back
          </button>
         
            {/* Dialog box for Calculation */}
            <div className="relative  top-2 right-2">
           {visible && (
                <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
            )}
          <div className="card flex justify-content-center z-50">           
          <Dialog  className="bg-white rounded-lg m-8 relative" visible={visible} style={{ width: '80vw', height:'60vh' }} closable={false} >
             {/* Close Button */}
             <button
                  onClick={() => setVisible(false)}
                  className="absolute top-1 right-3 text-gray-700 hover:text-gray-800 text-3xl  hover:bg-gray-200 hover:rounded-full"
                  aria-label="Close"
             >
               &times;
             </button>
            <div className="p-6 space-y-6 bg-white rounded-lg mt-5">
        {/* Table Section */}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">Unit of Measure</th>
              <th className="border border-gray-300 p-2">Length</th>
              <th className="border border-gray-300 p-2">Width</th>
              <th className="border border-gray-300 p-2">Height</th>
              <th className="border border-gray-300 p-2">Gross Weight</th>
              <th className="border border-gray-300 p-2">No of Packages</th>
              <th className="border border-gray-300 p-2">Total Gross Weight</th>
              <th className="border border-gray-300 p-2">Volumetric Weight</th>
              <th className="border border-gray-300 p-2">Total Volumetric Weight</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <select className="border rounded p-1">
                    <option value="cm">cm</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.length}
                    placeholder="Length"
                    onChange={(e) => updateRow(index, "length", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.width}
                    placeholder="Width"
                    onChange={(e) => updateRow(index, "width", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.height}
                    placeholder="Height"
                    onChange={(e) => updateRow(index, "height", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.weight}
                    placeholder="Weight"
                    onChange={(e) => updateRow(index, "weight", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.packages}
                    placeholder="Packages"
                    onChange={(e) => updateRow(index, "packages", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {(parseFloat(row.weight) || 0) * (parseFloat(row.packages) || 0)} Kg
                </td>
                <td className="border border-gray-300 p-2">
                  {(((row.length || 0) * (row.width || 0) * (row.height || 0)) / 5000).toFixed(2)} Kg
                </td>
                <td className="border border-gray-300 p-2">
                  {(
                    (((row.length || 0) * (row.width || 0) * (row.height || 0)) / 5000) *
                    (row.packages || 0)
                  ).toFixed(2)}{" "}
                  Kg
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteRow(index)}
                  >
                     <Trash />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td className="border border-gray-300 p-2" colSpan="5">
                Totals
              </td>
              <td className="border border-gray-300 p-2">{totalPackages}</td>
              <td className="border border-gray-300 p-2">{totalWeight.toFixed(2)} Kg</td>
              <td className="border border-gray-300 p-2">
                {totalVolumetricWeight.toFixed(2)} Kg
              </td>
              <td className="border border-gray-300 p-2">
                {totalVolumetricWeight.toFixed(2)} Kg
              </td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end">
          <button
            className="text-white border p-2 rounded bg-purple-500 flex items-center"
            onClick={addRow}
          >
            Add Line <CornerDownLeft className="ml-2" />
          </button>
        </div>
     

      {/* Freight Rate Section */}
      
        <h3 className="font-semibold text-lg text-center">Enter Freight Rate to move this Cargo</h3>
        <div className="grid justify-self-center">
          {/* Freight Rate Input */}
          <div className="flex items-center">
            <label className="text-gray-700 mr-2">Freight Rate Per (Kg):</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
              <input
                type="number"
                value={freightRate}
                onChange={(e) => setFreightRate(parseFloat(e.target.value))}
                className="pl-8 pr-2 py-1 border border-gray-300 rounded-md bg-purple-100 w-32"
              />
            </div>
          </div>

          {/* Chargeable Rate */}
          <div className="flex justify-between items-center">
            <label className="text-gray-700">Chargeable Rate (Kg):</label>
            <p className="text-gray-700 font-medium"> {chargeableWeight > 0 ? `${chargeableWeight.toFixed(2)} Kg` : ""}</p>
          </div>

          {/* Total Chargeable Amount */}
          <div className="flex justify-between items-center pt-4">
            <label className="font-semibold text-gray-700">Total Chargeable Amount:</label>
            <p className="font-bold text-gray-800"> {totalChargeableAmount > 0 ? `₹${totalChargeableAmount.toFixed(2)}` : ""}</p>
          </div>
        </div>
      </div>
          </Dialog>
          </div>
          </div>

    </div>
  );
};


export default Addorder;