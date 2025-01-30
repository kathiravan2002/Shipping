import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { CornerDownLeft, Trash } from 'lucide-react';
const Addorder = () => {
  const { id } = useParams(); // Get the order ID from the URL
  const [formData, setFormData] = useState({
    ConsignerName: "",
    consignermobileNumber: "",
    consignerAddress: "",
    consignercity: "",
    consignermail: "",
    consignerdistrict: "",
    consignerstate: "",
    consignerpincode: "",
    Consigneename: "",
    consigneemobileno: "",
    consigneealterno: "",
    consigneedistrict: "",
    consigneeaddress: "",
    consigneecity: "",
    consigneestate: "",
    consigneepin: "",
    productname: "",
    noofpackage: "",
    packageWeight: "",
    packagetype: "",
    price: "",
    Orderstatus: "",
    dispatchstate: "",
    dispatchdistrict: "",
    dispatchpincode: "",
    deliveryimage: ""
  });

  const [apiData, setApiData] = useState([]);
  const [consignerDistricts, setConsignerDistricts] = useState([]);
  const [consignerPincodes, setConsignerPincodes] = useState([]);
  const [consigneeDistricts, setConsigneeDistricts] = useState([]);
  const [consigneePincodes, setConsigneePincodes] = useState([]);
  const [dispatchDistricts, setdispatchDistricts] = useState([]);
  const [dispatchPincodes, setdispatchPincodes] = useState([]);
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const [pinapidata, setpinapidata] = ([])


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
    if (formData.dispatchstate) {
      const filteredDistricts = apiData
        .filter((item) => item.statename === formData.dispatchstate)
        .map((item) => item.district);

      const formattedDistricts = [...new Set(filteredDistricts)].map(
        toSentenceCase
      );
      setdispatchDistricts(formattedDistricts.sort());
    }
  }, [formData.dispatchstate, apiData]);

  useEffect(() => {
    if (formData.dispatchdistrict) {
      const originalDistrict = apiData
        .map((item) => ({
          original: item.district,
          formatted: toSentenceCase(item.district),
        }))
        .find((d) => d.formatted === formData.dispatchdistrict)?.original;

      const filteredPincodes = apiData
        .filter((item) => item.district === originalDistrict)
        .map((item) => ({
          pincode: item.pincode,
          officename: item.officename,
        }));
      setdispatchPincodes(filteredPincodes);
    }
  }, [formData.dispatchdistrict, apiData]);
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


    const formDataWithImage = new FormData();
    formDataWithImage.append("ConsignerName", formData.ConsignerName);
    formDataWithImage.append("consignermobileNumber", formData.consignermobileNumber);
    formDataWithImage.append("consignerAddress", formData.consignerAddress);
    formDataWithImage.append("consignercity", formData.consignercity);
    formDataWithImage.append("consignermail", formData.consignermail);
    formDataWithImage.append("consignerdistrict", formData.consignerdistrict);
    formDataWithImage.append("consignerstate", formData.consignerstate);
    formDataWithImage.append("consignerpincode", formData.consignerpincode);
    formDataWithImage.append("Consigneename", formData.Consigneename);
    formDataWithImage.append("consigneemobileno", formData.consigneemobileno);
    formDataWithImage.append("consigneealterno", formData.consigneealterno);
    formDataWithImage.append("consigneedistrict", formData.consigneedistrict);
    formDataWithImage.append("consigneeaddress", formData.consigneeaddress);
    formDataWithImage.append("consigneestate", formData.consigneestate);
    formDataWithImage.append("consigneepin", formData.consigneepin);
    formDataWithImage.append("productname", formData.productname);
    formDataWithImage.append("noofpackage", formData.noofpackage);
    formDataWithImage.append("packageWeight", formData.packageWeight);
    formDataWithImage.append("packagetype", formData.packagetype);
    formDataWithImage.append("price", formData.price);
    formDataWithImage.append("Orderstatus", formData.Orderstatus);
    formDataWithImage.append("dispatchstate", formData.dispatchstate);
    formDataWithImage.append("dispatchdistrict", formData.dispatchdistrict);
    formDataWithImage.append("dispatchpincode", formData.dispatchpincode);
    
    if (formData.deliveryimage) {
      formDataWithImage.append("deliveryimage", formData.deliveryimage); // Must match backend field
    }

    try {
      if (id) {
        await axios.put(`http://192.168.29.11:5000/api/order/${id}`,formDataWithImage,{
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Order updated successfully!");
      } else {
        // Add new order
        await axios.post(`http://192.168.29.11:5000/api/order/createorder`, formData,{
          headers : {
             "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
    });
        toast.success("Form submitted successfully!");
      }

      navigate("/orders");
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
  const [taxRate, setTaxRate] = useState("");


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
    // setFormData((prevFormData) => [...prevFormData, ...newRows]);

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
  const totalTax = chargeableWeight * (parseFloat(taxRate) || 0);                        //mrng work change the totaltax 
  const totalWithTax = totalChargeableAmount + totalTax;
  // Update formData's packageWeight whenever chargeableWeight changes
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      packageWeight: chargeableWeight, // Update packageWeight
      price: totalChargeableAmount,
      noofpackage: totalPackages,


    }));
  }, [chargeableWeight, totalChargeableAmount, totalPackages]); {/* The dependency array [chargeableWeight] ensures that the effect runs only when chargeableWeight is recalculated. */ }

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-50 shadow-lg shadow-purple-300 rounded-lg">
      <h1 className="text-center text-2xl font-semibold mb-10">
        Order Details
      </h1>
      <form
        onSubmit={handleSubmit}
        className="text-sm"
      >
        <div className="grid 2xl:grid-cols-2 md:grid-cols-2 gap-14  ">
          {/* Consigner Details */}
          <div>
            <h2 className="font-semibold text-xl mb-6">1. Consigner Details</h2>
            <div className="grid lg:grid-cols-3 gap-2">
              <input
                type="text"
                name="ConsignerName"
                value={formData.ConsignerName}
                onChange={handleInputChange}
                placeholder="Consigner Name "
                className="w-full  p-4 border-2 bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />
              <input
                type="number"

                name="consignermobileNumber"
                value={formData.consignermobileNumber}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="w-full  p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />
              <input
                type="text"
                name="consignerAddress"
                value={formData.consignerAddress}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />
              <input
                type="text"
                name="consignercity"
                value={formData.consignercity}
                onChange={handleInputChange}
                placeholder="city"
                className="w-full  p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />
              <input
                type="email"
                name="consignermail"
                value={formData.consignermail}
                onChange={handleInputChange}
                placeholder="Email (optional)"
                className="w-full  p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"


              />

              {/* State Dropdown */}
              <select
                name="consignerstate"
                value={formData.consignerstate}
                onChange={handleInputChange}
                className=" w-full  p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
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
                className=" w-full  p-4 border-2 bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
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
                className="w-full  p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
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
          </div>

          {/* Consignee Details */}
          <div>
            <h2 className="font-semibold  text-xl mb-6">2.Consignee Details</h2>
            <div className="grid lg:grid-cols-3 gap-2">
              <input
                type="text"
                name="Consigneename"
                value={formData.Consigneename}
                onChange={handleInputChange}
                placeholder="Consignee Name"
                className="w-full p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />
              <input
                type="number"
                maxlength="10" pattern="\d{10}"
                name="consigneemobileno"
                value={formData.consigneemobileno}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="w-full p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />
              <input
                type="number"
                name="consigneealterno"
                value={formData.consigneealterno}
                onChange={handleInputChange}
                placeholder="Alternate Mobile No"
                className="w-full p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />
              <input
                type="text"
                name="consigneeaddress"
                value={formData.consigneeaddress}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />
              <input
                type="text"
                name="consigneecity"
                value={formData.consigneecity}
                onChange={handleInputChange}
                placeholder="city"
                className="w-full p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
              // required
              />

              {/* State Dropdown */}
              <select
                name="consigneestate"
                value={formData.consigneestate}
                onChange={handleInputChange}
                className="w-full p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
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
                className="w-full  p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
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
                name="consigneepin "
                value={formData.consigneepin}
                onChange={handleInputChange}
                className="w-full  p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
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
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 2xl:grid-cols-1 md:grid-cols-1">
          <h2 className="font-semibold  text-xl mb-6">3.Package Details</h2>


          <div className="p-6 space-y-6 bg-gray-50 rounded-lg mt-5">
            {/* Table Section */}
            <div className="grid grid-cols-1 2xl:grid-cols-1 md:grid-cols-1">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2">S.NO</th>
                    {/* <th className="border border-gray-300 p-2">Length</th>
                  <th className="border border-gray-300 p-2">Width</th>
                  <th className="border border-gray-300 p-2">Height</th> */}
                    <th className="border border-gray-300 p-2">Weight</th>
                    <th className="border border-gray-300 p-2">No of Packages</th>
                    <th className="border border-gray-300 p-2">Total Weight</th>
                    {/* <th className="border border-gray-300 p-2">Volumetric Weight</th>
                  <th className="border border-gray-300 p-2">Total Volumetric Weight</th> */}
                    <th className="border border-gray-300 p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (

                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {index + 1}
                      </td>
                      {/* <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        value={row.length}
                        placeholder="Length"
                        onChange={(e) => updateRow(index, "length", e.target.value)}
                        className="w-full border p-1 rounded bg-violet-50"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        value={row.width}
                        placeholder="Width"
                        onChange={(e) => updateRow(index, "width", e.target.value)}
                        className="w-full border p-1 rounded bg-violet-50"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-violet-50">
                      <input
                        type="number"
                        value={row.height}
                        placeholder="Height"
                        onChange={(e) => updateRow(index, "height", e.target.value)}
                        className="w-full border p-1 rounded bg-violet-50"
                      />
                    </td> */}
                      <td className="border border-gray-300 p-2">
                        <input
                          type="number"
                          value={row.weight}
                          placeholder="Weight"
                          onChange={(e) => updateRow(index, "weight", e.target.value)}
                          className="w-full border p-1 rounded bg-violet-50"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="number"
                          value={row.packages}
                          placeholder="Packages"
                          onChange={(e) => updateRow(index, "packages", e.target.value)}
                          className="w-full  border p-1 rounded bg-violet-50"
                        />
                      </td>

                      <td className="border border-gray-300 p-2">
                        {(parseFloat(row.weight) || 0) * (parseFloat(row.packages) || 0)} Kg
                      </td>
                      {/* <td className="border border-gray-300 p-2">
                      {(((row.length || 0) * (row.width || 0) * (row.height || 0)) / 5000).toFixed(2)} Kg
                    </td>
                    <td className="border border-gray-300 p-2">
                      {(
                        (((row.length || 0) * (row.width || 0) * (row.height || 0)) / 5000) *
                        (row.packages || 0)
                      ).toFixed(2)}{" "}
                      Kg
                    </td> */}
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
                    <td className="border border-gray-300 p-2" colSpan="2">
                      Totals
                    </td>
                    <td className="border border-gray-300 p-2">{totalPackages}</td>
                    <td className="border border-gray-300 p-2">{totalWeight.toFixed(2)} Kg</td>
                    {/* <td className="border border-gray-300 p-2">
                    {totalVolumetricWeight.toFixed(2)} Kg
                  </td>
                  <td className="border border-gray-300 p-2">
                    {totalVolumetricWeight.toFixed(2)} Kg
                  </td> */}
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                className="text-white border p-2 rounded bg-purple-500 flex items-center"
                onClick={addRow}
              >
                Add Product <CornerDownLeft className="ml-2" />
              </button>
            </div>


            {/* Freight Rate Section */}

            {/* <h3 className="font-semibold text-lg text-center">Enter Price</h3> */}
            <div className="grid  grid-cols-1 lg:grid-cols-6 md:grid-cols-3 sticky">
              {/* Freight Rate Input */}
              <div className="grid 2xl:grid-cols-2" >
                <label className="text-gray-700 text-[15px] ">Price Per (Kg):</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={freightRate}
                    onChange={(e) => setFreightRate(parseFloat(e.target.value))}
                    className="pl-8 pr-2 py-1 border border-gray-300 rounded-md bg-purple-50 w-32 ml-2"
                  />
                </div>
              </div>
              <div>
                <div className="grid 2xl:grid-cols-2" >
                  <label className="text-gray-700 ml-10 text-[15px]">Tax Rate (%):</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100)}
                    className="pl-2 pr-2 py-1 border border-gray-300 rounded-md bg-purple-50 w-32 ml-2"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <div className="grid 2xl:grid-cols-2" >
                  <label className="text-gray-700 ml-10 text-[15px]" >Chargeable Rate (Kg):</label>
                  <input
                    type="text"
                    value={`${chargeableWeight > 0 ? `${chargeableWeight.toFixed(2)} Kg` : ""}`}
                    onChange={(e) => {

                    }}
                    className="pl-2 pr-2 py-1 border border-gray-300 rounded-md bg-purple-50 w-32 ml-2"
                  />

                </div>
              </div>
              <div>
                <div className="grid 2xl:grid-cols-2" >
                  <label className="text-gray-700 ml-10 text-[15px] ">Total Tax:</label>
                  <input
                    type="text"
                    value={`₹${totalTax.toFixed(2)}`}
                    onChange={(e) => {

                    }}
                    className="pl-2 pr-2 py-1 border border-gray-300 rounded-md bg-purple-50 w-32 ml-2"
                  />
                  {/* <p className="text-gray-700 font-medium ml-2 ">₹{totalTax.toFixed(2)}</p> */}
                </div>
              </div>
              <div>
                <div className="grid 2xl:grid-cols-2" >
                  <label className="text-gray-700 ml-10 text-[15px]">Total Amount:</label>
                  <input
                    type="text"
                    value={`${totalChargeableAmount.toFixed(2)}`}
                    onChange={(e) => {

                    }}
                    className="pl-2 pr-2 py-1 border border-gray-300 rounded-md bg-purple-50 w-32 ml-2"
                  />

                </div>
              </div>
              <div>
                <div className="grid 2xl:grid-cols-2">
                  <label className="text-gray-700 ml-10 text-[15px] ">Total Amount (with Tax):</label>
                  <input
                    type="text"
                    value={`${totalWithTax.toFixed(2)}`}
                    onChange={(e) => {

                    }}
                    className="pl-2 pr-2 py-1 border border-gray-300 rounded-md bg-purple-50 w-32 ml-2"
                  />

                </div>
              </div>


            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-9 md:grid-cols-5 gap-2">


          <input
            type="text"
            name="productname"
            value={formData.productname}
            onChange={handleInputChange}
            placeholder="Package Name"
            className=" p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
          // required
          />


          <input
            type="text"
            name="packageWeight"
            value={chargeableWeight > 0 ? `${chargeableWeight}` : formData.packageWeight || ""}
            onChange={handleInputChange}
            placeholder="Package Weight (kg)"
            className=" p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
            
          />
          <input
            type="text"
            name="noofpackage"
            value={totalPackages > 0 ? `${totalPackages}` : formData.noofpackage || ""}
            onChange={handleInputChange}
            placeholder="No of Packages"
            className=" p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
            
          />
          {/* <input
           type="number"
           name="width"
           value={formData.width}
           onchange={handleInputChange}
           placeholder="width"
           className="w-1/4 p-4 border rounded mb-2"
          />  */}
          <input
            type="text"
            name="price"
            value={totalChargeableAmount > 0 ? `₹${totalChargeableAmount}` : formData.price || ""}
            placeholder="Price (₹)"
            onChange={handleInputChange}
            className=" p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
            
          />

          <select
            name="packagetype"
            value={formData.packagetype}
            onChange={handleInputChange}
            className=" p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
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
            className=" p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
            required
          >
            <option>Select Handling Instruction</option>
            <option>Do not Tilt</option>
            <option>Handle with care</option>
          </select>


          <select
            name="Orderstatus"
            value={formData.Orderstatus}
            onChange={handleInputChange}
            className="   p-4 border-2  bg-purple-50 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2"
            required
          >
            <option value="">Select Order Status</option>
            <option value="Ordered Placed">Ordered Placed</option>
            <option value="Ordered Picked">Ordered Picked</option>
            <option value="Ordered Dispatched">Ordered Dispatched</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

          {formData.Orderstatus === "Ordered Dispatched" && (
            <>
              {/* State Dropdown */}
              <select
                name="dispatchstate"
                value={formData.dispatchstate}
                onChange={handleInputChange}
                className=" p-4 border-2 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
                required
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
                name="dispatchdistrict"
                value={formData.dispatchdistrict}
                onChange={handleInputChange}
                className=" p-4 border-2 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
              >
                <option value="">Select District</option>
                {dispatchDistricts.length > 0 ? (
                  dispatchDistricts.map((district, idx) => (
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
                name="dispatchpincode"
                value={formData.dispatchpincode}
                onChange={handleInputChange}
                className=" p-4 border-2 rounded mb-2 focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
              >
                <option value="">Select Pincode</option>
                {dispatchPincodes.length > 0 ? (
                  dispatchPincodes.map((pincode, idx) => (
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
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, deliveryimage: e.target.files[0] })}
          />

        </div>

        {/* Submit Button */}
        <div className="col-span-3 text-center mt-4 p-4 relative">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-7 py-3 rounded absolute right-0" onClick={handleClick}
          >
            {id ? "Update Order" : "Add Order"}
          </button>
        </div>
      </form>
      <button
        type="" onClick={() => navigate("/Order")}
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
          <Dialog className="bg-white rounded-lg m-8 relative" visible={visible} style={{ width: '80vw', height: '60vh' }} closable={false} >
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
                    <th className="border border-gray-300 p-2">S.NO</th>
                    <th className="border border-gray-300 p-2">Length</th>
                    <th className="border border-gray-300 p-2">Width</th>
                    <th className="border border-gray-300 p-2">Height</th>
                    <th className="border border-gray-300 p-2">Weight</th>
                    <th className="border border-gray-300 p-2">No of Packages</th>
                    <th className="border border-gray-300 p-2">Total Weight</th>
                    <th className="border border-gray-300 p-2">Volumetric Weight</th>
                    <th className="border border-gray-300 p-2">Total Volumetric Weight</th>
                    <th className="border border-gray-300 p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {index + 1}
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
                  Add Product <CornerDownLeft className="ml-2" />
                </button>
              </div>


              {/* Freight Rate Section */}

              <h3 className="font-semibold text-lg text-center">Enter Price</h3>
              <div className="grid justify-self-center">
                {/* Freight Rate Input */}
                <div className="flex items-center">
                  <label className="text-gray-700 mr-2">Price Per (Kg):</label>
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

                <div className="flex items-center mt-4">
                  <label className="text-gray-700 mr-2">Tax Rate (%):</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100)}
                    className="pl-2 pr-2 py-1 border border-gray-300 rounded-md bg-purple-100 w-32"
                    placeholder=""
                  />
                </div>

                {/* Chargeable Rate */}
                <div className="flex justify-between items-center">
                  <label className="text-gray-700">Chargeable Rate (Kg):</label>
                  <p className="text-gray-700 font-medium"> {chargeableWeight > 0 ? `${chargeableWeight.toFixed(2)} Kg` : ""}</p>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-gray-700">Total Tax:</label>
                  <p className="text-gray-700 font-medium">₹{totalTax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <label className="text-gray-700">Total Amount:</label>
                  <p className="text-gray-700 font-medium">₹{totalChargeableAmount.toFixed(2)}</p>
                </div>

                {/* Total  Amount */}
                <div className="flex justify-between items-center pt-4">
                  <label className="font-semibold text-gray-700">Total Amount (with Tax):</label>
                  <p className="font-bold text-gray-800">₹{totalWithTax.toFixed(2)}</p>
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